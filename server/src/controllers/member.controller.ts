// src/controllers/member.controller.ts

import type { Request, Response } from "express";
import { 
    leaveSessionService, 
    updateMemberRoleService, 
    removeMemberService 
} from "../services/session.service.js";
import { Role } from "../middlewares/session.middleware.js"; 

interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string; 
  memberRole?: Role; 
}

const handleMemberError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    if (error.message.includes("not found")) status = 404;
    else if (error.message.includes("Not authorized") || error.message.includes("Host cannot")) status = 403;
    else if (error.message.includes("Cannot change the host's role")) status = 400; 
    
    res.status(status).json({ message: error.message, error: error.name });
}


/**
 * POST /api/sessions/:sessionId/members/leave
 * Summary: User removes themselves from the session.
 */
export const leaveSession = async (req: AuthenticatedRequest, res: Response) => {
    const { sessionId, userId } = req;

    if (!sessionId || !userId) {
        return res.status(400).json({ message: "Missing session ID or user ID." });
    }

    try {
        const result = await leaveSessionService(sessionId, userId);
        res.json(result);
    } catch (err) {
        handleMemberError(res, err);
    }
};


/**
 * PUT /api/sessions/:sessionId/members/:memberId/role
 * Summary: Host updates another member's role. (Host Only)
 */
export const updateMemberRole = async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const { newRole } = req.body; 
    const { sessionId, userId: hostId } = req;

    if (!sessionId || !hostId || !memberId || !['editor', 'viewer'].includes(newRole)) {
        return res.status(400).json({ message: "Missing required fields (sessionId, memberId) or invalid role." });
    }

    try {
        const member = await updateMemberRoleService(sessionId, hostId!, memberId, newRole);
        res.json({ message: `Member ${memberId} role updated to ${newRole}`, member });
    } catch (err) {
        handleMemberError(res, err);
    }
};


/**
 * DELETE /api/sessions/:sessionId/members/:memberId
 * Summary: Host removes (kicks) another member. (Host Only)
 */
export const removeMember = async (req: AuthenticatedRequest, res: Response) => {
    const { memberId } = req.params;
    const { sessionId, userId: hostId } = req;

    if (!sessionId || !hostId || !memberId) {
        return res.status(400).json({ message: "Missing required fields (sessionId, memberId) or host ID." });
    }

    try {
        const result = await removeMemberService(sessionId, hostId!, memberId);
        res.json(result);
    } catch (err) {
        handleMemberError(res, err);
    }
};