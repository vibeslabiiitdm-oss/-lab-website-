import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { User } from "./models/User.js";
import { Person } from "./models/Person.js";
import { Project } from "./models/Project.js";
import { Achievement } from "./models/Achievement.js";
import { SupervisedProject } from "./models/Supervised.js";
import { Resource } from "./models/Resource.js";

// Direct TS imports from frontend lab data
import {
  allPeople,
  projects,
  achievements,
  supervisedProjects,
  resources,
} from "../../frontend/src/data/lab.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vibes_lab";

const seedDatabase = async () => {
  try {
    console.log("Connecting to database at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing data
    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Person.deleteMany({});
    await Project.deleteMany({});
    await Achievement.deleteMany({});
    await SupervisedProject.deleteMany({});
    await Resource.deleteMany({});
    console.log("Collections cleared successfully.");

    // 1. Seed Default Admin User
    console.log("Seeding default admin accounts...");
    const defaultPassword = "password123";
    const hashedAdminPassword = await bcrypt.hash(defaultPassword, 10);
    
    const adminUser = new User({
      name: "Dr. Rahul Raman",
      email: "rahul@iiitdm.ac.in",
      password: hashedAdminPassword,
      role: "Professor",
    });
    await adminUser.save();
    console.log(`Admin user registered: rahul@iiitdm.ac.in (password: "${defaultPassword}")`);

    // 2. Seed Lab Members (Person)
    console.log(`Seeding ${allPeople.length} lab members...`);
    const formattedPeople = allPeople.map(p => {
      // Ensure category is either PhD/PG/UG/Alumni or null
      const category = p.category && ["PhD", "PG", "UG", "Alumni"].includes(p.category)
        ? p.category
        : null;

      return {
        ...p,
        category,
        bio: p.bio || "",
        domains: p.domains || [],
        skills: p.skills || [],
        education: p.education || [],
        publications: p.publications || [],
        awards: p.awards || [],
        conferences: p.conferences || [],
        links: p.links || [],
        teaching: p.teaching || [],
        experience: p.experience || [],
        projects: p.projects || [],
        professionalService: p.professionalService || [],
        outreachActivities: p.outreachActivities || [],
      };
    });
    await Person.insertMany(formattedPeople);
    console.log("Lab members seeded successfully.");

    // 3. Seed Projects
    console.log(`Seeding ${projects.length} research projects...`);
    await Project.insertMany(projects);
    console.log("Research projects seeded successfully.");

    // 4. Seed Achievements
    console.log(`Seeding ${achievements.length} achievements/milestones...`);
    await Achievement.insertMany(achievements);
    console.log("Achievements seeded successfully.");

    // 5. Seed Supervised Thesis Projects
    console.log(`Seeding ${supervisedProjects.length} supervised projects...`);
    await SupervisedProject.insertMany(supervisedProjects);
    console.log("Supervised projects seeded successfully.");

    // 6. Seed Equipment Resources
    console.log(`Seeding ${resources.length} equipment resources...`);
    await Resource.insertMany(resources);
    console.log("Equipment resources seeded successfully.");

    console.log("\nDatabase Seeding Completed Successfully! 🚀");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();
