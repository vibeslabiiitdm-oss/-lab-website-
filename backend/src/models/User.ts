import { Schema, model } from "mongoose";
// Define the User schema with fields for name, email, password, role, and lastLogin. The schema also includes timestamps for createdAt and updatedAt.
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
