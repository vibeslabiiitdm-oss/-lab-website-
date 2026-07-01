import { Person } from "./src/models/Person.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const people = await Person.find({}, '-createdAt -updatedAt -__v -_id').lean();
  const allBlueprints = [];

  people.forEach((p) => {
    if (p.researchProject) {
        if (p.researchProject.images && p.researchProject.images.length > 0) {
             allBlueprints.push(`Project by ${p.name}: ${p.researchProject.title}\nImages (Blueprints): ${p.researchProject.images.join(", ")}`);
        }
    }
  });

  console.log("Blueprints found:", allBlueprints.length);
  console.log(allBlueprints);
  process.exit(0);
}

run();
