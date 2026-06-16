import { Router } from "express";
import { Achievement } from "../models/Achievement.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all achievements
router.get("/", async (req, res): Promise<any> => {
  try {
    const achievements = await Achievement.find({});
    return res.status(200).json(achievements);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single achievement by ID
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
