import express from "express";
import { chatWithAI } from "../services/gemini.js";

const router = express.Router();

// POST /chat
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await chatWithAI(message);
    res.json({ reply: response });
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
