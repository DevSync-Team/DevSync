// src/services/snapshot.service.ts

import mongoose from "mongoose";
import Snapshot from "../models/snapshot.model.js";
import type { ISnapshot } from "../models/snapshot.model.js";
import SnapshotFile from "../models/snapshotFile.model.js";
import File from "../models/file.model.js";

// Utility type for common return values
type SnapshotDetails = ISnapshot & { files: any[] }; // We use 'any[]' because the populated field is complex

/**
 * 1. CREATE SNAPSHOT (ATOMIC TRANSACTION)
 * Saves the current state of ALL files in a session as a snapshot.
 */
export const createSnapshotService = async (
  sessionId: string,
  userId: string,
  message: string
): Promise<ISnapshot> => {
  const sessionDB = await mongoose.startSession();
  sessionDB.startTransaction();

  try {
    // 1. Create the parent Snapshot record
    const snapshot = await Snapshot.create(
      [
        {
          session_id: sessionId,
          author_id: userId,
          message: message,
        },
      ],
      { session: sessionDB }
    );
    const snapshotId = snapshot[0]._id;

    // 2. Find all current files in the session
    const filesToSnapshot = await File.find(
      { session_id: sessionId, type: "file" },
      { content: 1, name: 1, language: 1, _id: 1 }
    ).session(sessionDB);

    if (filesToSnapshot.length === 0) {
      throw new Error("Cannot create snapshot: No files exist in this session.");
    }

    // 3. Prepare SnapshotFile records
    const snapshotFiles = filesToSnapshot.map((file) => ({
      snapshot_id: snapshotId,
      file_id: file._id, // Retain original file ID for linking
      file_name: file.name,
      content: file.content || "", // Ensure content is not null
      language: file.language,
    }));

    // 4. Save all SnapshotFile records
    await SnapshotFile.insertMany(snapshotFiles, { session: sessionDB });

    await sessionDB.commitTransaction();
    return snapshot[0];
  } catch (error) {
    await sessionDB.abortTransaction();
    const errorMessage = (error as Error).message.includes("files exist")
      ? (error as Error).message
      : `Failed to create snapshot: ${(error as Error).message}`;
    throw new Error(errorMessage);
  } finally {
    sessionDB.endSession();
  }
};

/**
 * 2. GET SNAPSHOTS (LIST)
 * Retrieves a list of all snapshots for a session.
 */
export const getSnapshotsService = async (
  sessionId: string
): Promise<ISnapshot[]> => {
  const snapshots = await Snapshot.find({ session_id: sessionId })
    .sort({ createdAt: -1 })
    .populate({
      path: "author_id",
      select: "full_name avatar_url",
    })
    .lean() as ISnapshot[];

  return snapshots;
};

/**
 * 3. GET SINGLE SNAPSHOT DETAILS (Content Retrieval)
 * Retrieves a single snapshot and all its associated file contents.
 */
export const getSnapshotContentService = async (
  snapshotId: string,
  sessionId: string
): Promise<SnapshotDetails> => {
  const snapshot = await Snapshot.findOne({
    _id: snapshotId,
    session_id: sessionId,
  })
    .populate({
      path: "author_id",
      select: "full_name avatar_url",
    })
    .lean() as ISnapshot;

  if (!snapshot) {
    throw new Error("Snapshot not found in this session.");
  }

  const files = await SnapshotFile.find({ snapshot_id: snapshotId }).lean();

  return {
    ...snapshot,
    files: files,
  } as SnapshotDetails;
};