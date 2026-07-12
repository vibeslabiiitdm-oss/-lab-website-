import { allPeople } from '../scratch/lab.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import fs from 'fs';

// Read .env from backend directory manually
const envConfig = dotenv.parse(fs.readFileSync('C:/Users/vempa/OneDrive/Desktop/Lab Website/backend/.env'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const PersonSchema = new mongoose.Schema({
  id: String,
  role: String,
  category: String,
  name: String,
  designation: String,
  affiliation: String,
  email: String,
  bio: String,
  joined: Number,
  image: String,
  avatar: String,
  resume: String,
  domains: [String],
  skills: [String],
  education: Array,
  publications: Array,
  awards: Array,
  conferences: Array,
  links: Array,
  researchProject: Object
});

const Person = mongoose.models.Person || mongoose.model("Person", PersonSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");
    await Person.deleteMany({});
    
    // Some static records might be missing the "image" field or have it named differently.
    // Ensure all people are inserted properly.
    await Person.insertMany(allPeople);
    console.log("Successfully inserted " + allPeople.length + " people.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
