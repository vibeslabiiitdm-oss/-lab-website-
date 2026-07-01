import * as lancedb from "@lancedb/lancedb";
import { pipeline } from "@xenova/transformers";

async function main() {
    console.log("Loading model...");
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    
    console.log("Extracting query...");
    const out = await extractor("Who is rahul raman?", { pooling: "mean", normalize: true });
    const queryVector = Array.from(out.data);
    
    console.log("Opening LanceDB...");
    const db = await lancedb.connect("../chatbot/lancedb_data");
    const table = await db.openTable("vibes_knowledge");
    
    console.log("Searching...");
    const results = await table.vectorSearch(queryVector).limit(5).toArray();
    
    for (const res of results) {
        console.log(`[Score: ${res._distance}] ${res.text.substring(0, 100)}`);
    }
}
main().catch(console.error);
