import express from "express";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import { retrieveContext } from "../rag/retriever.js";
// Restart trigger

const router = express.Router();

// 1. RESPONSE CACHE
const responseCache = new Map<string, any>();

// 2. LLM INITIALIZATION (Using Local Ollama)
// Initialize outside the request to reuse the instance and maintain keepAlive
const slm = new ChatOllama({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3.2",
  temperature: 0.2,
  numCtx: 4096, // Pre-allocate context window to prevent memory reallocation slowdowns
  keepAlive: "24h", // Keep model loaded in memory for 24 hours
});

router.post("/", async (req, res) => {
  try {
    const { message, history, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    // Generate a unique cache key based on the exact request
    const cacheKey = JSON.stringify({ message, history, image });
    if (responseCache.has(cacheKey)) {
      console.log("Serving cached response for:", message);
      const cached = responseCache.get(cacheKey);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`data: ${JSON.stringify({ chunk: cached.answer })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      return res.end();
    }

    const recentHistory = (history || []).slice(-2); // ONLY KEEP LAST 2 MESSAGES TO PREVENT CONTEXT BLOAT
    const formattedHistory = recentHistory.map((msg: any) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });

    // 3. RETRIEVAL PHASE (RAG)
    const t0 = performance.now();
    let context = "";
    if (message) {
       const retrievalResult = await retrieveContext(message, formattedHistory);
       context = retrievalResult.textContext;
    }

    const t1 = performance.now();
    console.log(`[PERF] Retrieval Time: ${(t1 - t0).toFixed(2)} ms`);

    console.log("----- RETRIEVED CONTEXT FOR LLM -----");
    console.log(context);
    console.log("-------------------------------------");

    const tPrompt1 = performance.now();
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an intelligent digital assistant for the ViBeS Lab website. 
Answer the questions based on the provided context only. 

CRITICAL INSTRUCTION FOR SOURCE CITATIONS:
You MUST append Source Citations to your claims by referencing the metadata attached to the retrieved chunks. For example, if you get a fact from "[Source: Publication - Deep Learning Paper]", append "[Source: Publication - Deep Learning Paper]" to the end of your sentence.

CRITICAL INSTRUCTION FOR HALLUCINATION PREVENTION:
If the requested information is not available in the indexed ViBeS Lab knowledge base context provided below, you MUST respond honestly, for example: "I couldn't find this information in the current ViBeS Lab knowledge base."
Never invent or fabricate answers.

CRITICAL INSTRUCTION FOR PHOTOS/IMAGES:
Images are provided in the context using standard Markdown syntax, for example: '![Image Found](/path/to/image.jpg)'. 
When you reference an item that has an image, you MUST output its markdown image tag EXACTLY as it appears in the context. 
Do not guess or hallucinate image URLs. If no image is provided in the context for an item, politely state that you do not have photos for it.

Unless explicitly stated otherwise in the data, ALWAYS use gender-neutral pronouns (they/them/their).

LAB CONTACT INFORMATION:
- Address: IIITDM Kancheepuram, Chennai 600127
- Email: vibeslab.iiitdm@gmail.com
- Phone: +91 8763797907

<context>
{context}
</context>`,
      ],
      new MessagesPlaceholder("history"),
      ["user", "{input}"],
    ]);

    const chain = prompt.pipe(slm);
    const tPrompt2 = performance.now();
    console.log(`[PERF] Prompt Construction Time: ${(tPrompt2 - tPrompt1).toFixed(2)} ms`);

    let inputContent: any = message;
    if (image) {
      inputContent = [
        { type: "text", text: message || "Please analyze this image based on the lab's context." },
        { type: "image_url", image_url: image }
      ];
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const abortController = new AbortController();
    req.on('close', () => {
      console.log('Client disconnected, aborting generation.');
      abortController.abort();
    });

    const t2 = performance.now();
    const stream = await chain.stream({
      context: context,
      history: formattedHistory,
      input: inputContent,
    }, { signal: abortController.signal });

    let fullAnswer = "";
    for await (const chunk of stream) {
      if (chunk.content) {
        fullAnswer += chunk.content;
        res.write(`data: ${JSON.stringify({ chunk: chunk.content })}\n\n`);
      }
    }
    const t3 = performance.now();
    console.log(`[PERF] LLM Generation Time: ${(t3 - t2).toFixed(2)} ms`);
    console.log(`[PERF] Total Response Time: ${(t3 - t0).toFixed(2)} ms`);

    res.write(`data: [DONE]\n\n`);
    res.end();

    const finalResult = { answer: fullAnswer, debugContext: context };
    responseCache.set(cacheKey, finalResult);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log("Chat generation stopped (user aborted). Returning partial.");
      res.write(`data: [DONE]\n\n`);
      return res.end();
    }
    
    console.error("Chat API error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || "Failed to process chat request." });
    }
    res.write(`data: ${JSON.stringify({ error: error.message || "Failed to process chat request." })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    return res.end();
  }
});

// Admin Route to re-index RAG Database
import { runIngestion } from "../rag/ingestion.js";

router.post("/reindex", async (req, res) => {
    try {
        await runIngestion();
        res.json({ message: "Re-indexing complete!" });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
