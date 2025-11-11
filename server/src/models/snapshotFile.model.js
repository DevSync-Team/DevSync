import mongoose from "mongoose";

const snapshotFileSchema = new mongoose.Schema({
  snapshot_id: { type: mongoose.Schema.Types.ObjectId, ref: "Snapshot" },
  file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  file_name: String,
  content: String,
  language: String,
});

snapshotFileSchema.index({ snapshot_id: 1 });

export default mongoose.model("SnapshotFile", snapshotFileSchema);
