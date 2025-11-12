import mongoose, { Schema, Document } from "mongoose";

export interface IUserCursor extends Document {
  session_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  file_id: mongoose.Types.ObjectId;
  line_number: number;
  column_number: number;
  color: string;
}

const userCursorSchema = new Schema<IUserCursor>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    file_id: { type: Schema.Types.ObjectId, ref: "File", required: true },
    line_number: { type: Number, required: true },
    column_number: { type: Number, required: true },
    color: { type: String, default: "#10B981" },
  },
  { timestamps: true }
);

userCursorSchema.index(
  { session_id: 1, user_id: 1, file_id: 1 },
  { unique: true }
);

export default mongoose.model<IUserCursor>("UserCursor", userCursorSchema);
