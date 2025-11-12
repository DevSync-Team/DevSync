import express from "express";
import {
  signup,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Authentication and user management
 */

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword); // Token in params

export default router;