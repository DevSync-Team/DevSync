import type { Request, Response } from "express";
import {
  createSessionService,
  getSessionsService,
  getSessionService,
  updateSessionService,
  deleteSessionService,
} from "../services/session.service.js";

// Extend the Request type to include the userId set by the 'protect' middleware
interface AuthenticatedRequest extends Request {
    userId?: string;
}

// Helper to handle errors consistently
const handleServiceError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    if (error.message.includes("not found")) status = 404;
    else if (error.message.includes("Not authorized")) status = 403;
    else if (error.message.includes("Failed to create session")) status = 500;
    
    res.status(status).json({ message: error.message, error: error.name });
}

export const createSession = async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, language } = req.body;
  const hostId = req.userId;

  if (!hostId || !name) {
    return res.status(400).json({ message: "Missing required fields (name) or user ID." });
  }

  try {
    const session = await createSessionService(name, description || "", language || "javascript", hostId);
    res.status(201).json({ message: "Session created successfully", session });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const getSessions = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing." });
  }

  try {
    const sessions = await getSessionsService(userId);
    res.json({ sessions });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const getSession = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing." });
  }

  try {
    const session = await getSessionService(id, userId);
    res.json({ session });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const updateSession = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const updateFields = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing." });
  }

  try {
    const session = await updateSessionService(id, userId, updateFields);
    res.json({ message: "Session updated successfully", session });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const deleteSession = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing." });
  }

  try {
    const result = await deleteSessionService(id, userId);
    res.json(result);
  } catch (err) {
    handleServiceError(res, err);
  }
};