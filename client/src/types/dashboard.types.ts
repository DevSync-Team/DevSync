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

// Type for individual session
export type Session = {
  name: string;
  language: string;
  collaborators: number;
  time: string;
  status: SessionStatus;
};