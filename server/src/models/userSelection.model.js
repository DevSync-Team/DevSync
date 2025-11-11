import mongoose from "mongoose";

const userSelectionSchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    start_line: Number,
    start_column: Number,
    end_line: Number,
    end_column: Number,
    color: { type: String, default: "#10B981" },
  },
  { timestamps: true }
);

export default mongoose.model("UserSelection", userSelectionSchema);
