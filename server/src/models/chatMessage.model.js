import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    message_type: {
      type: String,
      enum: ["text", "code", "system"],
      default: "text",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

chatMessageSchema.index({ session_id: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatMessageSchema);
