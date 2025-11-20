// src/services/preference.service.ts

import UserPreference from "../models/userPreference.model.js";
import type { IUserPreference } from "../models/userPreference.model.js";

// Define the fields a user is allowed to update/set
type PreferenceUpdateFields = Omit<IUserPreference, 'user_id' | 'createdAt' | 'updatedAt'>;

/**
 * 1. GET USER PREFERENCES
 * Retrieves the preferences for the specified user. If none exist, it returns the default schema.
 */
export const getPreferencesService = async (
  userId: string
): Promise<IUserPreference> => {
  // Find preferences or create a new document with defaults if none exists (upsert logic for read)
  const preferences = await UserPreference.findOneAndUpdate(
    { user_id: userId },
    { $setOnInsert: { user_id: userId } }, // Only set user_id if creating a new document
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean() as IUserPreference;

  return preferences;
};


/**
 * 2. UPDATE USER PREFERENCES
 * Updates one or more preference fields.
 */
export const updatePreferencesService = async (
  userId: string,
  updateFields: Partial<PreferenceUpdateFields>
): Promise<IUserPreference> => {
    
  // Use findByIdAndUpdate with upsert: true to create or update in one operation.
  // We rely on getPreferencesService to ensure a document exists if necessary, 
  // but findOneAndUpdate is safer for simultaneous create/update.
  const updatedPreferences = await UserPreference.findOneAndUpdate(
    { user_id: userId },
    { $set: updateFields },
    { 
      new: true, 
      upsert: true, // Creates the document if it doesn't exist
      runValidators: true, // Ensures fields like 'theme' are valid enums
      setDefaultsOnInsert: true // Ensures defaults are applied if created
    }
  ).lean() as IUserPreference;

  if (!updatedPreferences) {
    // Should theoretically not happen with upsert: true, but good practice
    throw new Error("Failed to update or create user preferences.");
  }

  return updatedPreferences;
};

/**
 * 3. DELETE USER PREFERENCES
 * Resets preferences by deleting the document, allowing the defaults to be returned on next read.
 */
export const deletePreferencesService = async (
  userId: string
): Promise<{ message: string }> => {
    
  const result = await UserPreference.deleteOne({ user_id: userId });

  if (result.deletedCount === 0) {
    // If no document was deleted, it just means the user was using defaults, which is fine.
    return { message: "User preferences reset to default." };
  }
  
  return { message: "User preferences successfully deleted (reset to default)." };
};