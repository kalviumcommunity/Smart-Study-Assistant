import express from "express";
import { chatWithAI, chatWithAIOneShot, chatWithAIMultiShot, chatWithAIChainOfThought } from "../services/gemini.js";
import { chatWithAI as rtfcChatWithAI, chatWithAIDetailed } from "../services/rtfc-gemini.js";
import { ZeroShotPromptEngine } from "../services/zero-shot-prompting.js";
import { OneShotPromptEngine } from "../services/one-shot-prompting.js";
import { MultiShotPromptEngine } from "../services/multi-shot-prompting.js";
import { ChainOfThoughtPromptEngine } from "../services/chain-of-thought-prompting.js";

const router = express.Router();
const zeroShotEngine = new ZeroShotPromptEngine();
const oneShotEngine = new OneShotPromptEngine();
const multiShotEngine = new MultiShotPromptEngine();
const chainOfThoughtEngine = new ChainOfThoughtPromptEngine();

// POST /chat - Standard chat with intelligent prompting
router.post("/", async (req, res) => {
  try {
    const { message, options = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Support all prompting strategies
    const promptOptions = {
      promptType: options.promptType,
      level: options.level,
      taskType: options.taskType,
      maxExamples: options.maxExamples,
      reasoningDepth: options.reasoningDepth,
      promptingStrategy: options.promptingStrategy || 'zero-shot' // default to zero-shot
    };

    let response;
    if (promptOptions.promptingStrategy === 'chain-of-thought') {
      response = await chatWithAIChainOfThought(message, promptOptions);
    } else if (promptOptions.promptingStrategy === 'multi-shot') {
      response = await chatWithAIMultiShot(message, promptOptions);
    } else if (promptOptions.promptingStrategy === 'one-shot') {
      response = await chatWithAIOneShot(message, promptOptions);
    } else {
      response = await chatWithAI(message, promptOptions);
    }

    res.json({
      reply: response,
      options: promptOptions
    });
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

// POST /chat/zero-shot - Zero-shot prompting with detailed options
router.post("/zero-shot", async (req, res) => {
  try {
    const { message, promptType, level, taskType } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const options = {};
    if (promptType) options.promptType = promptType;
    if (level) options.level = level;

    let finalMessage = message;
    let promptAnalysis = null;

    // Use task-specific prompting if specified
    if (taskType) {
      const taskPrompt = zeroShotEngine.generateTaskSpecificPrompt(taskType, message, options);
      finalMessage = taskPrompt.enhancedUserMessage;
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: finalMessage,
        analysisType: taskPrompt.analysisType,
        confidence: taskPrompt.confidence,
        taskType
      };
    } else {
      // Regular zero-shot analysis
      const analysis = zeroShotEngine.generatePrompt(message, options);
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: analysis.enhancedUserMessage,
        analysisType: analysis.analysisType,
        confidence: analysis.confidence
      };
    }

    const response = await chatWithAI(finalMessage, options);

    res.json({
      reply: response,
      promptAnalysis,
      options: { promptType, level, taskType }
    });
  } catch (error) {
    console.error("Error in /chat/zero-shot:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ 
      error: "Something went wrong", 
      details: error.message,
      type: error.name 
    });
  }
});

// GET /chat/types - Get available prompt types and options
router.get("/types", (req, res) => {
  try {
    const availableTypes = zeroShotEngine.getAvailableTypes();

    res.json({
      promptTypes: availableTypes,
      taskTypes: [
        "explanation",
        "problem_solving",
        "analysis",
        "comparison",
        "summary",
        "tutorial",
        "research",
        "creative"
      ],
      levels: [
        "beginner",
        "intermediate",
        "advanced"
      ]
    });
  } catch (error) {
    console.error("Error in /chat/types:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /chat/analyze - Analyze a message without generating response
router.post("/analyze", (req, res) => {
  try {
    const { message, promptType, level } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const options = {};
    if (promptType) options.promptType = promptType;
    if (level) options.level = level;

    const analysis = zeroShotEngine.generatePrompt(message, options);

    res.json({
      originalMessage: message,
      enhancedMessage: analysis.enhancedUserMessage,
      analysisType: analysis.analysisType,
      confidence: analysis.confidence,
      systemPrompt: analysis.systemPrompt.substring(0, 200) + "...", // Truncated for response
      options
    });
  } catch (error) {
    console.error("Error in /chat/analyze:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /chat/one-shot - One-shot prompting with examples
router.post("/one-shot", async (req, res) => {
  try {
    const { message, promptType, level, taskType, showExample } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const options = {};
    if (promptType) options.promptType = promptType;
    if (level) options.level = level;

    let finalMessage = message;
    let promptAnalysis = null;

    // Use task-specific prompting if specified
    if (taskType) {
      const taskPrompt = oneShotEngine.generateTaskSpecificPrompt(taskType, message, options);
      finalMessage = taskPrompt.enhancedUserMessage;
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: finalMessage,
        analysisType: taskPrompt.analysisType,
        confidence: taskPrompt.confidence,
        taskType,
        example: showExample ? taskPrompt.example : null
      };
    } else {
      // Regular one-shot analysis
      const analysis = oneShotEngine.generatePrompt(message, options);
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: analysis.enhancedUserMessage,
        analysisType: analysis.analysisType,
        confidence: analysis.confidence,
        example: showExample ? analysis.example : null
      };
    }

    const response = await chatWithAIOneShot(finalMessage, options);

    res.json({
      reply: response,
      promptAnalysis,
      options: { promptType, level, taskType },
      promptingStrategy: 'one-shot'
    });
  } catch (error) {
    console.error("Error in /chat/one-shot:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /chat/multi-shot - Multi-shot prompting with multiple examples
router.post("/multi-shot", async (req, res) => {
  try {
    const { message, promptType, level, taskType, maxExamples, showExamples } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const options = {};
    if (promptType) options.promptType = promptType;
    if (level) options.level = level;
    if (maxExamples) options.maxExamples = maxExamples;

    let finalMessage = message;
    let promptAnalysis = null;

    // Use task-specific prompting if specified
    if (taskType) {
      const taskPrompt = multiShotEngine.generateTaskSpecificPrompt(taskType, message, options);
      finalMessage = taskPrompt.enhancedUserMessage;
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: finalMessage,
        analysisType: taskPrompt.analysisType,
        confidence: taskPrompt.confidence,
        taskType,
        examples: showExamples ? taskPrompt.examples : null,
        exampleCount: taskPrompt.exampleCount
      };
    } else {
      // Regular multi-shot analysis
      const analysis = multiShotEngine.generatePrompt(message, options);
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: analysis.enhancedUserMessage,
        analysisType: analysis.analysisType,
        confidence: analysis.confidence,
        examples: showExamples ? analysis.examples : null,
        exampleCount: analysis.exampleCount
      };
    }

    const response = await chatWithAIMultiShot(finalMessage, options);

    res.json({
      reply: response,
      promptAnalysis,
      options: { promptType, level, taskType, maxExamples },
      promptingStrategy: 'multi-shot'
    });
  } catch (error) {
    console.error("Error in /chat/multi-shot:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /chat/chain-of-thought - Chain of thought prompting with explicit reasoning
router.post("/chain-of-thought", async (req, res) => {
  try {
    const { message, promptType, level, taskType, reasoningDepth, showReasoning } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const options = {};
    if (promptType) options.promptType = promptType;
    if (level) options.level = level;
    if (reasoningDepth) options.reasoningDepth = reasoningDepth;

    let finalMessage = message;
    let promptAnalysis = null;

    // Use task-specific reasoning if specified
    if (taskType) {
      const taskPrompt = chainOfThoughtEngine.generateTaskSpecificPrompt(taskType, message, options);
      finalMessage = taskPrompt.enhancedUserMessage;
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: finalMessage,
        analysisType: taskPrompt.analysisType,
        confidence: taskPrompt.confidence,
        taskType,
        reasoningType: taskPrompt.reasoningType,
        example: showReasoning ? taskPrompt.example : null
      };
    } else {
      // Regular chain of thought analysis
      const analysis = chainOfThoughtEngine.generatePrompt(message, options);
      promptAnalysis = {
        originalMessage: message,
        enhancedMessage: analysis.enhancedUserMessage,
        analysisType: analysis.analysisType,
        confidence: analysis.confidence,
        reasoningType: analysis.reasoningType,
        example: showReasoning ? analysis.example : null
      };
    }

    const response = await chatWithAIChainOfThought(finalMessage, options);

    res.json({
      reply: response,
      promptAnalysis,
      options: { promptType, level, taskType, reasoningDepth },
      promptingStrategy: 'chain-of-thought'
    });
  } catch (error) {
    console.error("Error in /chat/chain-of-thought:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /chat/compare - Compare all prompting strategies
router.post("/compare", async (req, res) => {
  try {
    const { message, promptType, level } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const options = {};
    if (promptType) options.promptType = promptType;
    if (level) options.level = level;

    // Get all four responses
    const [zeroShotResponse, oneShotResponse, multiShotResponse, chainOfThoughtResponse] = await Promise.all([
      chatWithAI(message, options),
      chatWithAIOneShot(message, options),
      chatWithAIMultiShot(message, { ...options, maxExamples: 3 }),
      chatWithAIChainOfThought(message, { ...options, reasoningDepth: 'moderate' })
    ]);

    // Get analysis from all engines
    const zeroShotAnalysis = zeroShotEngine.generatePrompt(message, options);
    const oneShotAnalysis = oneShotEngine.generatePrompt(message, options);
    const multiShotAnalysis = multiShotEngine.generatePrompt(message, { ...options, maxExamples: 3 });
    const chainOfThoughtAnalysis = chainOfThoughtEngine.generatePrompt(message, { ...options, reasoningDepth: 'moderate' });

    res.json({
      message,
      zeroShot: {
        response: zeroShotResponse,
        analysis: {
          type: zeroShotAnalysis.analysisType,
          confidence: zeroShotAnalysis.confidence,
          strategy: 'zero-shot'
        }
      },
      oneShot: {
        response: oneShotResponse,
        analysis: {
          type: oneShotAnalysis.analysisType,
          confidence: oneShotAnalysis.confidence,
          strategy: 'one-shot',
          exampleCount: 1
        }
      },
      multiShot: {
        response: multiShotResponse,
        analysis: {
          type: multiShotAnalysis.analysisType,
          confidence: multiShotAnalysis.confidence,
          strategy: 'multi-shot',
          exampleCount: multiShotAnalysis.exampleCount
        }
      },
      chainOfThought: {
        response: chainOfThoughtResponse,
        analysis: {
          type: chainOfThoughtAnalysis.analysisType,
          confidence: chainOfThoughtAnalysis.confidence,
          strategy: 'chain-of-thought',
          reasoningType: chainOfThoughtAnalysis.reasoningType
        }
      },
      options
    });
  } catch (error) {
    console.error("Error in /chat/compare:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
