import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  name: string;
  description?: string;
  host_user_id: mongoose.Types.ObjectId;
  language: string;
  is_active: boolean;
  last_activity: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    name: { type: String, required: true },
    description: { type: String },
    host_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    language: { type: String, default: "javascript" },
    is_active: { type: Boolean, default: true },
    last_activity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISession>("Session", sessionSchema);
