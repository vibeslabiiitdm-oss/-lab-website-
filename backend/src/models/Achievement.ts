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

export const Achievement = model("Achievement", AchievementSchema);
