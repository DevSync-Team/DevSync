import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

 
export interface IUser extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  avatar_url?: string;
  last_login?: Date;
  is_active: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

 
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true, select: false }, // password_hash excluded by default
    full_name: { type: String, required: true },
    avatar_url: { type: String },
    last_login: { type: Date },
    is_active: { type: Boolean, default: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

// Method for comparing passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
 
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Create the model (Default Export)
const User = mongoose.model<IUser>("User", userSchema);
export default User;