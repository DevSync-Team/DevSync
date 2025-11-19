import type { Request, Response } from "express";
import { getChatHistoryService } from "../services/chat.service.js";

interface AuthenticatedRequest extends Request {
    userId?: string;
    sessionId?: string;
}

const handleChatError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    if (error.message.includes("Session not found")) status = 404;
    else if (error.message.includes("Invalid ID")) status = 400;
    
    res.status(status).json({ message: error.message, error: error.name });
}

export const getChatHistory = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req;
  const limit = parseInt(req.query.limit as string) || 50;
  const beforeId = req.query.beforeId as string;

  if (!sessionId) {
    return res.status(400).json({ message: "Missing session ID." });
  }

  try {
    const history = await getChatHistoryService(sessionId, limit, beforeId);
    res.json({ history });
  } catch (err) {
    handleChatError(res, err);
  }
};