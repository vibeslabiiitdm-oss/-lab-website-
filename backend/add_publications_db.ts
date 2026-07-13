import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const personSchema = new mongoose.Schema({}, { strict: false });
const Person = mongoose.models.Person || mongoose.model("Person", personSchema, "people");

async function addPublications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const pubs = JSON.parse(fs.readFileSync("../frontend/src/data/publications.json", "utf-8"));
    
    // Add to Rahul Raman
    const guide = await Person.findOne({ role: "guide" });
    if (guide) {
      let guideDoc = guide.toObject();
      let changed = false;
      for (const pub of pubs) {
        if (!guideDoc.publications.find((p: any) => p.title === pub.title)) {
          guideDoc.publications.push(pub);
          changed = true;
        }
      }
      if (changed) {
        await Person.updateOne({ _id: guide._id }, { $set: { publications: guideDoc.publications } });
        console.log("Added to Rahul Raman");
      }
    }
    
    // Add to Sukesh Babu
    const sukesh = await Person.findOne({ name: /Sukesh/i });
    if (sukesh) {
      let sukeshDoc = sukesh.toObject();
      let changed = false;
      for (const pub of pubs) {
        if (!sukeshDoc.publications.find((p: any) => p.title === pub.title)) {
          sukeshDoc.publications.push(pub);
          changed = true;
        }
      }
      if (changed) {
        await Person.updateOne({ _id: sukesh._id }, { $set: { publications: sukeshDoc.publications } });
        console.log("Added to Sukesh Babu");
      }
    }

    console.log("Done.");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

addPublications();
