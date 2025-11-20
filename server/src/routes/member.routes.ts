// src/routes/member.routes.ts

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isSessionMember, checkSessionRole, Role } from "../middlewares/session.middleware.js";
import {
    leaveSession,
    updateMemberRole,
    removeMember,
} from "../controllers/member.controller.js";

// The { mergeParams: true } is CRITICAL to read :sessionId from the parent router
const router = express.Router({ mergeParams: true });

// --- PUBLIC ACTIONS (Self-Management) ---

// POST /api/sessions/:sessionId/members/leave
// This route is unique: it ONLY needs 'protect' to get userId, but then validates membership in the service layer.
router.post("/leave", protect, leaveSession);


// --- HOST ACTIONS (Requires Membership check, then Host role check) ---

// All routes below require membership first to set req.sessionId/req.memberRole
router.use(protect, isSessionMember); 

// PUT /api/sessions/:sessionId/members/:memberId/role
// Host action: Change role of another member
router.put(
    "/:memberId/role",
    checkSessionRole([Role.Host]), 
    updateMemberRole
);

// DELETE /api/sessions/:sessionId/members/:memberId
// Host action: Remove (kick) another member
router.delete(
    "/:memberId",
    checkSessionRole([Role.Host]), 
    removeMember
);

export default router;