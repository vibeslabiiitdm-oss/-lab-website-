import mongoose from "mongoose";

const uri = "mongodb://vempalisailinisha_db_user:lmyAkiM39o8jLaK6@ac-cxi6sad-shard-00-00.teek0ex.mongodb.net:27017/vibes_lab?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(uri);
  const Person = mongoose.model("Person", new mongoose.Schema({}, { strict: false }));
  const people = await Person.find({ id: { $in: ["scholar-cs25m1014", "scholar-cs23b2007", "scholar-cs24d0001"] } });
  for (const p of people) {
    console.log(p.get("id"), p.get("name"), "Avatar:", p.get("avatar"), "Resume:", p.get("resume"));
  }
  await mongoose.disconnect();
}

run().catch(console.error);
