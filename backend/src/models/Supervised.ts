import { Schema, model } from "mongoose";

const SupervisedProjectSchema = new Schema(
  {
    sno: { type: Number, required: true, unique: true },
    studentName: { type: String, required: true },
    rollNo: { type: String, required: true },
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    type: { type: String, enum: ["BTP", "MTP"], required: true },
    status: { type: String, enum: ["Completed", "Ongoing"], required: true },
  },
  { timestamps: true }
);

export const SupervisedProject = model("SupervisedProject", SupervisedProjectSchema);
