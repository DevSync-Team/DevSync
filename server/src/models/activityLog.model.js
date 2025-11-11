import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    details: Object,
    ip_address: String,
    user_agent: String,
  },
  { timestamps: true }
);

activityLogSchema.index({ session_id: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
