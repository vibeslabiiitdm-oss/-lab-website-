import { MongoClient } from 'mongodb';

async function run() {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('vibes_lab');
    const people = database.collection('people');
    
    const laxmi = await people.findOne({ name: /Laxmi Nivas/i });
    console.log(laxmi);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
