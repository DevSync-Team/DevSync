// src/models/chatMessage.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  session_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  message: string;
  message_type: "text" | "code" | "system";
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    message_type: {
      type: String,
      enum: ["text", "code", "system"],
      default: "text",
    },
  },
  { 
    timestamps: true 
  }
);

 
chatMessageSchema.index({ session_id: 1, createdAt: 1 });

 
const ninetyDaysInSeconds = 60 * 60 * 24 * 90;
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: ninetyDaysInSeconds });


export default mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);