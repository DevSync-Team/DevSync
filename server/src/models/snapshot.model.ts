import mongoose, { Schema, Document } from "mongoose";

export interface ISnapshot extends Document {
  session_id: mongoose.Types.ObjectId;
  message: string;
  author_id: mongoose.Types.ObjectId;
}

const snapshotSchema = new Schema<ISnapshot>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    message: { type: String, required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISnapshot>("Snapshot", snapshotSchema);
