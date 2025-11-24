import { JSX, ReactNode } from "react";

// Type for individual stat item
export type StatItem = {
  label: string;
  value: string;
  icon: JSX.Element;
  iconColor?: string;
};
;

// Type for session status (using union type for better type safety)
export type SessionStatus = "Live" | "Open" | "Closed" | "Ended";


export interface SessionMember {
  _id: string;
  user_id: {
    _id: string;
    full_name: string;
    avatar_url?: string;
  };
  role: "host" | "editor" | "viewer";
  status: "online" | "offline";
  joined_at: Date;
}

export interface Session {
  _id: string; // MongoDB _id
  name: string;
  description?: string;
  host_user_id: string;
  language: string;
  is_active: boolean;
  last_activity: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional fields from backend
  role?: "host" | "editor" | "viewer"; // Current user's role
  members?: SessionMember[]; // All session members
}

// Helper to format session for display
export interface DisplaySession extends Session {
  id: string; // Alias for _id for easier access
  collaborators: number; // Member count
  status: "Live" | "Inactive";
  time: string; // Formatted time
}