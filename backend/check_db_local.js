import mongoose from "mongoose";

const uri = "mongodb://vempalisailinisha_db_user:lmyAkiM39o8jLaK6@ac-cxi6sad-shard-00-00.teek0ex.mongodb.net:27017/vibes_lab?ssl=true&authSource=admin&retryWrites=true&w=majority";

async function run() {
  await mongoose.connect(uri);
  const Person = mongoose.model("Person", new mongoose.Schema({}, { strict: false }));
  const p = await Person.findOne({ name: "Devika K" });
  console.log(JSON.stringify(p, null, 2));
  await mongoose.disconnect();
}

run().catch(console.error);
