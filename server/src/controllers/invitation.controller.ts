// src/controllers/invitation.controller.ts

import type { Request, Response } from "express";
import { createInvitation, acceptInvitation } from "../services/invitation.service.js";

interface AuthenticatedRequest extends Request {
    userId?: string;
    sessionId?: string; // May be set by session middleware
}

/**
 * POST /api/invitations/:sessionId
 * Summary: Creates a new invitation token for a session.
 */
export const generateInviteToken = async (req: AuthenticatedRequest, res: Response) => {
    const { sessionId } = req.params;
    const { userId } = req; // Extracted from JWT

    if (!userId || !sessionId) {
        return res.status(400).json({ message: "Missing User ID or Session ID." });
    }

    try {
        // NOTE: Role check (only Host/Editor can invite) should be handled by a middleware
        const token = await createInvitation(sessionId, userId);
        
        // Return the full link (replace CLIENT_BASE_URL with your frontend URL)
        const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
        const inviteLink = `${clientBaseUrl}/invite/${token}`;

        res.status(201).json({ 
            message: "Invitation token created successfully.", 
            token,
            inviteLink
        });
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

/**
 * POST /api/invitations/:token/accept
 * Summary: Accepts an invitation token, adds the user to the session, and redirects/returns session ID.
 */
export const handleAcceptInvitation = async (req: AuthenticatedRequest, res: Response) => {
    const { token } = req.params;
    const { userId } = req; // Extracted from JWT

    if (!userId || !token) {
        return res.status(400).json({ message: "Missing User ID or invitation token." });
    }

    try {
        const sessionId = await acceptInvitation(token, userId);
        
        res.status(200).json({ 
            message: "Invitation accepted. User added to session.", 
            sessionId
        });
        
        // In a real application, you might redirect the user to the session workspace:
        // res.redirect(`/app/sessions/${sessionId}`);

    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};