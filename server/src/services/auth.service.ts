import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Use 'import type' for interfaces to avoid runtime module resolution errors
import type { IUser } from "../models/user.model.js";
import User from "../models/user.model.js";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
}

// Utility to sign a JWT
const signToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
};

// Signup logic
export const signupService = async (email: string, password: string, full_name: string): Promise<{ userId: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password_hash, full_name });
  
  return { userId: user._id.toString() };
};

// Login logic
export const loginService = async (email: string, password: string): Promise<{ token: string }> => {
  // Select the password_hash field since it's hidden by default
  const user = await User.findOne({ email }).select('+password_hash');
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken(user._id);
  return { token };
};

// Logout logic
export const logoutService = () => {
  return { message: "Logged out successfully" };
};

// Forgot Password logic
export const forgotPasswordService = async (email: string): Promise<{ message: string; resetToken: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  
  return { message: "Password reset link sent", resetToken };
};

// Reset Password logic
export const resetPasswordService = async (token: string, newPassword: string): Promise<{ message: string }> => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
    
    if (!payload.userId) {
      throw new Error("Token payload missing userId");
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    
    const result = await User.findByIdAndUpdate(
        payload.userId, 
        { password_hash, passwordResetToken: undefined, passwordResetExpires: undefined },
        { new: true }
    );
    
    if (!result) {
        throw new Error("User not found during password update");
    }
    
    return { message: "Password updated successfully" };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

// Get User Profile logic
export const getProfileService = async (userId: string): Promise<{ user: Omit<IUser, 'password_hash'> }> => {
  // .lean() returns a plain JavaScript object instead of a Mongoose document
  const user = await User.findById(userId).select("-password_hash").lean() as Omit<IUser, 'password_hash'>;
  if (!user) {
    throw new Error("User not found");
  }
  return { user };
};