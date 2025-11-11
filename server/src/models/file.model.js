import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    name: String,
    type: { type: String, enum: ["file", "folder"] },
    content: String,
    language: String,
    is_open: { type: Boolean, default: false },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

fileSchema.index({ session_id: 1 });
fileSchema.index({ parent_id: 1 });

export default mongoose.model("File", fileSchema);
