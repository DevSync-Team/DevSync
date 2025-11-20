import mongoose from "mongoose";
import File from "../models/file.model.js";
import type { IFile } from "../models/file.model.js";
import { logActivity } from './activity.service.js';
import type { Request } from 'express'; 
import UserCursor from '../models/userCursor.model.js';
import UserSelection from '../models/userSelection.model.js';

/**
 * 1. CREATE FILE (SIMPLIFIED - NO PARENT ID VALIDATION)
 * Creates a new file directly under the session (flat structure).
 */
export const createFileService = async (
  sessionId: string,
  userId: string,
  name: string,
  content: string = '',
  language?: string,
  req?: Request
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
  logActivity(sessionId, userId, "FILE_CREATED", { fileId: newItem._id, name: newItem.name }, req);

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
  updateFields: { content?: string; name?: string; language?: string, userId: string, // <--- ADD userId here
  req?: Request }
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

  let actionType = '';
  let details: any = { fileId: file._id, name: file.name };

  if (isContentChange && isMetadataChange) {
      actionType = "FILE_CONTENT_AND_METADATA_UPDATED";
  } else if (isContentChange) {
      actionType = "FILE_CONTENT_UPDATED";
      details.contentLength = updateFields.content!.length;
  } else if (isMetadataChange) {
      actionType = "FILE_METADATA_UPDATED";
  }
  
  if (actionType) {
      logActivity(sessionId, userId, actionType, details, req);
  }

  return file;
};

/**
 * 5. DELETE FILE (SIMPLE DELETE)
 */
export const deleteFileService = async (fileId: string, sessionId: string,userId: string, // <--- ADD userId here
  req?: Request): Promise<{ message: string }> => {
    const file = await File.findOne({ _id: fileId, session_id: sessionId, type: 'file' });

    if (!file) {
      throw new Error("File not found in this session.");
    }

    // Delete the file itself
    const result = await File.deleteOne({ _id: fileId });
    
    if (result.deletedCount === 0) {
        throw new Error("File not found during deletion.");
    }

    logActivity(sessionId, userId, "FILE_DELETED", { fileId: fileId, name: file.name }, req);
    
    return { message: `File ${file.name} deleted successfully.` };
};
/**
 * 6. SWITCH OPEN FILE (ATOMIC TRANSACTION)
 * Atomically sets the old file to is_open: false and the new file to is_open: true.
 * Also clears the user's presence data (cursors/selections) from the old file.
 */
export const switchOpenFileService = async (
  sessionId: string,
  newFileId: string,
  oldFileId: string,
  userId: string,
  req?: Request
): Promise<IFile> => {
  const sessionDB = await mongoose.startSession();
  sessionDB.startTransaction();

  try {
    const sessionObjectId = new mongoose.Types.ObjectId(sessionId);

    // 1. Set the new file as open and retrieve its content
    const newFile = await File.findOneAndUpdate(
      { _id: newFileId, session_id: sessionObjectId },
      { $set: { is_open: true } },
      { new: true, session: sessionDB }
    );

    if (!newFile) {
      throw new Error("New file not found or does not belong to this session.");
    }

    // 2. Set the old file as closed
    if (oldFileId && oldFileId !== newFileId) {
      await File.updateOne(
        { _id: oldFileId, session_id: sessionObjectId },
        { $set: { is_open: false } },
        { session: sessionDB }
      );
      
      // 3. Wipe the user's old presence data for the session/old file
      await Promise.all([
        UserCursor.deleteOne({ user_id: userId, file_id: oldFileId, session_id: sessionId }, { session: sessionDB }),
        UserSelection.deleteOne({ user_id: userId, file_id: oldFileId, session_id: sessionId }, { session: sessionDB }),
      ]);
    }
    
    // 4. Log the activity
    logActivity(sessionId, userId, "FILE_SWITCHED", { 
        oldFileId: oldFileId, 
        newFileId: newFileId,
        newFileName: newFile.name 
    }, req);

    await sessionDB.commitTransaction();
    return newFile;
  } catch (error) {
    await sessionDB.abortTransaction();
    throw error;
  } finally {
    sessionDB.endSession();
  }
};