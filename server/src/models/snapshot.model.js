import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    message: String,
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

snapshotSchema.index({ session_id: 1, createdAt: -1 });

export default mongoose.model("Snapshot", snapshotSchema);
