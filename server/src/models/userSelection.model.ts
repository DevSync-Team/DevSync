// src/models/userSelection.model.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IUserSelection extends Document {
  session_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  file_id: mongoose.Types.ObjectId;
  start_line: number;
  start_column: number;
  end_line: number;
  end_column: number;
  color: string;
}

const userSelectionSchema = new Schema<IUserSelection>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    file_id: { type: Schema.Types.ObjectId, ref: "File", required: true },
    start_line: { type: Number, required: true },
    start_column: { type: Number, required: true },
    end_line: { type: Number, required: true },
    end_column: { type: Number, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true } // includes updatedAt, which is good for fail-safe TTL
);

// Compound Index: Essential for fast retrieval and upserting presence data.
userSelectionSchema.index(
  { session_id: 1, file_id: 1, user_id: 1 },
  { unique: true }
);

export default mongoose.model<IUserSelection>("UserSelection", userSelectionSchema);
