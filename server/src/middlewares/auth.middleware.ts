// src/middlewares/auth.middleware.ts (Corrected)
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
//  import User from "../models/user.model.s"; // Optional import if checking user existence
// NOTE: The previous error was caused by trying to import 'JwtPayload' from 'jsonwebtoken' here.
// The manual interface definition below is sufficient.

// Extend the Request type in Express to include the userId property
interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Manual definition of the payload structure expected from your JWT
interface JwtPayload {
    userId: string;
}

/**
 * Middleware to protect routes: verifies JWT token and attaches user ID to the request.
 */
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token = undefined;

  // Log the received Authorization header for debugging
  console.log("--- AUTH MIDDLEWARE START ---");
  console.log("Headers:", req.headers);
  console.log("Authorization Header:", req.headers.authorization);

  // 1. Check for the token in the 'Authorization' header (Bearer scheme)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token Extracted:", token ? "YES" : "NO");
  }

  // 2. Check if token was found
  if (!token) {
    console.log("PROTECT: Failure - No token provided.");
    console.log("--- AUTH MIDDLEWARE END ---");
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // 3. Verify token
    const secret = process.env.JWT_SECRET || "secret";
    // Using your manually defined JwtPayload interface here
    const decoded = jwt.verify(token, secret) as JwtPayload;

    console.log("JWT Decoded Payload:", decoded);
    
    // 4. Attach userId to the request for controller access
    req.userId = decoded.userId;
    console.log("PROTECT: Success - User ID attached:", req.userId);

    next();
  } catch (err) {
    // Log the actual error from JWT verification
    console.error("PROTECT: JWT Verification Error:", err);
    console.log("--- AUTH MIDDLEWARE END ---");
    res.status(401).json({ message: "Not authorized, token failed or is expired" });
  }
};