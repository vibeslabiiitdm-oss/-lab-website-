// This file defines the routes for managing projects in the application. It includes routes for retrieving all projects, retrieving a specific project by ID, creating a new project, updating an existing project, and deleting a project. The routes are protected by authentication middleware to ensure that only authorized users can perform certain actions.
import { Router } from "express";
import { Project } from "../models/Project.js";
import { authenticateToken } from "../middleware/auth.js";
// The purpose of this route is to handle the retrieval of all projects in the system. It performs several key functions:
// 1. Database Query: It queries the database to fetch all project records using the Project model.
// 2. Response: If the query is successful, it returns a 200 OK response with the list of projects in JSON format. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.
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
// The purpose of this route is to handle the retrieval of a specific project by its ID. It performs several key functions:
// 1. Parameter Extraction: It extracts the project ID from the request parameters.
// 2. Database Query: It queries the database to find a project that matches the provided ID using the Project model.
// 3. Response: If the project is found, it returns a 200 OK response with the project details in JSON format. If the project is not found, it returns a 404 Not Found response with an appropriate message. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.  
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
// The purpose of this route is to handle the creation of a new project in the system. It performs several key functions:   
// 1. Authentication: It uses the `authenticateToken` middleware to verify the JWT token provided in the request headers. If the token is invalid or missing, it returns a 401 Unauthorized response.
// 2. Request Body Handling: It expects the project details to be provided in the request body. It creates a new instance of the Project model using the provided data.
// 3. Database Insertion: It saves the new project to the database.
// 4. Response: If the project is created successfully, it returns a 201 Created response with the newly created project details in JSON format. If any server error occurs during the process, it returns a 400 Bad Request response with an error message. 
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
// The purpose of this route is to handle the updating of an existing project in the system. It performs several key functions:
// 1. Authentication: It uses the `authenticateToken` middleware to verify the JWT token provided in the request headers. If the token is invalid or missing, it returns a 401 Unauthorized response.
// 2. Parameter Extraction: It extracts the project ID from the request parameters.
// 3. Request Body Handling: It expects the updated project details to be provided in the request body.
// 4. Database Update: It updates the project in the database with the new information.
// 5. Response: If the project is updated successfully, it returns a 200 OK response with the updated project details in JSON format. If the project is not found, it returns a 404 Not Found response with an appropriate message. If any server error occurs during the process, it returns a 400 Bad Request response with an error message.
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
// The purpose of this route is to handle the deletion of an existing project in the system. It performs several key functions:
// 1. Authentication: It uses the `authenticateToken` middleware to verify the JWT token provided in the request headers. If the token is invalid or missing, it returns a 401 Unauthorized response.
// 2. Parameter Extraction: It extracts the project ID from the request parameters.
// 3. Database Deletion: It finds and deletes the project from the database based on the provided ID.
// 4. Response: If the project is deleted successfully, it returns a 200 OK response with a success message. If the project is not found, it returns a 404 Not Found response with an appropriate message. If any server error occurs during the process, it returns a 500 Internal Server Error response with an error message.
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
// Exporting the router to be used in other parts of the application. This allows the defined routes to be integrated into the main application, enabling the handling of project-related requests.
export default router;
