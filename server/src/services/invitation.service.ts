// src/services/invitation.service.ts

import Invitation from '../models/invitation.model.js';
import Session from '../models/session.model.js';
import SessionMember from '../models/sessionMember.model.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Token expires after 7 days
const INVITATION_EXPIRY_DAYS = 7;

/**
 * Creates a unique, time-limited invitation token for a session.
 * @param sessionId The ID of the session being invited to.
 * @param inviterId The ID of the user creating the invitation.
 */
export const createInvitation = async (sessionId: string, inviterId: string): Promise<string> => {
    
    // 1. Basic validation
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new Error("Invalid Session ID.");
    }

    // 2. Generate a unique, secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // 3. Save the invitation record
    await Invitation.create({
        token,
        session_id: new mongoose.Types.ObjectId(sessionId),
        inviter_id: new mongoose.Types.ObjectId(inviterId),
        expires_at: expiresAt,
    });

    return token;
};

/**
 * Validates a token and adds the joining user to the session if valid.
 * @param token The unique invitation token.
 * @param userId The ID of the user accepting the invitation.
 */
export const acceptInvitation = async (token: string, userId: string): Promise<string> => {
    
    // 1. Find and validate the invitation
    const invitation = await Invitation.findOne({ token, status: 'pending' });

    if (!invitation) {
        throw new Error('Invitation not found or already used.');
    }

    if (invitation.expires_at < new Date()) {
        throw new Error('Invitation link has expired.');
    }

    const sessionObjectId = invitation.session_id;

    // 2. Check if the user is ALREADY a member
    const existingMember = await SessionMember.findOne({
        session_id: sessionObjectId,
        user_id: new mongoose.Types.ObjectId(userId)
    });

    if (existingMember) {
        // Mark invitation as accepted even if user was pre-existing (cleanup)
        invitation.status = 'accepted';
        await invitation.save();
        return sessionObjectId.toString(); // Return session ID
    }

    // 3. Add the user as a new member with the default 'viewer' role
    const newMember = new SessionMember({
        session_id: sessionObjectId,
        user_id: new mongoose.Types.ObjectId(userId),
        role: 'viewer', 
        status: 'online', 
        last_seen: new Date(),
    });
    await newMember.save();

    // 4. Update invitation status to accepted
    invitation.status = 'accepted';
    await invitation.save();

    return sessionObjectId.toString(); // Return session ID
};