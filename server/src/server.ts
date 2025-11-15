import dotenv from "dotenv";
import mongoose from "mongoose";
import http from 'http'; // 1. Import HTTP module
import { Server as SocketIOServer } from 'socket.io'; // 2. Import Socket.IO Server
import app from "./app.js";  
import { initializeSocketIO } from "./socket/socket.handler.js"; // 3. Import Socket Handler

dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI || "";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// 4. Create an HTTP server instance using the Express app
const httpServer = http.createServer(app);

// 5. Initialize Socket.IO Server
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"]
    },
    path: '/ws/socket.io/',
});

// 6. Pass the Socket.IO instance to your handler
initializeSocketIO(io);


async function start() {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected");

    // 7. Start the HTTP server (instead of the Express app directly)
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ WebSocket Server active`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();