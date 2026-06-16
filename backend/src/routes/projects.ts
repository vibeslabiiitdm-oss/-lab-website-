import { Router } from "express";
import { Project } from "../models/Project.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all projects
router.get("/", async (req, res): Promise<any> => {
  try {
    const projects = await Project.find({});
    return res.status(200).json(projects);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a project by ID
router.get("/:id", async (req, res): Promise<any> => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a project
router.post("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    return res.status(201).json(newProject);
  } catch (error: any) {
    return res.status(400).json({ message: "Error creating project", error: error.message });
  }
});

// Update a project
router.put("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating project", error: error.message });
  }
});

// Delete a project
router.delete("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
