import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";  
dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI || "";

async function start() {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
