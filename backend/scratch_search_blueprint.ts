import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Person } from "./src/models/Person.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const people = await Person.find({}, '-createdAt -updatedAt -__v -_id').lean();
  const allBlueprints = [];

  people.forEach((p) => {
    if (p.researchProject) {
        if (p.researchProject.images && p.researchProject.images.length > 0) {
             allBlueprints.push(`Project by ${p.name}: ${p.researchProject.title}\nImages (Blueprints): ${p.researchProject.images.join(", ")}`);
        }
    }
  });

  const docs = [
    `Hardware Blueprints, Prototypes, and Research Project Photos:\n\n${allBlueprints.join("\n\n")}`,
    `Project: Monocular Depth Analysis Controlled GPS Denied AGV Navigation\nPurpose: Develop an autonomous navigation and tracking system for AGVs using monocular depth estimation where GPS is unavailable.\nApproach: undefined\nResults: Depth estimation models implemented,AGV prototype in development\nDomains: undefined\nStatus: Ongoing`
  ];

  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-2",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const vectors = await embeddingsModel.embedDocuments(docs);
  
  const query = "photos of hardware blueprint";
  const queryVector = await embeddingsModel.embedQuery(query);
  
  const scoredDocs = docs.map((content, i) => ({
      content: content.substring(0, 50) + "...",
      score: cosineSimilarity(queryVector, vectors[i])
  }));
  
  scoredDocs.sort((a, b) => b.score - a.score);
  console.log(scoredDocs);
  
  process.exit(0);
}

run();
