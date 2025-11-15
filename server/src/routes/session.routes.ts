import express from "express";
import {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} from "../controllers/session.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All session routes are protected
router.use(protect);

router.route("/")
    .post(createSession) // POST /api/sessions: Create a new collaborative session
    .get(getSessions);  // GET /api/sessions: Get all sessions the current user is a member of

router.route("/:id")
    .get(getSession)    // GET /api/sessions/:id: Get details of a specific session
    .put(updateSession)  // PUT /api/sessions/:id: Update session details (Host-only)
    .delete(deleteSession); // DELETE /api/sessions/:id: Delete a session (Host-only)

export default router;