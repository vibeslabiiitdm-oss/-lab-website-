import { Schema, model } from "mongoose";

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { timestamps: true }
);

export const Resource = model("Resource", ResourceSchema);
