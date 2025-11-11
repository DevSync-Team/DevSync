import mongoose from "mongoose";

const sessionMemberSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, enum: ["host", "editor", "viewer"], default: "editor" },
  status: { type: String, enum: ["online", "offline", "away"], default: "offline" },
  joined_at: { type: Date, default: Date.now },
  last_seen: Date,
});

sessionMemberSchema.index({ session_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model("SessionMember", sessionMemberSchema);
