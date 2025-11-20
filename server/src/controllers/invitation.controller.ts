// src/controllers/invitation.controller.ts

import type { Request, Response } from 'express';
import { 
    generateAndSendInvitationService, 
    acceptInvitationService
} from '../services/invitation.service.js';
import { Role } from '../middlewares/session.middleware.js'; 

interface AuthenticatedRequest extends Request {
    userId?: string; 
    sessionId?: string; 
    memberRole?: Role; 
}

const handleInvitationError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    if (error.message.includes("not found") || error.message.includes("expired")) status = 404;
    else if (error.message.includes("already a member")) status = 409; 
    else if (error.message.includes("must be logged in as the invited user")) status = 403;

    res.status(status).json({ message: error.message, error: error.name });
}

/**
 * POST /api/sessions/:sessionId/invitations
 * Summary: Generates a token, saves the invite record, and sends the email. (Host/Editor Only)
 */
export const generateInviteToken = async (req: AuthenticatedRequest, res: Response) => {
    const { email, role } = req.body;
    const sessionId = req.params.sessionId; // Read from URL params
    const inviterId = req.userId;

    if (!sessionId || !inviterId || !email || !['editor', 'viewer'].includes(role)) {
        return res.status(400).json({ message: "Missing required fields (sessionId, email, role)." });
    }

    try {
        const result = await generateAndSendInvitationService(sessionId, inviterId, email, role);
        res.status(200).json(result);
    } catch (err) {
        handleInvitationError(res, err);
    }
};

/**
 * POST /api/invitations/:token/accept
 * Summary: Handles the user clicking the link and accepting the invitation. (Requires Login)
 */
export const handleAcceptInvitation = async (req: AuthenticatedRequest, res: Response) => {
    const { token } = req.params;
    const userId = req.userId;

    if (!token || !userId) {
        return res.status(400).json({ message: "Missing token or user ID." });
    }

    try {
        const sessionId = await acceptInvitationService(token, userId);
        res.status(200).json({ message: "Invitation accepted. You are now a session member.", sessionId });
    } catch (err) {
        handleInvitationError(res, err);
    }
};