import { Router } from "express";
import { Stat } from "../models/Stat.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all stats
router.get("/", async (req, res): Promise<any> => {
  try {
    const stats = await Stat.find({});
    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a stat value by key
router.put("/:key", authenticateToken, async (req, res): Promise<any> => {
  try {
    const { value } = req.body;
    const stat = await Stat.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    return res.status(200).json(stat);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating stat", error: error.message });
  }
});

export default router;
