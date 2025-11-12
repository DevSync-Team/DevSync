import mongoose, { Schema, Document } from "mongoose";

export interface IUserPreference extends Document {
  user_id: mongoose.Types.ObjectId;
  theme: "dark" | "light";
  font_size: number;
  preferred_language: string;
  auto_save: boolean;
  show_line_numbers: boolean;
  word_wrap: boolean;
}

const userPreferenceSchema = new Schema<IUserPreference>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    font_size: { type: Number, default: 14 },
    preferred_language: { type: String, default: "javascript" },
    auto_save: { type: Boolean, default: true },
    show_line_numbers: { type: Boolean, default: true },
    word_wrap: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUserPreference>("UserPreference", userPreferenceSchema);
