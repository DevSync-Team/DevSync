// src/types/express.d.ts

// Extend the Request interface in the Express namespace
declare namespace Express {
  interface Request {
    // This property is injected by the 'protect' middleware after JWT verification.
    userId?: string; 
  }
}