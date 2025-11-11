import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    host_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    language: { type: String, default: "javascript" },
    is_active: { type: Boolean, default: true },
    last_activity: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
