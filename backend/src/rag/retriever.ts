import { Person } from "../models/Person.js";
import { Project } from "../models/Project.js";

export async function retrieveContext(query: string, history: any[] = []): Promise<{ textContext: string, imageContext: string[] }> {
    try {
        // Fallback: Just fetch data directly from MongoDB since Python isn't deployed on Render
        const people = await Person.find({});
        const projects = await Project.find({});
        
        let context = "ViBeS LAB KNOWLEDGE BASE:\n\nLAB MEMBERS:\n";
        people.forEach(p => {
            context += `- ${p.name}, ${p.designation} (${p.email}). ${p.bio || ""}\n`;
        });
        
        context += "\nRESEARCH PROJECTS:\n";
        projects.forEach(p => {
            context += `- ${p.title}\n`;
        });
        
        return { textContext: context, imageContext: [] };
    } catch (e) {
        console.error("Error retrieving context from MongoDB:", e);
        return { textContext: "Failed to retrieve context.", imageContext: [] };
    }
}
