// src/routes/invitation.routes.ts

import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { checkSessionRole, Role } from '../middlewares/session.middleware.js'; // Assuming you have a Role Check middleware
import { generateInviteToken, handleAcceptInvitation } from '../controllers/invitation.controller.js';

const router = express.Router();

// Route to accept the invitation (requires user to be logged in)
// POST /api/invitations/:token/accept
router.post('/:token/accept', protect, handleAcceptInvitation);

// Route to generate an invitation (requires user to be logged in AND have the correct role in the session)
// POST /api/invitations/:sessionId
router.post('/:sessionId', protect, checkSessionRole([Role.Host, Role.Editor]), generateInviteToken);

export default router;