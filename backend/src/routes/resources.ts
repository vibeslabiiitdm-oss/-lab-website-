import { Router } from "express";
import { Resource } from "../models/Resource.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// GET all resources
router.get("/", async (req, res): Promise<any> => {
  try {
    const resources = await Resource.find({});
    return res.status(200).json(resources);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// CREATE a resource (Admin protected)
router.post("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const newResource = new Resource(req.body);
    await newResource.save();
    return res.status(201).json(newResource);
  } catch (error: any) {
    return res.status(400).json({ message: "Error creating resource", error: error.message });
  }
});

// DELETE a resource (Admin protected)
router.delete("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    return res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
