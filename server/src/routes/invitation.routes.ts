// src/routes/invitation.routes.ts

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isSessionMember, isEditorOrHost } from "../middlewares/session.middleware.js";
import {
  generateInviteToken,
  handleAcceptInvitation,
} from "../controllers/invitation.controller.js";

const router = express.Router({ mergeParams: true });

// --- PUBLIC ACCEPTANCE ROUTE ---
// POST /api/invitations/:token/accept
// This requires ONLY the user to be logged in (protect), not a session member yet.
router.post("/:token/accept", protect, handleAcceptInvitation);


// --- INVITATION CREATION ROUTE ---
// All routes below require membership and a specific role
router.use(protect, isSessionMember); 

// POST /api/sessions/:sessionId/invitations
// This route should be mounted nested under /api/sessions/:sessionId
// Requires Host or Editor role to create an invite
router.post(
    "/", // Corresponds to /api/sessions/:sessionId/invitations
    isEditorOrHost, 
    generateInviteToken
);


export default router;