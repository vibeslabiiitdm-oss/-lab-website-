const fs = require('fs');
const code = fs.readFileSync('c:/Users/vempa/OneDrive/Desktop/Lab Website/frontend/src/data/lab.ts', 'utf8');
const start = code.indexOf('export const guide');
const end = code.indexOf('export const allPeople = [guide, ...scholars];') + 50;
let peopleCode = code.substring(start, end).replace(/export const/g, 'const');

// The peopleCode might have image imports like: import rahulImg from "...";
// We need to just stringify or remove them, but wait! In frontend/src/data/lab.ts, they don't import images!
// The images are defined as `image: "/team/someone.jpg"`. Let me double check that.

const seedCode = `import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Person } from '../models/Person.js';
dotenv.config();

// Dummy types
type Person = any;
type Project = any;
type Publication = any;
type Achievement = any;

${peopleCode}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected');
    await Person.deleteMany({});
    await Person.insertMany(allPeople);
    console.log('Seeded ' + allPeople.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
seedDatabase();
`;

fs.writeFileSync('c:/Users/vempa/OneDrive/Desktop/Lab Website/backend/src/scripts/seed_frontend.ts', seedCode);
