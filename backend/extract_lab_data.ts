import fs from 'fs';
import path from 'path';

import { 
  allPeople, 
  projects, 
  achievements,
  supervisedProjects,
  resources,
  labStats
} from '../frontend/src/data/lab.ts';

const output = {
  allPeople,
  projects,
  achievements,
  supervisedProjects,
  resources,
  labStats
};

const outputPath = path.join(process.cwd(), '..', 'chatbot', 'lab_data.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Successfully exported data to ${outputPath}`);
