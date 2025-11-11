import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    avatar_url: String,
    is_active: { type: Boolean, default: true },
    last_login: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
