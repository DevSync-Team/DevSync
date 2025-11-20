import mongoose from "mongoose";
import Session from "../models/session.model.js";
import type { ISession } from "../models/session.model.js";
import SessionMember from "../models/sessionMember.model.js";
import type { ISessionMember } from "../models/sessionMember.model.js";
import { logActivity } from './activity.service.js';
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

/**
 * 6. LEAVE SESSION
 * Allows a user to remove themselves from a session.
 */
export const leaveSessionService = async (
  sessionId: string,
  userId: string,
  req?: Request
): Promise<{ message: string }> => {
  const result = await SessionMember.deleteOne({
    session_id: sessionId,
    user_id: userId,
    role: { $ne: 'host' } // Prevent host from simply deleting their membership
  });

  if (result.deletedCount === 0) {
    logActivity(sessionId, userId, "MEMBER_LEFT", { user: userId }, req);
    // Check if the user is the host
    const session = await Session.findById(sessionId);
    if (session && session.host_user_id.toString() === userId) {
        throw new Error("Host cannot leave the session. The host must delete the entire session.");
    }
    throw new Error("User is not a member of this session.");
  }

  // NOTE: In a production app, you might also update File.is_open=false for this user,
  // delete their UserCursor/UserSelection records, and log the activity.

  return { message: "Successfully left the session." };
};

/**
 * 7. UPDATE MEMBER ROLE (Host Only)
 * Allows the host to change the role of another member.
 */
export const updateMemberRoleService = async (
  sessionId: string,
  hostId: string,
  memberId: string,
  newRole: 'editor' | 'viewer',
  req?: Request
): Promise<ISessionMember> => {
    
  // 1. Verify Host Authorization
  const hostMember = await SessionMember.findOne({ session_id: sessionId, user_id: hostId });
  if (!hostMember || hostMember.role !== 'host') {
    throw new Error("Not authorized: Only the session host can change member roles.");
  }
  
  // 2. Prevent Host from modifying their own role or changing role to host
  if (memberId === hostId) {
    throw new Error("Cannot change the host's role.");
  }

  // 3. Find and update the target member
  const updatedMember = await SessionMember.findOneAndUpdate(
    { 
      session_id: sessionId, 
      user_id: memberId 
    },
    { role: newRole },
    { new: true } // Return the updated document
  ).populate({
    path: 'user_id',
    model: User,
    select: 'full_name avatar_url'
  });

  if (!updatedMember) {
    throw new Error("Member not found in this session.");
  }
  logActivity(sessionId, hostId, "MEMBER_ROLE_UPDATED", {
      targetUserId: memberId, 
      newRole: newRole 
  }, req);

  return updatedMember as ISessionMember;
};


/**
 * 8. REMOVE MEMBER (Host Only - KICK)
 * Allows the host to remove (kick) another member from the session.
 */
export const removeMemberService = async (
  sessionId: string,
  hostId: string,
  memberId: string
): Promise<{ message: string }> => {
    
  // 1. Verify Host Authorization
  const hostMember = await SessionMember.findOne({ session_id: sessionId, user_id: hostId });
  if (!hostMember || hostMember.role !== 'host') {
    throw new Error("Not authorized: Only the session host can remove members.");
  }

  // 2. Prevent Host from removing themselves
  if (memberId === hostId) {
    throw new Error("Host cannot remove themselves from the session.");
  }

  // 3. Remove the target member
  const result = await SessionMember.deleteOne({
    session_id: sessionId,
    user_id: memberId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Member not found in this session.");
  }

  // NOTE: You'd also want to notify the kicked user via WebSockets here.

  return { message: "Member successfully removed from the session." };
};