import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { ZeroShotPromptEngine } from "./zero-shot-prompting.js";
import { OneShotPromptEngine } from "./one-shot-prompting.js";
import { MultiShotPromptEngine } from "./multi-shot-prompting.js";
import { ChainOfThoughtPromptEngine } from "./chain-of-thought-prompting.js";
import { logTokenUsage } from "../utils/token-tracker.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const zeroShotEngine = new ZeroShotPromptEngine();
const oneShotEngine = new OneShotPromptEngine();
const multiShotEngine = new MultiShotPromptEngine();
const chainOfThoughtEngine = new ChainOfThoughtPromptEngine();

export async function chatWithAI(userMessage, options = {}) {
  try {
    // Choose prompting strategy based on options
    let promptResult;

    if (options.promptingStrategy === 'chain-of-thought') {
      // Use chain of thought prompting with explicit reasoning
      promptResult = chainOfThoughtEngine.generatePrompt(userMessage, options);
    } else if (options.promptingStrategy === 'multi-shot') {
      // Use multi-shot prompting with multiple examples
      promptResult = multiShotEngine.generatePrompt(userMessage, options);
    } else if (options.promptingStrategy === 'one-shot') {
      // Use one-shot prompting with examples
      promptResult = oneShotEngine.generatePrompt(userMessage, options);
    } else {
      // Default to zero-shot prompting
      promptResult = zeroShotEngine.generatePrompt(userMessage, options);
    }

    const { systemPrompt, enhancedUserMessage } = promptResult;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent([
      systemPrompt,
      enhancedUserMessage
    ]);

    // Log token usage information with enhanced tracking
    const strategy = options.promptingStrategy || 'zero-shot';
    if (response.response?.usageMetadata) {
      logTokenUsage('Gemini Service', response.response.usageMetadata, {
        strategy: strategy,
        subject: options.promptType,
        level: options.level
      });
    }

    // Clean up the response text for better readability
    let cleanText = response.response.text();

    // Remove excessive markdown formatting while preserving structure
    cleanText = cleanText
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1') // Remove triple asterisks
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove double asterisks (bold)
      .replace(/\*([^*]+)\*/g, '$1') // Remove single asterisks (italic)
      .replace(/#{1,6}\s*/gm, '') // Remove markdown headers
      .replace(/^\s*[\*\-\+]\s*/gm, '• ') // Convert markdown lists to bullet points
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered list formatting
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines to double
      .replace(/^\s+/gm, '') // Remove leading whitespace from lines
      .replace(/\s+$/gm, '') // Remove trailing whitespace from lines
      .trim();

    return cleanText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Chain of thought prompting specific function
export async function chatWithAIChainOfThought(userMessage, options = {}) {
  return chatWithAI(userMessage, { ...options, promptingStrategy: 'chain-of-thought' });
}

// Multi-shot prompting specific function
export async function chatWithAIMultiShot(userMessage, options = {}) {
  return chatWithAI(userMessage, { ...options, promptingStrategy: 'multi-shot' });
}

// One-shot prompting specific function
export async function chatWithAIOneShot(userMessage, options = {}) {
  return chatWithAI(userMessage, { ...options, promptingStrategy: 'one-shot' });
}

// Zero-shot prompting specific function (explicit)
export async function chatWithAIZeroShot(userMessage, options = {}) {
  return chatWithAI(userMessage, { ...options, promptingStrategy: 'zero-shot' });
}

// Legacy function for backward compatibility
export async function chatWithAIBasic(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent([
      "You are a helpful study assistant. Provide clear, concise, and well-formatted responses. Use simple formatting and avoid excessive markdown. Keep explanations friendly but not overly verbose.",
      userMessage
    ]);

    // Log token usage information with enhanced tracking
    if (response.response?.usageMetadata) {
      logTokenUsage('Gemini Basic', response.response.usageMetadata, {
        strategy: 'basic',
        context: 'legacy'
      });
    }

    return response.response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
