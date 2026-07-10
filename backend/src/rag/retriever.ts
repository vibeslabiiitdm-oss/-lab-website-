import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import * as lancedb from "@lancedb/lancedb";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { pipeline, env } from "@xenova/transformers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

env.allowLocalModels = true;
env.useBrowserCache = false;

const LANCE_DIR = path.resolve(process.cwd(), "lancedb_data");

let clipExtractor: any = null;
let crossEncoder: any = null;

async function getClipExtractor() {
  if (!clipExtractor) clipExtractor = await pipeline("feature-extraction", "Xenova/clip-vit-base-patch32");
  return clipExtractor;
}

async function getCrossEncoder() {
  // Using a fast classification model for reranking in transformers.js
  if (!crossEncoder) crossEncoder = await pipeline("text-classification", "Xenova/ms-marco-MiniLM-L-6-v2");
  return crossEncoder;
}

// Multi-query generator
async function expandQuery(query: string, history: any[]): Promise<string[]> {
    const slm = new ChatGoogleGenerativeAI({ model: "gemini-3.5-flash", temperature: 0.2 });
    
    // First, rewrite query using history (Conversation Memory)
    const historyText = history.map((m: any) => `${m.role}: ${m.content}`).join("\n");
    const rewritePrompt = ChatPromptTemplate.fromTemplate(`
You are an AI assistant. Given the following conversation history and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
If there is no history, just return the query as is.
Chat History:
{history}
Follow Up Input: {query}
Standalone question:`);
    const chain1 = rewritePrompt.pipe(slm);
    const standalone = await chain1.invoke({ history: historyText, query });
    const standaloneQuery = typeof standalone.content === "string" ? standalone.content : query;

    // Second, expand into 3 variations for better recall
    const expandPrompt = ChatPromptTemplate.fromTemplate(`
You are an AI language model assistant. Your task is to generate 3 different versions of the given user question to retrieve relevant documents from a vector database. 
Include domain-specific variations (e.g., if the user asks for "hardware blueprint", expand to "robot blueprint", "AGV blueprint", "mechanical prototype", "laboratory equipment").
By generating multiple perspectives on the user question, your goal is to help the user overcome some of the limitations of the distance-based similarity search.
Provide these alternative questions separated by newlines.
Original question: {question}`);
    const chain2 = expandPrompt.pipe(slm);
    const variationsRes = await chain2.invoke({ question: standaloneQuery });
    const variations = typeof variationsRes.content === "string" ? variationsRes.content.split("\n").filter(l => l.trim()) : [];
    
    return [standaloneQuery, ...variations];
}

export async function retrieveContext(query: string, history: any[] = []): Promise<{ textContext: string, imageContext: string[] }> {
    try {
        const response = await fetch("http://localhost:8000/retrieve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, top_k: 10 })
        });
        
        if (!response.ok) {
            console.error("Python API returned error status:", response.status);
            return { textContext: "Failed to retrieve context.", imageContext: [] };
        }
        
        const data = await response.json();
        return { textContext: data.context || "No relevant context found.", imageContext: [] };
    } catch (e) {
        console.error("Error connecting to Python retriever API (ensure api.py is running on port 8000):", e);
        return { textContext: "Failed to retrieve context.", imageContext: [] };
    }
}
