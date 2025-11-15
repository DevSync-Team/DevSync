import mongoose from "mongoose";
import Session from "../models/session.model.js";
import type { ISession } from "../models/session.model.js";
import SessionMember from "../models/sessionMember.model.js";
import type { ISessionMember } from "../models/sessionMember.model.js";

import File from "../models/file.model.js";
import type { IFile } from "../models/file.model.js"; // FIXED: Use 'import type'
import User from "../models/user.model.js"; // For existence check

// Utility type for common return values
type SessionResponse = ISession & { members: ISessionMember[] };

/**
 * 1. CREATE SESSION
 * Creates a new session, adds the host as a member, and creates a root folder.
 */export const createSessionService = async (
  name: string,
  description: string,
  language: string,
  hostId: string
): Promise<ISession> => {
  const session = new Session({ name, description, language, host_user_id: hostId });
  const sessionMember = new SessionMember({
    session_id: session._id,
    user_id: hostId,
    role: "host",
    status: "online", // Host is online upon creation
  });

  const sessionDB = await mongoose.startSession();
  sessionDB.startTransaction();

  try {
    await session.save({ session: sessionDB });
    await sessionMember.save({ session: sessionDB });
    // NO root folder creation here, as requested.

    await sessionDB.commitTransaction();
    return session;
  } catch (error) {
    await sessionDB.abortTransaction();
    throw new Error(`Failed to create session: ${(error as Error).message}`);
  } finally {
    sessionDB.endSession();
  }
};
/**
 * 2. GET USER'S SESSIONS (List)
 * Retrieves all sessions a user is currently a member of.
 */
export const getSessionsService = async (userId: string): Promise<SessionResponse[]> => {
  const sessions = await SessionMember.find({ user_id: userId })
    .select("session_id role status joined_at")
    .populate({
      path: "session_id",
      model: Session,
      select: "-__v", // Exclude Mongoose version key
    })
    .lean();

  if (!sessions) return [];
  
  // Map to the desired response format, including all members for each session
  const populatedSessions = await Promise.all(
    sessions.map(async (member) => {
      const allMembers = await SessionMember.find({ session_id: member.session_id })
        .populate({
          path: 'user_id',
          model: User,
          select: 'full_name avatar_url'
        })
        .select('-session_id -__v')
        .lean();

      return {
        ...member.session_id as ISession, // Cast as ISession
        role: member.role,
        members: allMembers,
      } as SessionResponse;
    })
  );

  return populatedSessions;
};

/**
 * 3. GET SESSION BY ID (Details)
 * Retrieves a single session and checks if the user is a member.
 */
export const getSessionService = async (
  sessionId: string,
  userId: string
): Promise<SessionResponse> => {
  const member = await SessionMember.findOne({ session_id: sessionId, user_id: userId });
  if (!member) {
    throw new Error("Not authorized: User is not a member of this session.");
  }

  const session = await Session.findById(sessionId).lean();
  if (!session) {
    throw new Error("Session not found.");
  }
  
  const allMembers = await SessionMember.find({ session_id: sessionId })
    .populate({
      path: 'user_id',
      model: User,
      select: 'full_name avatar_url'
    })
    .select('-session_id -__v')
    .lean();


  return { ...session, members: allMembers } as SessionResponse;
};

/**
 * 4. UPDATE SESSION (Host Only)
 * Allows the host to update the session name, description, or language.
 */
export const updateSessionService = async (
  sessionId: string,
  userId: string,
  updateFields: Partial<ISession>
): Promise<ISession> => {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  // Authorization check: Only the host can update the session details
  if (session.host_user_id.toString() !== userId) {
    throw new Error("Not authorized: Only the session host can modify the session.");
  }

  // Update fields
  Object.assign(session, updateFields);
  session.last_activity = new Date();
  await session.save();

  return session;
};

/**
 * 5. DELETE SESSION (Host Only)
 * Deletes the session and all related documents (Files, Members).
 */
export const deleteSessionService = async (
  sessionId: string,
  userId: string
): Promise<{ message: string }> => {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new Error("Session not found.");
  }

  // Authorization check: Only the host can delete the session
  if (session.host_user_id.toString() !== userId) {
    throw new Error("Not authorized: Only the session host can delete the session.");
  }

  const sessionDB = await mongoose.startSession();
  sessionDB.startTransaction();

  try {
    // 1. Delete all files associated with the session
    await File.deleteMany({ session_id: sessionId }, { session: sessionDB });

    // 2. Delete all session members
    await SessionMember.deleteMany({ session_id: sessionId }, { session: sessionDB });

    // 3. Delete the session itself
    const result = await Session.deleteOne({ _id: sessionId }, { session: sessionDB });

    if (result.deletedCount === 0) {
        throw new Error("Session not found during deletion.");
    }

    // In a final implementation, you'd also delete:
    // - ChatMessage.deleteMany({ session_id: sessionId })
    // - ExecutionResult.deleteMany({ session_id: sessionId })
    // - Snapshot/SnapshotFile, ActivityLog, UserCursor, UserSelection, etc.

    await sessionDB.commitTransaction();
    return { message: `Session ${sessionId} and related data deleted successfully.` };
  } catch (error) {
    await sessionDB.abortTransaction();
    throw new Error(`Failed to delete session: ${(error as Error).message}`);
  } finally {
    sessionDB.endSession();
  }
};