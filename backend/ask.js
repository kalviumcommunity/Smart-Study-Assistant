#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import dotenv from "dotenv";

dotenv.config();

// Get the question from command line arguments
const args = process.argv.slice(2);
const question = args.join(' ');

if (!question.trim()) {
  console.log("🤖 Smart Study Assistant");
  console.log("Usage: node ask.js <your question>");
  console.log("Example: node ask.js What is photosynthesis?");
  console.log("Example: node ask.js Solve 2x + 5 = 15");
  process.exit(1);
}

console.log(`❓ Question: ${question}`);
console.log("🤔 Thinking...\n");

try {
  const answer = await chatWithAI(question);
  console.log("🤖 Answer:");
  console.log(answer);
} catch (error) {
  console.error("❌ Error:", error.message);
  
  if (error.message.includes("API key") || error.message.includes("authentication")) {
    console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
  }
}
