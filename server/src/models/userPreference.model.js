import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    font_size: { type: Number, default: 14 },
    preferred_language: { type: String, default: "javascript" },
    auto_save: { type: Boolean, default: true },
    show_line_numbers: { type: Boolean, default: true },
    word_wrap: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("UserPreference", userPreferenceSchema);
