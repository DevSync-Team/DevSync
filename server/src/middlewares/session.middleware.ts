// src/middlewares/session.middleware.ts

import type { Request, Response, NextFunction } from "express";
import SessionMember from "../models/sessionMember.model.js";

// --- Enums and Types ---

// Define the possible roles as an Enum (or constant map) for easy comparison
export enum Role {
    Host = 'host',
    Editor = 'editor',
    Viewer = 'viewer',
}

// Extend the Request type to include session ID and member role
interface AuthenticatedRequest extends Request {
    userId?: string; // Set by 'protect' middleware
    sessionId?: string; // Set by isSessionMember
    memberRole?: Role; // Set by isSessionMember
}

// --- Core Membership Check Middleware ---

/**
 * Middleware to ensure the authenticated user is an active member of the session.
 * It reads the session ID from req.params.sessionId and attaches the role to the request.
 * It is REQUIRED before using checkSessionRole.
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

    // Attach session ID and standardized Role to the request
    req.sessionId = sessionId;
    req.memberRole = member.role as Role; // Cast to Role Enum
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error during membership check." });
  }
};

// --- Reusable Role Check Middleware ---

/**
 * Higher-order middleware function to check if the user's role is included in the allowed list.
 * NOTE: This middleware must be placed AFTER isSessionMember in the route chain.
 * * @param allowedRoles An array of Role enums (e.g., [Role.Host, Role.Editor]).
 */
export const checkSessionRole = (allowedRoles: Role[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const role = req.memberRole;

        if (!role) {
            // This should ideally never happen if isSessionMember runs first
            return res.status(500).json({ message: "Internal server error: Role not defined." });
        }

        // Check if the user's role is included in the allowed list
        if (allowedRoles.includes(role)) {
            next();
        } else {
            // Convert allowed roles to a human-readable string for the error message
            const allowedList = allowedRoles.map(r => r.toUpperCase()).join(' or ');
            res.status(403).json({ message: `Forbidden: Access restricted to ${allowedList}. Your role is ${role.toUpperCase()}.` });
        }
    };
};

// --- Legacy and Specific Role Checks (Kept for compatibility) ---

/**
 * Middleware to ensure the member has editing privileges (Host or Editor).
 * Equivalent to checkSessionRole([Role.Host, Role.Editor])
 */
export const hasEditPrivileges = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.memberRole;

    if (role === Role.Host || role === Role.Editor) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Only hosts and editors can modify resources." });
    }
}

export const isEditorOrHost = hasEditPrivileges; // Aliasing for consistency