import mongoose, { Schema, Document } from "mongoose";

export interface IExecutionResult extends Document {
  session_id: mongoose.Types.ObjectId;
  file_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  code_content: string;
  output?: string;
  error_message?: string;
  execution_time_ms?: number;
  status: "success" | "error" | "timeout";
}

const executionResultSchema = new Schema<IExecutionResult>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    file_id: { type: Schema.Types.ObjectId, ref: "File", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code_content: { type: String, required: true },
    output: { type: String },
    error_message: { type: String },
    execution_time_ms: { type: Number },
    status: {
      type: String,
      enum: ["success", "error", "timeout"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExecutionResult>("ExecutionResult", executionResultSchema);
