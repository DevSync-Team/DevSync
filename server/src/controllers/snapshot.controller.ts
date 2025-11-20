// src/controllers/snapshot.controller.ts

import type { Request, Response } from "express";
import {
  createSnapshotService,
  getSnapshotsService,
  getSnapshotContentService,
} from "../services/snapshot.service.js";
import { Role } from "../middlewares/session.middleware.js"; // Import Role for status checking

// Extend the Request type to include session ID and member role
interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string; // Set by isSessionMember
  memberRole?: Role; // Set by isSessionMember
}

// Helper to handle errors consistently
const handleSnapshotError = (res: Response, err: unknown) => {
  const error = err as Error;
  let status = 500;

  if (error.message.includes("not found")) status = 404;
  else if (error.message.includes("Cannot create snapshot")) status = 400; // E.g., No files exist

  res.status(status).json({ message: error.message, error: error.name });
};

/**
 * POST /api/sessions/:sessionId/snapshots
 * Summary: Creates a new snapshot of the entire workspace. (Requires Edit Privileges)
 */
export const createSnapshot = async (req: AuthenticatedRequest, res: Response) => {
  const { message } = req.body; // Snapshot message/title
  const { sessionId, userId } = req;

  if (!sessionId || !userId || !message) {
    return res
      .status(400)
      .json({ message: "Missing required fields (sessionId, message) or user ID." });
  }

  try {
    const snapshot = await createSnapshotService(sessionId, userId, message);
    res.status(201).json({ message: "Snapshot created successfully", snapshot });
  } catch (err) {
    handleSnapshotError(res, err);
  }
};

/**
 * GET /api/sessions/:sessionId/snapshots
 * Summary: Gets a list of all snapshots for a session.
 */
export const getSnapshots = async (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.sessionId;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID missing." });
  }

  try {
    const snapshots = await getSnapshotsService(sessionId);
    res.json({ snapshots });
  } catch (err) {
    handleSnapshotError(res, err);
  }
};

/**
 * GET /api/sessions/:sessionId/snapshots/:snapshotId
 * Summary: Gets the content (files) of a single snapshot.
 */
export const getSnapshotContent = async (req: AuthenticatedRequest, res: Response) => {
  const { snapshotId } = req.params;
  const sessionId = req.sessionId;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID missing." });
  }

  try {
    const details = await getSnapshotContentService(snapshotId, sessionId);
    res.json({ snapshot: details });
  } catch (err) {
    handleSnapshotError(res, err);
  }
};