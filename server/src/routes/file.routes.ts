import express from 'express';
// --- ADJUSTED IMPORT HERE ---
import { protect } from '../middlewares/auth.middleware.js';
import { isSessionMember, isEditorOrHost } from '../middlewares/session.middleware.js';

import {
    createFile,
    getWorkspace,
    readFile,
    updateFile,
    deleteFile,
    switchOpenFile
} from '../controllers/file.controller.js';

// The { mergeParams: true } is CRITICAL to read :sessionId from the parent router
const router = express.Router({ mergeParams: true });

// Apply global middleware to all file routes
router.use(protect, isSessionMember); // Using protect instead of isAuthenticated

// POST /api/sessions/:sessionId/files - Create a new file
router.post('/', isEditorOrHost, createFile);

// GET /api/sessions/:sessionId/files/workspace - Get flat list of files
router.get('/workspace', getWorkspace);

// POST /api/sessions/:sessionId/files/:fileId/open - Switch the currently open file (editor focus)
router.post('/:fileId/open', switchOpenFile);

// GET /api/sessions/:sessionId/files/:fileId - Read a specific file's content
router.get('/:fileId', readFile);

// PUT /api/sessions/:sessionId/files/:fileId - Update file content/name
router.put('/:fileId', isEditorOrHost, updateFile);

// DELETE /api/sessions/:sessionId/files/:fileId - Delete a file
router.delete('/:fileId', isEditorOrHost, deleteFile);


export default router;