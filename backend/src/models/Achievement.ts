// Define the Achievement schema with fields for id, title, detail, year, category, and org. The schema also includes timestamps for createdAt and updatedAt.`
import { Schema, model } from "mongoose";

const AchievementSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, enum: ["Recognition", "Grant", "Patent", "Milestone"], required: true },
    org: { type: String },
  },
  { timestamps: true }
);

// Create and export the Achievement model based on the AchievementSchema. This model will be used to interact with the 'achievements' collection in the MongoDB database.
export const Achievement = model("Achievement", AchievementSchema);
