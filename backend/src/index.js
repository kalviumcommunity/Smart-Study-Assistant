import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Smart Study Assistant API is running" });
});

// Routes
app.use("/chat", chatRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ error: "Internal server error", details: error.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
  console.log(`🤖 API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});
