import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { isSessionMember } from '../middlewares/session.middleware.js';
import { getChatHistory } from '../controllers/chat.controller.js';

const router = express.Router({ mergeParams: true });

router.use(protect, isSessionMember); 

router.get('/history', getChatHistory);

export default router;