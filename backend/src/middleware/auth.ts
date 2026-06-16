import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No authentication token provided" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || "super_secret_key_for_vibes_lab_2026";

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("JWT Verification failed:", err.message);
      res.status(403).json({ message: "Invalid or expired token", error: err.message });
      return;
    }
    req.user = decoded;
    next();
  });
};
