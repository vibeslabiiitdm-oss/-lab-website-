import { Schema, model } from "mongoose";

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

export const Project = model("Project", ProjectSchema);
