import { Schema, model } from "mongoose";
// Define the Contact schema with fields for name, email, message, and read. The schema also includes timestamps for createdAt and updatedAt.
const ContactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Contact = model("Contact", ContactSchema);
