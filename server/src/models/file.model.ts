import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  session_id: mongoose.Types.ObjectId;
  parent_id?: mongoose.Types.ObjectId; // Optional: Retained but ignored for flat structure
  name: string;
  type: "file" | "folder"; // Will be enforced as "file" in the service/controller
  content?: string;
  language?: string;
  is_open: boolean;
  created_by: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "File" },
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "folder"], required: true },
    content: { type: String },
    language: { type: String },
    is_open: { type: Boolean, default: false },
    created_by: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IFile>("File", fileSchema);