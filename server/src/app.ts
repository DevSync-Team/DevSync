// src/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import { setupSwagger } from "./swagger.js"; // ✅ named import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json({ message: "Welcome to DevSync API" }));
app.use("/api/auth", authRoutes);

// Swagger
setupSwagger(app); // ✅ attach swagger

export default app;
