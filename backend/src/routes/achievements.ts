// This file defines the routes for managing achievements in the application. It includes routes for retrieving all achievements, retrieving a specific achievement by ID, creating a new achievement, updating an existing achievement, and deleting an achievement. The routes are protected by authentication middleware to ensure that only authorized users can perform certain actions.
import { Router } from "express";
import { Achievement } from "../models/Achievement.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all achievements
// The purpose of this route is to handle the retrieval of all achievements in the system. It performs several key functions:
// 1. Database Query: It queries the database to fetch all achievement records using the Achievement model.
// 2. Response: If the query is successful, it returns a 200 OK response with the list of achievements in JSON format. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.  
router.get("/", async (req, res): Promise<any> => {
  try {
    const achievements = await Achievement.find({});
    return res.status(200).json(achievements);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single achievement by ID
// The purpose of this route is to handle the retrieval of a specific achievement by its ID. It performs several key functions:
// 1. Parameter Extraction: It extracts the achievement ID from the request parameters.
// 2. Database Query: It queries the database to find an achievement that matches the provided ID using the Achievement model.
// 3. Response: If the achievement is found, it returns a 200 OK response with the achievement details in JSON format. If the achievement is not found, it returns a 404 Not Found response with an appropriate message. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.
router.get("/:id", async (req, res): Promise<any> => {
  try {
    const achievement = await Achievement.findOne({ id: req.params.id });
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    return res.status(200).json(achievement);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create an achievement
router.post("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const newAchievement = new Achievement(req.body);
    await newAchievement.save();
    return res.status(201).json(newAchievement);
  } catch (error: any) {
    return res.status(400).json({ message: "Error creating achievement", error: error.message });
  }
});

// Update an achievement
router.put("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    return res.status(200).json(achievement);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating achievement", error: error.message });
  }
});

// Delete an achievement
router.delete("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const achievement = await Achievement.findOneAndDelete({ id: req.params.id });
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    return res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
