// src/routes/preference.routes.ts

import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { 
    getPreferences,
    updatePreferences,
    deletePreferences,
} from '../controllers/preference.controller.js';

const router = express.Router();

// All preference routes require the user to be authenticated
router.use(protect); 

// The 'me' route is a common convention for resources owned by the current user
router.route('/me/preferences')
    .get(getPreferences)    // GET /api/users/me/preferences
    .put(updatePreferences) // PUT /api/users/me/preferences
    .delete(deletePreferences); // DELETE /api/users/me/preferences

export default router;