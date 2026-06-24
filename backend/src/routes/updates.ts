import { Router } from "express";
import { Update } from "../models/Update.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all updates
router.get("/", async (req, res): Promise<any> => {
  try {
    const updates = await Update.find({});
    return res.status(200).json(updates);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single update by ID
router.get("/:id", async (req, res): Promise<any> => {
  try {
    const update = await Update.findOne({ id: req.params.id });
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }
    return res.status(200).json(update);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create an update
router.post("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const newUpdate = new Update(req.body);
    await newUpdate.save();
    return res.status(201).json(newUpdate);
  } catch (error: any) {
    return res.status(400).json({ message: "Error creating update", error: error.message });
  }
});

// Update an update
router.put("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const update = await Update.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }
    return res.status(200).json(update);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating update", error: error.message });
  }
});

// Delete an update
router.delete("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const update = await Update.findOneAndDelete({ id: req.params.id });
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }
    return res.status(200).json({ message: "Update deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
