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
            const searchStr = `${p.title} ${p.description || ""}`.toLowerCase();
            return keywords.some(kw => searchStr.includes(kw));
        }).slice(0, 3); // Limit to top 3 matches
        
        let context = "ViBeS LAB KNOWLEDGE BASE:\n\n";
        
        if (matchedPeople.length > 0) {
            context += "RELEVANT LAB MEMBERS:\n";
            matchedPeople.forEach(p => {
                context += `\n### ${p.name}\n- Designation: ${p.designation}\n- Email: ${p.email}\n- Bio: ${p.bio || ""}\n`;
                if (p.avatar) context += `- Photo: ![${p.name}](${p.avatar})\n`;
                if (p.resume) context += `- Resume: [Download Resume](${p.resume})\n`;
                if (p.domains && p.domains.length > 0) context += `- Research Domains: ${p.domains.join(", ")}\n`;
                if (p.skills && p.skills.length > 0) context += `- Skills: ${p.skills.join(", ")}\n`;
                if (p.education && p.education.length > 0) {
                    context += `- Education:\n`;
                    p.education.forEach((ed: any) => {
                        context += `  * ${ed.degree} in ${ed.field}, ${ed.institute} (${ed.year})\n`;
                    });
                }
                if (p.publications && p.publications.length > 0) {
                    context += `- Publications:\n`;
                    p.publications.forEach((pub: any) => {
                        context += `  * "${pub.title}" (${pub.venue} ${pub.year})\n`;
                    });
                }
                if (p.experience && p.experience.length > 0) {
                    context += `- Experience:\n`;
                    p.experience.forEach((exp: any) => {
                        context += `  * ${exp.role} at ${exp.org} (${exp.duration})\n`;
                    });
                }
                if (p.awards && p.awards.length > 0) {
                    context += `- Awards:\n`;
                    p.awards.forEach((aw: any) => {
                        context += `  * ${aw.title} from ${aw.org} (${aw.year})\n`;
                    });
                }
                if (p.researchProject && p.researchProject.title) {
                    context += `- Current Research Project: ${p.researchProject.title}\n`;
                    context += `  * Abstract: ${p.researchProject.abstract}\n`;
                    if (p.researchProject.results && p.researchProject.results.length > 0) {
                        context += `  * Results: ${p.researchProject.results.join("; ")}\n`;
                    }
                    if (p.researchProject.images && p.researchProject.images.length > 0) {
                        p.researchProject.images.forEach((img: string, i: number) => {
                             context += `  * Hardware/Blueprint Photo ${i+1}: ![Blueprint ${i+1}](${img})\n`;
                        });
                    }
                }
            });
        }
        
        if (matchedProjects.length > 0) {
            context += "\nRELEVANT RESEARCH PROJECTS:\n";
            matchedProjects.forEach(p => {
                context += `\n### ${p.title}\n`;
                if (p.tagline) context += `- Tagline: ${p.tagline}\n`;
                if (p.domain) context += `- Domain: ${p.domain}\n`;
                if (p.status) context += `- Status: ${p.status} (Year: ${p.year})\n`;
                if (p.purpose) context += `- Purpose: ${p.purpose}\n`;
                if (p.description) context += `- Description: ${p.description}\n`;
                if (p.tech && p.tech.length > 0) context += `- Technologies Used: ${p.tech.join(", ")}\n`;
                if (p.collaborators && p.collaborators.length > 0) context += `- Collaborators: ${p.collaborators.join(", ")}\n`;
                if (p.results && p.results.length > 0) {
                    context += `- Key Results:\n`;
                    p.results.forEach((res: string) => {
                        context += `  * ${res}\n`;
                    });
                }
                if (p.image) context += `- Project Image: ![${p.title}](${p.image})\n`;
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
