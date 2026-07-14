import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const personSchema = new mongoose.Schema({}, { strict: false });
const Person = mongoose.models.Person || mongoose.model("Person", personSchema, "people");

async function patchAbstracts() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const pubs = JSON.parse(fs.readFileSync("../frontend/src/data/publications.json", "utf-8"));

  const people = await Person.find({});
  for (const person of people) {
    const doc = person.toObject();
    let changed = false;

    const updatedPubs = (doc.publications || []).map((p: any) => {
      const match = pubs.find((np: any) => np.id === p.id || np.title === p.title);
      if (match) {
        changed = true;
        return {
          ...p,
          url: match.url ?? p.url,
          abstract: match.abstract ?? p.abstract ?? "",
          authors: match.authors ?? p.authors ?? "",
        };
      }
      return p;
    });

    if (changed) {
      await Person.updateOne({ _id: person._id }, { $set: { publications: updatedPubs } });
      console.log(`Patched: ${doc.name}`);
    }
  }

  console.log("Done.");
  await mongoose.disconnect();
}

patchAbstracts().catch(console.error);
