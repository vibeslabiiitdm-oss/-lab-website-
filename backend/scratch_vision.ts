import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function main() {
    const p = "C:/Users/vempa/OneDrive/Desktop/Lab Website/frontend/public/images/rover/1.jpg";
    const fileBytes = fs.readFileSync(p);
    const mimeType = "image/jpeg";
    const imagePart = { inlineData: { data: fileBytes.toString("base64"), mimeType } };
    try {
        const res = await visionModel.generateContent(["Describe this", imagePart]);
        console.log(res.response.text());
    } catch(e) {
        console.error("VISION ERROR:", e);
    }
}
main();
