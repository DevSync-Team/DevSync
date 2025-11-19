import type { Request, Response } from "express";
import { executeCodeService } from "../services/executor.service.js";

interface AuthenticatedRequest extends Request {
    userId?: string;
    sessionId?: string;
}

const handleExecutionError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    if (error.message.includes("Session not found") || error.message.includes("File not found")) status = 404;
    else if (error.message.includes("Invalid ID")) status = 400;
    
    res.status(status).json({ message: error.message, error: error.name });
}

export const executeCode = async (req: AuthenticatedRequest, res: Response) => {
  const { codeContent, language, fileId } = req.body;
  const { sessionId, userId } = req;

  if (!sessionId || !userId || !codeContent || !fileId) {
    return res.status(400).json({ message: "Missing required fields (sessionId, userId, fileId, codeContent)." });
  }

  const lang = (language === 'typescript' || language === 'ts') ? 'typescript' : 'javascript';

  try {
    const result = await executeCodeService(
      codeContent, 
      lang, 
      sessionId, 
      fileId,
      userId
    );
    
    res.json({ message: `Execution finished with status: ${result.status}`, result });
  } catch (err) {
    handleExecutionError(res, err);
  }
};