// src/controllers/preference.controller.ts

import type { Request, Response } from "express";
import { 
    getPreferencesService, 
    updatePreferencesService, 
    deletePreferencesService 
} from "../services/preference.service.js";

interface AuthenticatedRequest extends Request {
  userId?: string; // Set by 'protect' middleware
}

const handlePreferenceError = (res: Response, err: unknown) => {
    const error = err as Error;
    let status = 500;
    
    // Check for Mongoose Validation errors (e.g., passing an invalid 'theme' enum)
    if (error.name === 'ValidationError') status = 400; 
    
    res.status(status).json({ message: error.message, error: error.name });
}


/**
 * GET /api/users/me/preferences
 * Summary: Retrieves the user's preferences, creating defaults if none exist.
 */
export const getPreferences = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing." });
    }

    try {
        const preferences = await getPreferencesService(userId);
        res.json({ preferences });
    } catch (err) {
        handlePreferenceError(res, err);
    }
};


/**
 * PUT /api/users/me/preferences
 * Summary: Updates one or more preference fields.
 */
export const updatePreferences = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId;
    const updateFields = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing." });
    }
    
    // Simple check to ensure we aren't trying to change the user_id or unnecessary fields
    if (updateFields.user_id) {
        return res.status(400).json({ message: "Cannot modify user ID field." });
    }
    
    // Check if the body is empty
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No update fields provided." });
    }

    try {
        const preferences = await updatePreferencesService(userId, updateFields);
        res.json({ message: "Preferences updated successfully", preferences });
    } catch (err) {
        handlePreferenceError(res, err);
    }
};


/**
 * DELETE /api/users/me/preferences
 * Summary: Deletes the preference document, effectively resetting to application defaults.
 */
export const deletePreferences = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing." });
    }

    try {
        const result = await deletePreferencesService(userId);
        res.json(result);
    } catch (err) {
        handlePreferenceError(res, err);
    }
};