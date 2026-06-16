import { scholars, supervisedProjects } from "./../frontend/src/data/lab.js";

console.log("Checking scholars for missing researchProject configurations...");

for (const s of scholars) {
  // Try to find a matching supervised project by roll number (e.g. from email/id or name)
  const rollNo = s.id.replace("scholar-", "").toUpperCase();
  const match = supervisedProjects.find(p => p.rollNo.toUpperCase() === rollNo || s.name.toLowerCase().includes(p.studentName.toLowerCase()) || p.studentName.toLowerCase().includes(s.name.toLowerCase()));
  
  if (match) {
    if (!s.researchProject) {
      console.log(`\nScholar: ${s.name} (${s.id})`);
      console.log(`- MATCHED Supervised Project: "${match.title}"`);
      console.log(`- status: researchProject is MISSING!`);
    } else {
      // Checked
    }
  } else {
    if (!s.researchProject) {
      console.log(`Scholar: ${s.name} (${s.id}) - No supervised project match and researchProject is MISSING!`);
    }
  }
}
