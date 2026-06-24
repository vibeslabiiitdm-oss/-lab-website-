import mongoose from 'mongoose';

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/vibes_lab');
  const db = mongoose.connection.db;
  const person = await db.collection('people').findOne({ name: /Laxmi Nivas/i });
  console.log(person);
  await mongoose.disconnect();
}

run().catch(console.dir);
