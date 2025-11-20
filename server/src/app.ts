import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import { setupSwagger } from "./swagger.js";
import sessionRoutes from './routes/session.routes.js';
import fileRoutes from './routes/file.routes.js';
import executionRoutes from './routes/execution.route.js';
import chatRoutes from './routes/chat.route.js';
import invitationRoutes from './routes/invitation.routes.js';
import snapshotRoutes from './routes/snapshot.route.js'
import memberRoutes from './routes/member.routes.js';
import userRoutes from './routes/preference.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json({ message: "Welcome to DevSync API" }));
app.use("/api/auth", authRoutes);

// Integrate Session Management Routes
app.use('/api/sessions', sessionRoutes);

// Integrate File Management Routes
// POST /api/sessions/:sessionId/files
app.use('/api/sessions/:sessionId/files', fileRoutes);

// Integrate Code Execution Routes (Phase 1a)
// POST /api/sessions/:sessionId/execute
app.use('/api/sessions/:sessionId/execute', executionRoutes);

// Integrate Chat History Routes (Phase 1b)
// GET /api/sessions/:sessionId/chat/history
app.use('/api/sessions/:sessionId/chat', chatRoutes);

app.use('/api/invitations', invitationRoutes);

app.use('/api/sessions/:sessionId/invitations', invitationRoutes);
app.use('/api/sessions/:sessionId/snapshots', snapshotRoutes);

app.use('/api/sessions/:sessionId/members', memberRoutes);

app.use('/api/users', userRoutes);
 
// Swagger

setupSwagger(app); 

export default app;