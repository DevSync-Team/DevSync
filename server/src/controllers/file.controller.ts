import type { Request, Response } from "express";
import {
  createFileService,
  getWorkspaceService,
  readFileContentService,
  updateFileService,
  deleteFileService,
  switchOpenFileService, 
} from "../services/file.service.js";

// Extend the Request type to include session ID and member role
interface AuthenticatedRequest extends Request {
    userId?: string; 
    sessionId?: string;
    memberRole?: 'host' | 'editor' | 'viewer';
}

const handleFileServiceError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    if (error.message.includes("not found")) status = 404;
    else if (error.message.includes("Forbidden")) status = 403;
    // Handle the specific business logic errors for the simple structure
    else if (error.message.includes("exists in this session") || error.message.includes("Invalid structure") || error.message.includes("Cannot change file structure")) status = 400;
    
    res.status(status).json({ message: error.message, error: error.name });
}

/**
 * POST /api/sessions/:sessionId/files
 * Summary: Create a new file (Folders disallowed). (Requires Edit Privileges)
 */
export const createFile = async (req: AuthenticatedRequest, res: Response) => {
  // We only expect 'name', 'content', and optionally 'language'
  const { name, type, content, language } = req.body; 
  const { sessionId, userId } = req;

  // Enforce simplicity: block type: 'folder' and extraneous fields like parentId
  if (type !== 'file' || req.body.parentId !== undefined) {
      return res.status(400).json({ message: "Invalid structure. Only 'file' creation directly under the session is supported." });
  }

  if (!sessionId || !userId || !name) {
    return res.status(400).json({ message: "Missing required fields (sessionId, name) or user ID." });
  }

  try {
    const file = await createFileService(
      sessionId,
      userId,
      name,
      content,
      language
    );
    res.status(201).json({ message: `File created successfully`, file });
  } catch (err) {
    handleFileServiceError(res, err);
  }
};

/**
 * GET /api/sessions/:sessionId/files/workspace
 * Summary: Get the entire flat file list.
 */
export const getWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.sessionId;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID missing." });
  }

  try {
    const files = await getWorkspaceService(sessionId);
    res.json({ files: files });
  } catch (err) {
    handleFileServiceError(res, err);
  }
};

/**
 * GET /api/sessions/:sessionId/files/:fileId
 * Summary: Get details and content of a single file.
 */
export const readFile = async (req: AuthenticatedRequest, res: Response) => {
    const { fileId } = req.params;
    const sessionId = req.sessionId;

    if (!sessionId) {
        return res.status(400).json({ message: "Session ID missing." });
    }

    try {
        const file = await readFileContentService(fileId, sessionId);
        res.json({ file });
    } catch (err) {
        handleFileServiceError(res, err);
    }
}


/**
 * PUT /api/sessions/:sessionId/files/:fileId
 * Summary: Update file content or name.
 */
export const updateFile = async (req: AuthenticatedRequest, res: Response) => {
  const { fileId } = req.params;
  const sessionId = req.sessionId;
  const updateFields = req.body;
  
  // Block attempts to change structure or is_open state
  if (updateFields.parentId !== undefined || updateFields.type !== undefined || updateFields.is_open !== undefined) {
      return res.status(400).json({ message: "Cannot change file structure or is_open state using this endpoint." });
  }

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID missing." });
  }
  
  try {
    const file = await updateFileService(fileId, sessionId, updateFields); 
    res.json({ message: "File updated successfully", file });
  } catch (err) {
    handleFileServiceError(res, err);
  }
};


/**
 * DELETE /api/sessions/:sessionId/files/:fileId
 * Summary: Delete a file.
 */
export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  const { fileId } = req.params;
  const sessionId = req.sessionId;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID missing." });
  }

  try {
    const result = await deleteFileService(fileId, sessionId);
    res.json(result);
  } catch (err) {
    handleFileServiceError(res, err);
  }
};

/**
 * POST /api/sessions/:sessionId/files/:fileId/open
 * Summary: Switches the currently open editor file to the one specified by :fileId.
 */
export const switchOpenFile = async (req: AuthenticatedRequest, res: Response) => {
    const { fileId } = req.params;
    const sessionId = req.sessionId;
    if (!sessionId) return res.status(400).json({ message: "Session ID missing." });
    
    try {
        const result = await switchOpenFileService(fileId, sessionId);
        res.json({ 
            message: "File opened successfully.",
            openedFile: result.opened,
            closedFile: result.closed 
        });
    } catch (err) {
        handleFileServiceError(res, err);
    }
}