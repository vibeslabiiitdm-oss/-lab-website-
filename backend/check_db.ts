import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const personSchema = new mongoose.Schema({}, { strict: false });
const Person = mongoose.models.Person || mongoose.model("Person", personSchema, "people");

async function checkUnderReview() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const people = await Person.find({});
    
    let count = 0;
    for (const person of people) {
      const doc = person.toObject();
      if (doc.publications && Array.isArray(doc.publications)) {
        for (const pub of doc.publications) {
          if ((pub.title && pub.title.toLowerCase().includes("under review")) ||
              (pub.venue && pub.venue.toLowerCase().includes("under review"))) {
            console.log(`Found under review pub in ${doc.name}: ${pub.title} - ${pub.venue}`);
            count++;
          }
        }
      }
    }
    console.log(`Total 'under review' papers in MongoDB: ${count}`);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUnderReview();
