// src/routes/snapshot.routes.ts

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isSessionMember, isEditorOrHost } from "../middlewares/session.middleware.js";
import {
  createSnapshot,
  getSnapshots,
  getSnapshotContent,
} from "../controllers/snapshot.controller.js";

// The { mergeParams: true } is CRITICAL to read :sessionId from the parent router
const router = express.Router({ mergeParams: true });

// Apply global middleware: Must be logged in and a member of the session
router.use(protect, isSessionMember);

// POST /api/sessions/:sessionId/snapshots
// Requires Host or Editor role
router.post("/", isEditorOrHost, createSnapshot);

// GET /api/sessions/:sessionId/snapshots
// Requires membership (Host, Editor, or Viewer)
router.get("/", getSnapshots);

// GET /api/sessions/:sessionId/snapshots/:snapshotId
// Requires membership (Host, Editor, or Viewer)
router.get("/:snapshotId", getSnapshotContent);

export default router;