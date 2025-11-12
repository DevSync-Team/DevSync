import mongoose, { Schema, Document } from "mongoose";

export interface ISessionInvitation extends Document {
  session_id: mongoose.Types.ObjectId;
  invited_by: mongoose.Types.ObjectId;
  email: string;
  role: "editor" | "viewer";
  token: string;
  status: "pending" | "accepted" | "declined" | "expired";
  expires_at: Date;
  accepted_at?: Date;
}

const sessionInvitationSchema = new Schema<ISessionInvitation>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    invited_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["editor", "viewer"],
      default: "editor",
    },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },
    expires_at: { type: Date, required: true },
    accepted_at: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ISessionInvitation>(
  "SessionInvitation",
  sessionInvitationSchema
);
