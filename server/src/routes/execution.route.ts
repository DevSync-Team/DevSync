import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { isSessionMember } from '../middlewares/session.middleware.js';
import { executeCode } from '../controllers/execution.controller.js';

const router = express.Router({ mergeParams: true });

router.use(protect, isSessionMember); 

router.post('/', executeCode);

export default router;