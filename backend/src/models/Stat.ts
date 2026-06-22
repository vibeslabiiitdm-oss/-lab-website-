import { Schema, model } from "mongoose";

const StatSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Stat = model("Stat", StatSchema);
