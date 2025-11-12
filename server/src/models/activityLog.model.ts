import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  session_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  action: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ip_address: { type: String },
    user_agent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);
