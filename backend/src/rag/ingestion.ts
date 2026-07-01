import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import * as lancedb from "@lancedb/lancedb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { env, pipeline } from "@xenova/transformers";
import Tesseract from "tesseract.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Graph = require("graphology");
const pdf = require("pdf-parse");

import { Person } from "../models/Person.js";
import { Project } from "../models/Project.js";
import { Resource } from "../models/Resource.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

env.allowLocalModels = true;
env.useBrowserCache = false;

const LANCE_DIR = path.resolve(process.cwd(), "lancedb_data");
const FRONTEND_PUBLIC_DIR = path.resolve(process.cwd(), "../frontend/public");
const FRONTEND_SRC_DIR = path.resolve(process.cwd(), "../frontend/src/routes");

let clipExtractor: any = null;
async function getClipExtractor() {
  if (!clipExtractor) {
    console.log("Loading CLIP Vision Model...");
    clipExtractor = await pipeline("feature-extraction", "Xenova/clip-vit-base-patch32");
  }
  return clipExtractor;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const visionModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function embedImage(absolutePath: string): Promise<number[]> {
  try {
    const extractor = await getClipExtractor();
    const out = await extractor(absolutePath);
    return Array.from(out.data);
  } catch (err) {
    return new Array(512).fill(0);
  }
}

async function extractVisionMetadata(absolutePath: string, retries = 3): Promise<any> {
    try {
        const fileBytes = fs.readFileSync(absolutePath);
        const mimeType = absolutePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
        const imagePart = { inlineData: { data: fileBytes.toString("base64"), mimeType } };
        const prompt = `Analyze this image in the context of the ViBeS Lab at IIITDM.
Provide a JSON response with the following strictly formatted keys:
{
  "title": "Short descriptive title",
  "description": "Detailed description of what is visible",
  "keywords": ["tag1", "tag2", "tag3"]
}`;
        // Ensure we don't hit the 15 RPM free tier limit
        await sleep(4500); 
        const result = await visionModel.generateContent([prompt, imagePart]);
        const response = result.response.text();
        const jsonStr = response.replace(/```json/gi, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch(e: any) {
        if (e.status === 429 && retries > 0) {
            console.log("Rate limited! Retrying in 10s...");
            await sleep(10000);
            return extractVisionMetadata(absolutePath, retries - 1);
        }
        return { title: "Unknown Image", description: "Could not generate description.", keywords: [] };
    }
}

// @ts-ignore
const knowledgeGraph = new Graph();
function addGraphRelation(subject: string, relation: string, object: string) {
    if (!knowledgeGraph.hasNode(subject)) knowledgeGraph.addNode(subject);
    if (!knowledgeGraph.hasNode(object)) knowledgeGraph.addNode(object);
    if (!knowledgeGraph.hasEdge(subject, object)) {
        knowledgeGraph.addDirectedEdge(subject, object, { type: relation });
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Recursively walk a directory
function walkSync(dir: string, filelist: string[] = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  }
  return filelist;
}

export async function runIngestion() {
  console.log("Starting Advanced RAG Ingestion Pipeline (Phase 2)...");
  
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);

  const db = await lancedb.connect(LANCE_DIR);
  const textEmbeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-2",
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 200 });

  const tableNames = await db.tableNames();
  if (tableNames.includes("vibes_text")) await db.dropTable("vibes_text");
  if (tableNames.includes("vibes_images")) await db.dropTable("vibes_images");

  const textRecords: any[] = [];
  const imageRecords: any[] = [];

  let metrics = { docs: 0, pdfs: 0, imagesProcessed: 0, ocrHits: 0, staticPages: 0 };

  async function addTextChunk(text: string, metadata: any) {
    try {
        const vector = await textEmbeddings.embedQuery(text);
        textRecords.push({ vector, text, type: metadata.type || "General", sourceId: metadata.sourceId || "Unknown", metadata: JSON.stringify(metadata) });
    } catch(e) { }
  }

  async function processImage(imagePath: string, parentContext: string) {
    metrics.imagesProcessed++;
    let absolutePath = imagePath;
    if (!path.isAbsolute(imagePath)) {
        absolutePath = path.join(FRONTEND_PUBLIC_DIR, imagePath.replace(/^\//, ""));
    }
    if (!fs.existsSync(absolutePath)) return;

    // 1. CLIP Embedding
    const vector = await embedImage(absolutePath);
    
    // 2. Vision Metadata (Gemini)
    const visionMeta = await extractVisionMetadata(absolutePath);
    const relPath = imagePath.replace(FRONTEND_PUBLIC_DIR, "").replace(/\\/g, "/");
    const safeRelPath = relPath.startsWith("/") ? relPath : `/${relPath}`;
    const visionText = `Image Vision Metadata: Title: ${visionMeta.title}. Description: ${visionMeta.description}. Tags: ${visionMeta.keywords.join(", ")}. Related to: ${parentContext}`;
    
    // 3. OCR (Tesseract)
    let ocrText = "";
    try {
        const { data: { text } } = await Tesseract.recognize(absolutePath, "eng");
        if (text && text.trim().length > 10) {
            ocrText = text.trim();
            metrics.ocrHits++;
        }
    } catch (e) {}

    // Store Image Vector
    if (vector.some((v: number) => v !== 0)) {
        imageRecords.push({ vector, imagePath: safeRelPath, caption: visionMeta.title, metadata: JSON.stringify({ type: "Image", sourceId: safeRelPath, tags: visionMeta.keywords }) });
    }

    // Store Text Vectors (Vision + OCR)
    const combinedText = visionText + (ocrText ? `\nOCR Extracted Text:\n${ocrText}` : "");
    const chunks = await textSplitter.splitText(combinedText);
    for (let i = 0; i < chunks.length; i++) {
        await addTextChunk(chunks[i], { type: "Image Understanding", sourceId: safeRelPath, chunkIndex: i, parentText: combinedText });
    }
  }

  // 1. INDEX MONGODB
  console.log("Indexing MongoDB (People, Projects, Publications, Resources)...");
  const people = await Person.find({}).lean();
  for (const p of people) {
    metrics.docs++;
    let fullText = `Person: ${p.name}\nRole: ${p.role}\nEmail: ${p.email || "N/A"}\nBio: ${p.bio}\nDomains: ${(p.domains || []).join(", ")}`;
    if (p.projects && p.projects.length > 0) fullText += `\nPast Projects: ${p.projects.join("; ")}`;
    if (p.researchProject) {
        fullText += `\nCurrent Research: ${p.researchProject.title}\n`;
        addGraphRelation(p.name, "RESEARCHES", p.researchProject.title);
        if (p.researchProject.images) {
            for (const img of p.researchProject.images) await processImage(img, `Project ${p.researchProject.title} by ${p.name}`);
        }
    }
    if (p.avatar) await processImage(p.avatar, `Profile photo of ${p.name}`);
    const chunks = await textSplitter.splitText(fullText);
    for (let i = 0; i < chunks.length; i++) await addTextChunk(chunks[i], { type: "Person", sourceId: p.name, parentText: fullText });
    if (p.role.includes("guide")) addGraphRelation(p.name, "LEADS", "ViBeS Lab");
    
    if (p.publications) {
        for (const pub of p.publications) {
            metrics.docs++;
            const pubText = `Publication: ${pub.title}\nAuthor: ${p.name}\nVenue: ${pub.venue}\nYear: ${pub.year}\nLink: ${pub.url || "N/A"}`;
            const pChunks = await textSplitter.splitText(pubText);
            for (let i = 0; i < pChunks.length; i++) await addTextChunk(pChunks[i], { type: "Publication", sourceId: pub.title, parentText: pubText });
            addGraphRelation(p.name, "WROTE", pub.title);
        }
    }
  }

  const projects = await Project.find({}).lean();
  for (const prj of projects) {
      metrics.docs++;
      const text = `Project: ${prj.title}\nTagline: ${prj.tagline}\nPurpose: ${prj.purpose}\nDescription: ${prj.description}\nResults: ${(prj.results||[]).join(", ")}\nTech: ${(prj.tech||[]).join(", ")}\nStatus: ${prj.status}`;
      const chunks = await textSplitter.splitText(text);
      for (let i=0; i<chunks.length; i++) await addTextChunk(chunks[i], { type: "Project", sourceId: prj.title });
  }

  const resources = await Resource.find({}).lean();
  for (const r of resources) {
      metrics.docs++;
      const text = `Equipment/Resource: ${r.name}\nDetail: ${r.detail}`;
      await addTextChunk(text, { type: "Resource", sourceId: r.name });
  }

  // 2. INDEX PDFS (Public folder)
  console.log("Scanning for PDFs in public folder...");
  const allFiles = walkSync(FRONTEND_PUBLIC_DIR);
  for (const file of allFiles) {
      if (file.toLowerCase().endsWith(".pdf")) {
          metrics.pdfs++;
          try {
              const dataBuffer = fs.readFileSync(file);
              const data = await pdf(dataBuffer);
              const chunks = await textSplitter.splitText(data.text);
              const relativePath = file.replace(FRONTEND_PUBLIC_DIR, "").replace(/\\/g, "/");
              for (let i=0; i<chunks.length; i++) {
                  await addTextChunk(chunks[i], { type: "PDF Document", sourceId: relativePath, chunkIndex: i });
              }
          } catch(e) {
              console.warn("Failed to parse PDF", file);
          }
      }
      
      // Standalone images in public folder that are not in DB (e.g., gallery, loose blueprints)
      if (file.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
          // Check if we already processed it (simplistic deduplication)
          const relPath = file.replace(FRONTEND_PUBLIC_DIR, "").replace(/\\/g, "/");
          if (!imageRecords.some(r => r.imagePath === relPath)) {
              await processImage(file, "Standalone Image from website gallery/public folder");
          }
      }
  }

  // 3. INDEX STATIC REACT HTML PAGES
  console.log("Scanning static React pages...");
  const staticFiles = walkSync(FRONTEND_SRC_DIR);
  for (const file of staticFiles) {
      if (file.endsWith("about.tsx") || file.endsWith("contact.tsx")) {
          metrics.staticPages++;
          const content = fs.readFileSync(file, "utf-8");
          // Very rudimentary extraction: removing jsx tags and code logic
          const cleanText = content.replace(/import.*?;/g, "").replace(/export const.*?=> {/g, "").replace(/<[^>]*>?/gm, " ").trim();
          const chunks = await textSplitter.splitText(`Static Page (${path.basename(file)}):\n${cleanText}`);
          for (let i=0; i<chunks.length; i++) await addTextChunk(chunks[i], { type: "Static Page", sourceId: path.basename(file) });
      }
  }

  if (textRecords.length > 0) {
    await db.createTable("vibes_text", textRecords);
  }
  if (imageRecords.length > 0) {
    await db.createTable("vibes_images", imageRecords);
  }

  if (!fs.existsSync(LANCE_DIR)) fs.mkdirSync(LANCE_DIR, { recursive: true });
  fs.writeFileSync(path.join(LANCE_DIR, "graph.json"), JSON.stringify(knowledgeGraph.export(), null, 2));

  await mongoose.disconnect();
  
  console.log("\n=================================");
  console.log("INDEXING VERIFICATION REPORT");
  console.log("=================================");
  console.log(`Total MongoDB documents indexed: ${metrics.docs}`);
  console.log(`Total Static pages indexed: ${metrics.staticPages}`);
  console.log(`Total PDFs parsed: ${metrics.pdfs}`);
  console.log(`Total Images processed (Vision+CLIP): ${metrics.imagesProcessed}`);
  console.log(`Total OCR hits: ${metrics.ocrHits}`);
  console.log(`Total Vectors stored in LanceDB (Text): ${textRecords.length}`);
  console.log(`Total Vectors stored in LanceDB (Images): ${imageRecords.length}`);
  console.log(`Total Graph Nodes: ${knowledgeGraph.order}`);
  console.log(`Total Graph Edges: ${knowledgeGraph.size}`);
  console.log("=================================\n");
  console.log("Ingestion Complete!");
}

import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runIngestion().catch(console.error);
}
