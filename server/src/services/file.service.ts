import mongoose from "mongoose";
import File from "../models/file.model.js";
import type { IFile } from "../models/file.model.js";

/**
 * 1. CREATE FILE (SIMPLIFIED - NO PARENT ID VALIDATION)
 * Creates a new file directly under the session (flat structure).
 */
export const createFileService = async (
  sessionId: string,
  userId: string,
  name: string,
  content: string = '',
  language?: string
): Promise<IFile> => {
    
  // Check for duplicate file names within the session (only among other files)
  const existingItem = await File.findOne({
      session_id: sessionId, 
      name: name, 
      type: 'file'
  });

  if (existingItem) {
      throw new Error(`A file named '${name}' already exists in this session.`);
  }

  // NOTE: We intentionally do NOT use parent_id here for a flat structure
  const newItem = await File.create({
    session_id: sessionId,
    // parent_id will be null/undefined for a flat structure
    name,
    type: 'file', // Enforced as 'file'
    content: content,
    language: language,
    is_open: false, // Must be false upon creation
    created_by: userId,
  });

  return newItem;
};

/**
 * 2. GET WORKSPACE (FLAT FILE LIST)
 */
export const getWorkspaceService = async (sessionId: string): Promise<IFile[]> => {
    
    // Get all files that belong to the session (where type is 'file')
    const allFiles = await File.find({ 
        session_id: sessionId,
        type: 'file',
    })
    .sort({ name: 1 }) // Sort by name
    .lean() as IFile[];
    
    return allFiles;
};


/**
 * 3. READ FILE CONTENT
 */
export const readFileContentService = async (fileId: string, sessionId: string): Promise<IFile> => {
    const file = await File.findOne({ _id: fileId, session_id: sessionId, type: 'file' });
    
    if (!file) {
        throw new Error("File not found in this session.");
    }

    return file;
};

/**
 * 4. UPDATE FILE CONTENT/METADATA (SIMPLIFIED)
 */
export const updateFileService = async (
  fileId: string,
  sessionId: string,
  updateFields: { content?: string; name?: string; language?: string }
): Promise<IFile> => {
  const file = await File.findOne({ _id: fileId, session_id: sessionId, type: 'file' });

  if (!file) {
    throw new Error("File not found in this session.");
  }

  const allowedUpdates: Partial<IFile> = {};
  if (updateFields.content !== undefined) allowedUpdates.content = updateFields.content;
  if (updateFields.name !== undefined) allowedUpdates.name = updateFields.name;
  if (updateFields.language !== undefined) allowedUpdates.language = updateFields.language;
  
  // Validate name uniqueness if changing
  if (updateFields.name && updateFields.name !== file.name) {
      const existingItem = await File.findOne({
          session_id: sessionId, 
          name: updateFields.name,
          _id: { $ne: file._id } // Exclude the item itself
      });

      if (existingItem) {
          throw new Error(`A file named '${updateFields.name}' already exists in the session.`);
      }
  }
  
  Object.assign(file, allowedUpdates);
  await file.save();

  return file;
};

/**
 * 5. DELETE FILE (SIMPLE DELETE)
 */
export const deleteFileService = async (fileId: string, sessionId: string): Promise<{ message: string }> => {
    const file = await File.findOne({ _id: fileId, session_id: sessionId, type: 'file' });

    if (!file) {
      throw new Error("File not found in this session.");
    }

    // Delete the file itself
    const result = await File.deleteOne({ _id: fileId });
    
    if (result.deletedCount === 0) {
        throw new Error("File not found during deletion.");
    }
    
    return { message: `File ${file.name} deleted successfully.` };
};

/**
 * 6. SWITCH OPEN FILE STATE (CRITICAL LOGIC)
 */
export const switchOpenFileService = async (
  newFileId: string,
  sessionId: string
): Promise<{ opened: IFile; closed: IFile | null }> => {
    
  const sessionDB = await mongoose.startSession();
  sessionDB.startTransaction();
  
  let openedFile: IFile | null = null;
  let closedFile: IFile | null = null;

  try {
    // 1. Find the currently open file (excluding the new target) and set its state to closed
    closedFile = await File.findOneAndUpdate(
      { 
        session_id: sessionId, 
        is_open: true,
        _id: { $ne: newFileId } 
      },
      { is_open: false },
      { new: true, session: sessionDB }
    );
    
    // 2. Open the new target file (is_open: true)
    openedFile = await File.findOneAndUpdate(
      { 
        _id: newFileId, 
        session_id: sessionId,
        type: 'file' 
      },
      { is_open: true },
      { new: true, session: sessionDB }
    );

    if (!openedFile) {
        throw new Error("Target file not found or is not a file.");
    }
    
    await sessionDB.commitTransaction();
    
    return { opened: openedFile, closed: closedFile };
    
  } catch (error) {
    await sessionDB.abortTransaction();
    throw new Error(`Failed to switch open file state: ${(error as Error).message}`);
  } finally {
    sessionDB.endSession();
  }
};