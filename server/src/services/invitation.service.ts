// src/services/invitation.service.ts

import SessionInvitation from '../models/sessionInvitation.model.js'; // Assuming this model has the email/role fields
import Session from '../models/session.model.js';
import SessionMember from '../models/sessionMember.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { sendEmail, generateInviteEmailContent } from './email.service.js';

// Token expires after 7 days
const INVITATION_EXPIRY_DAYS = 7;
const BASE_CLIENT_URL = process.env.CLIENT_BASE_URL || 'http://localhost:3000'; 

/**
 * 1. GENERATE AND SEND INVITATION
 * Creates a unique, time-limited invitation token and sends an email.
 */
export const generateAndSendInvitationService = async (
  sessionId: string,
  inviterId: string,
  invitedEmail: string,
  role: 'editor' | 'viewer',
): Promise<{ message: string; inviteLink: string }> => {
    
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid Session ID.");
  }
  
  const [session, inviter] = await Promise.all([
      Session.findById(sessionId),
      User.findById(inviterId)
  ]);
  
  if (!session) {
      throw new Error("Session not found.");
  }
  if (!inviter) {
      throw new Error("Inviter user not found.");
  }
  
  // 1. Check if the invited email is already a member of the session
  const invitedUser = await User.findOne({ email: invitedEmail });
  if (invitedUser) {
      const isAlreadyMember = await SessionMember.findOne({
          session_id: sessionId,
          user_id: invitedUser._id,
      });
      if (isAlreadyMember) {
          throw new Error("The invited user is already a member of this session.");
      }
  }

  // 2. Generate a unique, secure token and expiration
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  // 3. Save the invitation record
  const newInvitation = await SessionInvitation.create({
    session_id: new mongoose.Types.ObjectId(sessionId),
    invited_by: new mongoose.Types.ObjectId(inviterId),
    email: invitedEmail,
    role: role,
    token: token,
    expires_at: expiresAt,
  });

  // 4. Construct the full client-side acceptance link
  const inviteLink = `${BASE_CLIENT_URL}/invite/${token}`;

  // 5. Send the email
  const { subject, html } = generateInviteEmailContent(
      inviter.full_name, 
      session.name, 
      inviteLink
  );
  
  await sendEmail(invitedEmail, subject, html);

  return { message: "Invitation email sent successfully.", inviteLink };
};


/**
 * 2. HANDLE ACCEPT INVITATION
 * Validates a token and adds the joining user to the session if valid.
 */
export const acceptInvitationService = async (token: string, userId: string): Promise<string> => {
    
    const invitation = await SessionInvitation.findOne({ token, status: 'pending' });

    if (!invitation) {
        throw new Error('Invitation not found or already used.');
    }

    if (invitation.expires_at < new Date()) {
        invitation.status = 'expired';
        await invitation.save();
        throw new Error('Invitation link has expired.');
    }

    const sessionObjectId = invitation.session_id;

    // 2. Check if the user is ALREADY a member
    const existingMember = await SessionMember.findOne({
        session_id: sessionObjectId,
        user_id: new mongoose.Types.ObjectId(userId)
    });

    if (existingMember) {
        invitation.status = 'accepted';
        invitation.accepted_at = new Date();
        await invitation.save();
        return sessionObjectId.toString(); 
    }
    
    // CRITICAL: Ensure the accepting user's email matches the invited email
    const acceptingUser = await User.findById(userId);
    if (!acceptingUser || acceptingUser.email !== invitation.email) {
        throw new Error("Acceptance failed: You must be logged in as the invited user.");
    }

    // 3. Add the user as a new member with the role specified in the invitation
    const newMember = new SessionMember({
        session_id: sessionObjectId,
        user_id: new mongoose.Types.ObjectId(userId),
        role: invitation.role, // Use role from invitation record!
        status: 'online', 
        last_seen: new Date(),
    });
    await newMember.save();

    // 4. Update invitation status
    invitation.status = 'accepted';
    invitation.accepted_at = new Date();
    await invitation.save();

    return sessionObjectId.toString(); 
};