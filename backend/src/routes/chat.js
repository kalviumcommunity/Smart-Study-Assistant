import express from "express";
import { chatWithAI } from "../services/gemini.js";
import { chatWithAI as rtfcChatWithAI, chatWithAIDetailed } from "../services/rtfc-gemini.js";

const router = express.Router();

// POST /chat - Standard chat
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

// POST /chat/rtfc - Enhanced chat with RTFC framework
router.post("/rtfc", async (req, res) => {
  try {
    const { message, detailed = false } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (detailed) {
      const result = await chatWithAIDetailed(message);
      res.json({
        reply: result.response,
        toolsUsed: result.toolsUsed,
        knowledgeUsed: result.knowledgeUsed,
        sources: result.sources
      });
    } else {
      const response = await rtfcChatWithAI(message);
      res.json({ reply: response });
    }
  } catch (error) {
    console.error("Error in /chat/rtfc:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
