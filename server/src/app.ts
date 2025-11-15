import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import { setupSwagger } from "./swagger.js";
import sessionRoutes from './routes/session.routes.js';
import fileRoutes from './routes/file.routes.js';
 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json({ message: "Welcome to DevSync API" }));
app.use("/api/auth", authRoutes);
// Integrate Session Management Routes
app.use('/api/sessions', sessionRoutes);

// Intergrate File Management Routes
app.use('/api/sessions/:sessionId/files', fileRoutes);
 
// Swagger

setupSwagger(app); 

export default app;