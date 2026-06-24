import { Schema, model } from "mongoose";

const UpdateSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    date: { type: String, required: true },
    tag: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

export const Update = model("Update", UpdateSchema);
