// src/routes/file.routes.ts

import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { isSessionMember, isEditorOrHost } from "../middlewares/session.middleware.js";
import {
    createFile,
    getWorkspace,
    readFile,
    updateFile,
    deleteFile,
    switchOpenFile // <-- The new endpoint handler
} from "../controllers/file.controller.js";

// The { mergeParams: true } is CRITICAL to read :sessionId from the parent router
const router = express.Router({ mergeParams: true });

// Apply authentication and membership check to all file routes
router.use(protect, isSessionMember); 

// --- GET WORKSPACE LIST ---
// GET /api/sessions/:sessionId/files/workspace
router.get("/workspace", getWorkspace);


// --- SWITCH OPEN FILE ---
// POST /api/sessions/:sessionId/files/switch
// Allows any member to switch the file, as Viewers need to see the code too.
router.post("/switch", switchOpenFile); 


// --- CRUD OPERATIONS (Requires Editor/Host Role) ---
// All routes below require edit privileges
router.use(isEditorOrHost); 

// POST /api/sessions/:sessionId/files
router.post("/", createFile);

// GET /api/sessions/:sessionId/files/:fileId
// Reading content is allowed for Viewers, but we put it here for simplicity. 
// If you want Viewers to read files, move this above the isEditorOrHost middleware.
router.get("/:fileId", readFile); 

// General route for PUT/DELETE/GET by ID
router.route("/:fileId")
    .put(updateFile)    // PUT /api/sessions/:sessionId/files/:fileId
    .delete(deleteFile); // DELETE /api/sessions/:sessionId/files/:fileId

export default router;