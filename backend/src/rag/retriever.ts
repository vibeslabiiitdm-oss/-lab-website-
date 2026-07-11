import { Person } from "../models/Person.js";
import { Project } from "../models/Project.js";

export async function retrieveContext(query: string, history: any[] = []): Promise<{ textContext: string, imageContext: string[] }> {
    try {
        const people = await Person.find({});
        const projects = await Project.find({});
        
        const queryLower = query.toLowerCase();
        const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);
        
        // If the query is just "hi", we don't need to attach the whole database
        if (keywords.length === 0 && queryLower.length < 10) {
            return { textContext: "User is just saying hello. Be polite and ask how you can help.", imageContext: [] };
        }
        
        const matchedPeople = people.filter(p => {
            const searchStr = `${p.name} ${p.designation} ${p.bio || ""} ${p.affiliation}`.toLowerCase();
            // Match if any keyword is in the search string, or if we should just include lab heads
            return p.designation.toLowerCase().includes('head') || keywords.some(kw => searchStr.includes(kw));
        }).slice(0, 5); // Limit to top 5 matches
        
        const matchedProjects = projects.filter(p => {
            const searchStr = `${p.title} ${p.description || ""} ${p.abstract || ""}`.toLowerCase();
            return keywords.some(kw => searchStr.includes(kw));
        }).slice(0, 3); // Limit to top 3 matches
        
        let context = "ViBeS LAB KNOWLEDGE BASE:\n\n";
        
        if (matchedPeople.length > 0) {
            context += "RELEVANT LAB MEMBERS:\n";
            matchedPeople.forEach(p => {
                context += `- ${p.name}, ${p.designation} (${p.email}). ${p.bio || ""}\n`;
            });
        }
        
        if (matchedProjects.length > 0) {
            context += "\nRELEVANT RESEARCH PROJECTS:\n";
            matchedProjects.forEach(p => {
                context += `- ${p.title}: ${p.description || p.abstract || ""}\n`;
            });
        }
        
        if (matchedPeople.length === 0 && matchedProjects.length === 0) {
            context += "No specific lab members or projects matched this query. Just answer generally about the lab based on system prompt.";
        }
        
        return { textContext: context, imageContext: [] };
    } catch (e) {
        console.error("Error retrieving context from MongoDB:", e);
        return { textContext: "Failed to retrieve context.", imageContext: [] };
    }
}
