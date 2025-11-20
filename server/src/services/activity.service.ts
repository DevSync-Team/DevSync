// src/services/activity.service.ts

import ActivityLog from "../models/activityLog.model.js";
import mongoose from "mongoose";
import type { Request } from "express";

// A utility function to safely extract IP and User-Agent from the request
const getClientInfo = (req: Request) => {
    const ip_address = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress;
    const user_agent = req.headers['user-agent'] as string;
    
    return {
        ip_address: ip_address?.split(',')[0].trim(),
        user_agent: user_agent?.substring(0, 500) // Truncate long user agents
    };
};

/**
 * Creates an activity log entry for a specific action within a session.
 */
export const logActivity = async (
  sessionId: string,
  userId: string,
  action: string, // e.g., "FILE_CREATED", "CODE_EXECUTED", "ROLE_UPDATED"
  details: any = {},
  req?: Request // Optional Express request object to get client metadata
) => {
    try {
        const logData: any = {
            session_id: new mongoose.Types.ObjectId(sessionId),
            user_id: new mongoose.Types.ObjectId(userId),
            action: action,
            details: details,
        };

        if (req) {
            const clientInfo = getClientInfo(req);
            logData.ip_address = clientInfo.ip_address;
            logData.user_agent = clientInfo.user_agent;
        }

        // We use .create and don't wait for the result (fire-and-forget)
        // to prevent logging from slowing down the main user operation.
        ActivityLog.create(logData).catch(logErr => {
            console.error("FATAL: Failed to save activity log:", logErr);
            // This error is usually non-critical and should not interrupt the user's operation
        });

    } catch (err) {
        // Catch errors related to malformed IDs before Mongoose sees them
        console.error("Error preparing activity log:", err);
    }
};