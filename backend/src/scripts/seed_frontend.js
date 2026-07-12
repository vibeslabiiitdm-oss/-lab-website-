import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Person } from '../models/Person.js';
dotenv.config();
async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected');
        await Person.deleteMany({});
        await Person.insertMany(allPeople);
        console.log('Seeded ' + allPeople.length);
        process.exit(0);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seedDatabase();
