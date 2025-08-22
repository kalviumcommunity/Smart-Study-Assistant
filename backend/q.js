#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import dotenv from "dotenv";

dotenv.config();

const question = process.argv.slice(2).join(' ');

if (!question.trim()) {
  console.log("Usage: node q.js <question>");
  process.exit(1);
}

try {
  const answer = await chatWithAI(question);
  console.log(answer);
} catch (error) {
  console.error("Error:", error.message);
}
