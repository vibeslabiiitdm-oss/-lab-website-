import mongoose from "mongoose";
import dotenv from "dotenv";
import { Person } from "../models/Person.js";
dotenv.config();
const guide = {
    id: "guide-rahul-raman",
    image: "/team/guide-rahul-raman.jpg",
    resume: "/resumes/guide-rahul-raman_resume.pdf",
    role: "guide",
    name: "Dr. Rahul Raman",
    designation: "Associate Professor & Lab Head",
    affiliation: "ViBeS Lab, IIITDM Kancheepuram",
    email: "rahul@iiitdm.ac.in",
    bio: "Doctorate researcher leading the Visual Surveillance & Biometrics Security Lab (ViBeS Lab) at IIITDM Kancheepuram.",
    joined: 2021,
    domains: ["Visual Surveillance", "Biometrics", "Computer Vision", "Machine Learning"],
    skills: ["Python", "MATLAB", "Deep Learning", "TensorFlow", "PyTorch"],
    education: [],
    publications: [],
    awards: [],
    conferences: [],
    links: []
};
const scholars = [
    {
        id: "scholar-cs22d0001",
        image: "/team/sukesh_babu.jpg",
        role: "scholar",
        category: "PhD",
        name: "Sukesh Babu",
        designation: "PhD Research Scholar",
        affiliation: "ViBeS Lab, IIITDM Kancheepuram",
        email: "cs22d0001@iiitdm.ac.in",
        bio: "Researching robust lightweight pedestrian detection algorithms for autonomous mobile robots.",
        joined: 2022,
        domains: ["Computer Vision", "Pedestrian Detection", "Deep Learning"],
        skills: ["Python", "PyTorch", "YOLO"],
        education: [],
        publications: [],
        awards: [],
        conferences: [],
        links: []
    },
    {
        id: "scholar-cs23d0002",
        image: "/team/anu_jexline.jpg",
        role: "scholar",
        category: "PhD",
        name: "Anu Jexline",
        designation: "PhD Research Scholar",
        affiliation: "ViBeS Lab, IIITDM Kancheepuram",
        email: "cs23d0002@iiitdm.ac.in",
        bio: "Researching visual biometrics and security.",
        joined: 2023,
        domains: ["Biometrics", "Machine Learning"],
        skills: ["Python", "OpenCV", "Deep Learning"],
        education: [],
        publications: [],
        awards: [],
        conferences: [],
        links: []
    }
];
const allPeople = [guide, ...scholars];
async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");
        await Person.deleteMany({});
        console.log("Cleared existing people data.");
        await Person.insertMany(allPeople);
        console.log(`Successfully seeded ${allPeople.length} people.`);
        mongoose.connection.close();
    }
    catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}
seedDatabase();
