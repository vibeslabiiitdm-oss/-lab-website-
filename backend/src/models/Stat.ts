import { Schema, model } from "mongoose";
// Define the Stat schema with fields for key and value. The schema also includes timestamps for createdAt and updatedAt.
const StatSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Stat = model("Stat", StatSchema);
