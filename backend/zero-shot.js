#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import { ZeroShotPromptEngine } from "./src/services/zero-shot-prompting.js";
import dotenv from "dotenv";

dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);

// Parse command line options
let promptType = null;
let level = null;
let taskType = null;
let question = "";

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--type' && i + 1 < args.length) {
    promptType = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--level' && i + 1 < args.length) {
    level = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--task' && i + 1 < args.length) {
    taskType = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--help' || args[i] === '-h') {
    showHelp();
    process.exit(0);
  } else if (args[i] === '--types') {
    showAvailableTypes();
    process.exit(0);
  } else {
    // Collect remaining arguments as the question
    question = args.slice(i).join(' ');
    break;
  }
}

function showHelp() {
  console.log("🤖 Smart Study Assistant - Zero-Shot Prompting");
  console.log("\nUsage: node zero-shot.js [options] <your question>");
  console.log("\nOptions:");
  console.log("  --type <type>     Force a specific prompt type (math, science, history, etc.)");
  console.log("  --level <level>   Set difficulty level (beginner, intermediate, advanced)");
  console.log("  --task <task>     Use task-specific prompting (explanation, problem_solving, etc.)");
  console.log("  --types           Show all available prompt types");
  console.log("  --help, -h        Show this help message");
  console.log("\nExamples:");
  console.log("  node zero-shot.js What is photosynthesis?");
  console.log("  node zero-shot.js --type math Solve 2x + 5 = 15");
  console.log("  node zero-shot.js --level beginner Explain quantum physics");
  console.log("  node zero-shot.js --task problem_solving Find the area of a circle with radius 5");
}

function showAvailableTypes() {
  const engine = new ZeroShotPromptEngine();
  const types = engine.getAvailableTypes();
  
  console.log("🎯 Available Prompt Types:");
  types.forEach(type => {
    console.log(`  • ${type}`);
  });
  
  console.log("\n📋 Available Task Types:");
  console.log("  • explanation - Explain concepts clearly");
  console.log("  • problem_solving - Solve problems step by step");
  console.log("  • analysis - Analyze topics in detail");
  console.log("  • comparison - Compare and contrast");
  console.log("  • summary - Provide comprehensive summaries");
  console.log("  • tutorial - Create tutorials or guides");
  console.log("  • research - Research and provide information");
  console.log("  • creative - Help with creative tasks");
  
  console.log("\n🎓 Available Difficulty Levels:");
  console.log("  • beginner - Simple terms and basic concepts");
  console.log("  • intermediate - Comprehensive explanations");
  console.log("  • advanced - Detailed, technical explanations");
}

if (!question.trim()) {
  console.log("🤖 Smart Study Assistant - Zero-Shot Prompting");
  console.log("Usage: node zero-shot.js [options] <your question>");
  console.log("Use --help for more information or --types to see available options");
  process.exit(1);
}

console.log("🤖 Smart Study Assistant - Zero-Shot Prompting");
console.log(`❓ Question: ${question}`);

// Show what options are being used
if (promptType) console.log(`🎯 Prompt Type: ${promptType}`);
if (level) console.log(`🎓 Level: ${level}`);
if (taskType) console.log(`📋 Task Type: ${taskType}`);

console.log("🧠 Analyzing and generating optimal prompt...\n");

try {
  // Prepare options for the AI
  const options = {};
  if (promptType) options.promptType = promptType;
  if (level) options.level = level;

  let finalQuestion = question;
  
  // Use task-specific prompting if specified
  if (taskType) {
    const engine = new ZeroShotPromptEngine();
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, question, options);
    finalQuestion = taskPrompt.enhancedUserMessage;
    
    console.log("🔧 Using task-specific prompting");
    console.log(`📝 Enhanced prompt: ${taskPrompt.analysisType} (confidence: ${(taskPrompt.confidence * 100).toFixed(1)}%)\n`);
  }

  const answer = await chatWithAI(finalQuestion, options);
  console.log("🤖 Answer:");
  console.log(answer);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  
  if (error.message.includes("API key") || error.message.includes("authentication")) {
    console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
  }
}
