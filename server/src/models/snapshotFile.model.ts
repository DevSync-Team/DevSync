import mongoose, { Schema, Document } from "mongoose";

export interface ISnapshotFile extends Document {
  snapshot_id: mongoose.Types.ObjectId;
  file_id: mongoose.Types.ObjectId;
  file_name: string;
  content: string;
  language?: string;
}

const snapshotFileSchema = new Schema<ISnapshotFile>(
  {
    snapshot_id: { type: Schema.Types.ObjectId, ref: "Snapshot", required: true },
    file_id: { type: Schema.Types.ObjectId, ref: "File", required: true },
    file_name: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ISnapshotFile>("SnapshotFile", snapshotFileSchema);
