import mongoose from "mongoose";

const userCursorSchema = new mongoose.Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  line_number: Number,
  column_number: Number,
  color: { type: String, default: "#10B981" },
  updated_at: { type: Date, default: Date.now },
});

userCursorSchema.index({ session_id: 1, user_id: 1, file_id: 1 }, { unique: true });

export default mongoose.model("UserCursor", userCursorSchema);
