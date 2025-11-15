import type { Request, Response, NextFunction } from "express";
import SessionMember from "../models/sessionMember.model.js";

// Extend the Request type to include session ID and member role
interface AuthenticatedRequest extends Request {
    userId?: string; // Set by 'protect' middleware
    sessionId?: string; // Set by this middleware
    memberRole?: 'host' | 'editor' | 'viewer'; // Set by this middleware
}

/**
 * Middleware to ensure the authenticated user is an active member of the session.
 * It reads the session ID from req.params.sessionId and attaches the role to the request.
 */
export const isSessionMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const sessionId = req.params.sessionId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing." });
  }

  if (!sessionId) {
    return res.status(400).json({ message: "Bad Request: Session ID is missing in path." });
  }

  try {
    const member = await SessionMember.findOne({ 
      session_id: sessionId, 
      user_id: userId,
    }).select('role');

    if (!member) {
      return res.status(403).json({ message: "Forbidden: Not a member of this session." });
    }

    // Attach session ID and role to the request for controller access
    req.sessionId = sessionId;
    req.memberRole = member.role;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error during membership check." });
  }
};

/**
 * Middleware to ensure the member has editing privileges (Host or Editor).
 */
export const hasEditPrivileges = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.memberRole;

    if (role === 'host' || role === 'editor') {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Only hosts and editors can modify files/folders." });
    }
}

export const isEditorOrHost = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.memberRole;

    if (role === 'host' || role === 'editor') {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Only hosts and editors can modify files." });
    }
}