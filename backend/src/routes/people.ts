import { Router } from "express";
import { Person } from "../models/Person.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Get all people
router.get("/", async (req, res): Promise<any> => {
  try {
    const people = await Person.find({});
    return res.status(200).json(people);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a person by ID
router.get("/:id", async (req, res): Promise<any> => {
  try {
    const person = await Person.findOne({ id: req.params.id });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.status(200).json(person);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a person
router.post("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const newPerson = new Person(req.body);
    await newPerson.save();
    return res.status(201).json(newPerson);
  } catch (error: any) {
    return res.status(400).json({ message: "Error creating person", error: error.message });
  }
});

// Update a person
router.put("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const person = await Person.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.status(200).json(person);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating person", error: error.message });
  }
});

// Delete a person
router.delete("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const person = await Person.findOneAndDelete({ id: req.params.id });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.status(200).json({ message: "Person deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
