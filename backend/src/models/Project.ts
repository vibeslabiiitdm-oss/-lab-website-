import { Schema, model } from "mongoose";
// Define the Project schema with fields for id, title, tagline, domain, status, year, purpose, description, results, tech, collaborators, and image. The schema also includes timestamps for createdAt and updatedAt.
const ProjectSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    domain: { type: String, required: true },
    status: { type: String, enum: ["Ongoing", "Completed"], required: true },
    year: { type: Number, required: true },
    purpose: { type: String, required: true },
    description: { type: String, required: true },
    results: [{ type: String }],
    tech: [{ type: String }],
    collaborators: [{ type: String }],
    image: { type: String, required: true },
  },
  { timestamps: true }
);
// Create and export the Project model based on the ProjectSchema. This model will be used to interact with the 'projects' collection in the MongoDB database.
export const Project = model("Project", ProjectSchema);
