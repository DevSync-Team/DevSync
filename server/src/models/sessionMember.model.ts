import mongoose, { Schema, Document } from "mongoose";

export interface ISessionMember extends Document {
  session_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  role: "host" | "editor" | "viewer";
  status: "online" | "offline" | "away";
  joined_at: Date;
  last_seen: Date;
}

const sessionMemberSchema = new Schema<ISessionMember>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["host", "editor", "viewer"],
      default: "editor",
    },
    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    joined_at: { type: Date, default: Date.now },
    last_seen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionMemberSchema.index({ session_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model<ISessionMember>("SessionMember", sessionMemberSchema);
