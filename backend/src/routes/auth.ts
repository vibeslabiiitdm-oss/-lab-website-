// purpose of importing Router from express is to create a new router object that can be used to define routes for handling HTTP requests related to authentication, such as user registration, login, and fetching the current user's profile. 
// The router object allows us to modularize our route definitions and group them together for better organization and maintainability.  
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Person } from "../models/Person.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Register a new admin/user
// The purpose of this route is to handle the registration of new users (admins or regular users) in the system. It performs several key functions:
// 1. Input Validation: It checks if all required fields (name, email, password, role) are provided in the request body. If any field is missing, it returns a 400 Bad Request response with an appropriate message.
// 2. Duplicate Email Check: It checks if the provided email is already registered in the system. If the email is found, it returns a 400 Bad Request response indicating that the email is already registered.
// 3. Password Hashing: If the email is not already registered, it hashes the provided password using bcrypt to ensure secure storage of passwords in the database.
// 4. User Creation: It creates a new user record in the database with the provided name, email, hashed password, and role.
// 5. Person Record Creation: It automatically creates a corresponding Person record for the new user to ensure they appear on the public website. The Person record includes details such as role, category, designation, affiliation, and other relevant information.
// 6. Response: If the registration is successful, it returns a 201 Created response with a success message. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.  
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
// The purpose of this route is to handle the login process for users (admins or regular users) in the system. It performs several key functions:
// 1. Input Validation: It checks if both email and password are provided in the request body. If either field is missing, it returns a 400 Bad Request response with an appropriate message.
// 2. User Authentication: It checks if the provided email exists in the database. If the email is not found, it returns a 400 Bad Request response indicating invalid credentials. If the email is found, it compares the provided password with the stored hashed password using bcrypt. If the passwords do not match, it returns a 400 Bad Request response indicating invalid credentials.
// 3. JWT Token Generation: If the authentication is successful, it generates a JSON Web Token (JWT) that includes the user's ID, email, and role. The token is signed using a secret key and has an expiration time of 1 day.
// 4. Login Timestamp Update: It updates the user's last login timestamp in the database to keep track of user activity.
// 5. Response: If the login is successful  
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
// The purpose of this route is to retrieve the profile information of the currently authenticated user. It performs several key functions:
// 1. Authentication: It uses the `authenticateToken` middleware to verify the JWT token provided in the request headers. If the token is invalid or missing, it returns a 401 Unauthorized response.
// 2. User Retrieval: If the token is valid, it retrieves the user's information from the database using the user ID extracted from the token. It excludes the password field from the retrieved data for security reasons.
// 3. Response: If the user is found, it returns a 200 OK response with the user's profile information. If the user is not found, it returns a 404 Not Found response. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.  
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
