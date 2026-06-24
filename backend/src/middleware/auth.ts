// importing the jsonwebtoken library to handle JWT creation and verification, and importing Request, Response, and NextFunction types from express for type safety in middleware functions.
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// Defining an interface AuthRequest that extends the Request interface from Express. This interface adds an optional user property to the request object, which will hold the decoded user information after successful JWT verification.
export interface AuthRequest extends Request {
  user?: any;
}
// Middleware function to authenticate JWT tokens. It checks for the presence of a token in the Authorization header, verifies it, and attaches the decoded user information to the request object if valid.
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
// If no token is provided, respond with a 401 Unauthorized status and a message indicating that no authentication token was provided.
  if (!token) {
    res.status(401).json({ message: "No authentication token provided" });
    return;
  }
// Retrieve the JWT secret from environment variables or use a default value. This secret is used to verify the authenticity of the token.
  const jwtSecret = process.env.JWT_SECRET || "super_secret_key_for_vibes_lab_2026";
// Verify the token using the jwt.verify method. If verification fails, respond with a 403 Forbidden status and an error message. If successful, attach the decoded user information to the request object and call next() to proceed to the next middleware or route handler.
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("JWT Verification failed:", err.message);
      res.status(403).json({ message: "Invalid or expired token", error: err.message });
      return;
    }
    // Attach the decoded user information to the request object for use in subsequent middleware or route handlers.
    req.user = decoded;
    next();
  });
};
