import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Person } from "../models/Person.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Register a new admin/user
router.post("/register", async (req, res): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Auto-create a corresponding Person record so they show up on the public website
    const emailPrefix = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    
    let personRole: "guide" | "scholar" = "scholar";
    let personCategory: "PhD" | "PG" | "UG" | "Alumni" | null = null;
    let designation = "Student";

    if (role === "Professor") {
      personRole = "guide";
      designation = "Professor";
    } else if (role === "Research Scholar") {
      personRole = "scholar";
      personCategory = "PhD";
      designation = "PhD Research Scholar";
    } else if (role === "Student") {
      personRole = "scholar";
      personCategory = "PG";
      designation = "Student";
    }

    const personId = `${personRole}-${emailPrefix}`;

    // Verify if person already exists to avoid duplication
    const existingPerson = await Person.findOne({ id: personId });
    if (!existingPerson) {
      const newPerson = new Person({
        id: personId,
        role: personRole,
        category: personCategory,
        name,
        designation,
        affiliation: "ViBeS Lab, IIITDM Kancheepuram",
        email,
        bio: "New member registered.",
        joined: new Date().getFullYear(),
        domains: [],
        skills: [],
        education: [],
        publications: [],
        awards: [],
        conferences: [],
        links: []
      });
      await newPerson.save();
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Login
router.post("/login", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const jwtSecret = process.env.JWT_SECRET || "super_secret_key_for_vibes_lab_2026";
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "1d" }
    );

    // Save login timestamp to MongoDB for user monitoring
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Current User Profile
router.get("/me", authenticateToken, async (req: AuthRequest, res): Promise<any> => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
