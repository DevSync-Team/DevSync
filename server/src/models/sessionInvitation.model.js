import mongoose from "mongoose";

const sessionInvitationSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    invited_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: String,
    role: { type: String, enum: ["editor", "viewer"], default: "editor" },
    token: { type: String, unique: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },
    expires_at: Date,
    accepted_at: Date,
  },
  { timestamps: true }
);

export default mongoose.model("SessionInvitation", sessionInvitationSchema);
