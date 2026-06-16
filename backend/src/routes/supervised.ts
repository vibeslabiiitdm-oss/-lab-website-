import { Router } from "express";
import { SupervisedProject } from "../models/Supervised.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all supervised projects
router.get("/", async (req, res): Promise<any> => {
  try {
    const projects = await SupervisedProject.find({}).sort({ sno: 1 });
    return res.status(200).json(projects);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a supervised project
router.post("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const newProject = new SupervisedProject(req.body);
    await newProject.save();
    return res.status(201).json(newProject);
  } catch (error: any) {
    return res.status(400).json({ message: "Error creating supervised project", error: error.message });
  }
});

// Update a supervised project by sno
router.put("/:sno", authenticateToken, async (req, res): Promise<any> => {
  try {
    const project = await SupervisedProject.findOneAndUpdate(
      { sno: Number(req.params.sno) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Supervised project not found" });
    }
    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating supervised project", error: error.message });
  }
});

// Delete a supervised project by sno
router.delete("/:sno", authenticateToken, async (req, res): Promise<any> => {
  try {
    const project = await SupervisedProject.findOneAndDelete({ sno: Number(req.params.sno) });
    if (!project) {
      return res.status(404).json({ message: "Supervised project not found" });
    }
    return res.status(200).json({ message: "Supervised project deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
