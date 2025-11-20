// src/models/invitation.model.ts

import mongoose, { Schema, Document } from "mongoose";

// The status field is crucial for tracking if a token has been used
export interface IInvitation extends Document {
  token: string;
  session_id: mongoose.Types.ObjectId;
  inviter_id: mongoose.Types.ObjectId;
  expires_at: Date;
  status: "pending" | "accepted" | "revoked";
}

const invitationSchema = new Schema<IInvitation>(
  {
    token: { type: String, required: true, unique: true },
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    inviter_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expires_at: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "revoked"],
      default: "pending", // Default to pending when created
    },
  },
  { timestamps: true }
);

// Add an index on the token for fast lookup during acceptInvitation
invitationSchema.index({ token: 1 });

// Add a Time-To-Live (TTL) index on expires_at to automatically delete expired invitations
// This keeps the database clean. The value is in seconds (0 means delete immediately after expiry)
invitationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.model<IInvitation>("Invitation", invitationSchema);
export default Invitation;