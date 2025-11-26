// src/api/session.api.ts

import api from '@/utils/api';
import axios from 'axios';

/**
 * Calls the backend to generate a new invitation token and send an email.
 */
export const apiInviteCollaborator = async (
  sessionId: string,
  email: string,
  role: 'editor' | 'viewer'
): Promise<{ message: string }> => {
  
  // Validate sessionId
  if (!sessionId || sessionId === 'undefined') {
    throw new Error("Invalid session ID");
  }

  console.log("📡 API Call - sessionId:", sessionId, "email:", email, "role:", role);

  try {
    // ✅ KEEP /api since your baseURL is just http://localhost:5000
    const response = await api.post(`/api/sessions/${sessionId}/invitations`, {
      email,
      role,
    });
    
    console.log("✅ API Success:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ API Error:", error);
    
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Failed to send invitation."
      : "An unexpected error occurred.";
    
    throw new Error(errorMessage);
  }
};