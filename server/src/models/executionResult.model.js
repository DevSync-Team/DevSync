import mongoose from "mongoose";

const executionResultSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code_content: String,
    output: String,
    error_message: String,
    execution_time_ms: Number,
    status: { type: String, enum: ["success", "error", "timeout"] },
  },
  { timestamps: true }
);

executionResultSchema.index({ session_id: 1, createdAt: -1 });

export default mongoose.model("ExecutionResult", executionResultSchema);
