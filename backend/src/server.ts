import express from "express";
import mongoose from "mongoose";
// Final restart trigger
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import peopleRouter from "./routes/people.js";
import projectsRouter from "./routes/projects.js";
import achievementsRouter from "./routes/achievements.js";
import supervisedRouter from "./routes/supervised.js";
import newsRouter from "./routes/news.js";
import contactRouter from "./routes/contact.js";
import resourcesRouter from "./routes/resources.js";
import statsRouter from "./routes/stats.js";
import uploadRouter from "./routes/upload.js";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS origins
//Allowing multiple origins for CORS by splitting the environment variable CORS_ORIGINS by commas. If not set, default to localhost origins for development.
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      //call back with true if the origin is in the allowedOrigins array, otherwise return an error message
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
//use express.json() middleware to parse incoming JSON requests and make the data available in req.body.
// We increase the limit to 50mb to allow for large base64 image uploads in the chat.
app.use(express.json({ limit: "50mb" }));

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mounting routes
import updatesRouter from "./routes/updates.js";
import chatRouter from "./routes/chat.js";

app.use("/api/auth", authRouter);
app.use("/api/people", peopleRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/updates", updatesRouter);
app.use("/api/supervised", supervisedRouter);
app.use("/api/news", newsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/chat", chatRouter);

// Serve uploads directory statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Serve existing frontend resumes statically
app.use("/resumes", express.static(path.join(process.cwd(), "../frontend/public/resumes")));

// Health check endpoint
//check the health of the server and database connection. Returns a JSON response with status and database connection state.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" });
});

// Global Error Handler
//Handles any errors that occur in the application. Logs the error stack to the console and sends a 500 response with a generic error message and the specific error message.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server", error: err.message });
});

// Database connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vibes_lab";

console.log("Connecting to MongoDB at:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Start the Python Retriever API for the chatbot
    console.log("Starting Python Retriever API...");
    const pythonScript = path.resolve(process.cwd(), "../chatbot/api.py");
    const venvPython = path.resolve(process.cwd(), "../chatbot/venv/Scripts/python.exe");
    const pythonProcess = spawn(venvPython, [pythonScript], {
      cwd: path.resolve(process.cwd(), "../chatbot"),
      stdio: "inherit"
    });
    
    pythonProcess.on("error", (err) => {
        console.error("Failed to start Python Retriever API:", err);
    });
    
    // Ensure Python process is killed when Node exits
    process.on("exit", () => {
        pythonProcess.kill();
    });
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Full Error:");
    console.error(err);
  });
// trigger restart 5
