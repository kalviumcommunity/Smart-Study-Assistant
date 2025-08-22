#!/usr/bin/env node
import { chatWithAIOneShot } from "./src/services/gemini.js";
import { OneShotPromptEngine } from "./src/services/one-shot-prompting.js";
import dotenv from "dotenv";

dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);

// Parse command line options
let promptType = null;
let level = null;
let taskType = null;
let showExample = false;
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
  } else if (args[i] === '--show-example') {
    showExample = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    showHelp();
    process.exit(0);
  } else if (args[i] === '--types') {
    showAvailableTypes();
    process.exit(0);
  } else if (args[i] === '--examples') {
    showExamples();
    process.exit(0);
  } else {
    // Collect remaining arguments as the question
    question = args.slice(i).join(' ');
    break;
  }
}

function showHelp() {
  console.log("🤖 Smart Study Assistant - One-Shot Prompting");
  console.log("\nUsage: node one-shot.js [options] <your question>");
  console.log("\nOptions:");
  console.log("  --type <type>       Force a specific prompt type (math, science, history, etc.)");
  console.log("  --level <level>     Set difficulty level (beginner, intermediate, advanced)");
  console.log("  --task <task>       Use task-specific prompting (explanation, problem_solving, etc.)");
  console.log("  --show-example      Display the example used for prompting");
  console.log("  --types             Show all available prompt types");
  console.log("  --examples          Show example questions for each type");
  console.log("  --help, -h          Show this help message");
  console.log("\nExamples:");
  console.log("  node one-shot.js What is photosynthesis?");
  console.log("  node one-shot.js --type math Solve 4x - 3 = 17");
  console.log("  node one-shot.js --level beginner --show-example Explain quantum physics");
  console.log("  node one-shot.js --task problem_solving How do I fix a slow computer?");
  console.log("\nOne-Shot vs Zero-Shot:");
  console.log("  • One-shot provides an example to guide the AI's response format");
  console.log("  • Zero-shot relies only on instructions without examples");
  console.log("  • One-shot often produces more consistent, structured responses");
}

function showAvailableTypes() {
  const engine = new OneShotPromptEngine();
  const types = engine.getAvailableTypes();
  
  console.log("🎯 Available Prompt Types:");
  types.forEach(type => {
    console.log(`  • ${type}`);
  });
  
  console.log("\n📋 Available Task Types:");
  console.log("  • explanation - Explain concepts clearly with examples");
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

function showExamples() {
  const engine = new OneShotPromptEngine();
  const types = engine.getAvailableTypes();
  
  console.log("📚 Example Questions for Each Type:");
  console.log("=" * 40);
  
  const examples = {
    math: "Solve the quadratic equation: x² - 5x + 6 = 0",
    science: "How does DNA replication work?",
    history: "What were the causes of the American Civil War?",
    programming: "Create a Python function to reverse a string",
    language: "What's the difference between 'who' and 'whom'?",
    creative: "Write a short poem about artificial intelligence"
  };
  
  types.forEach(type => {
    if (examples[type]) {
      console.log(`\n🔹 ${type.toUpperCase()}:`);
      console.log(`   "${examples[type]}"`);
    }
  });
  
  console.log("\n💡 Try any of these examples:");
  console.log("   node one-shot.js --type math \"Solve x² - 5x + 6 = 0\"");
  console.log("   node one-shot.js --show-example \"How does DNA work?\"");
}

if (!question.trim()) {
  console.log("🤖 Smart Study Assistant - One-Shot Prompting");
  console.log("Usage: node one-shot.js [options] <your question>");
  console.log("Use --help for more information or --types to see available options");
  process.exit(1);
}

console.log("🤖 Smart Study Assistant - One-Shot Prompting");
console.log(`❓ Question: ${question}`);

// Show what options are being used
if (promptType) console.log(`🎯 Prompt Type: ${promptType}`);
if (level) console.log(`🎓 Level: ${level}`);
if (taskType) console.log(`📋 Task Type: ${taskType}`);

console.log("🧠 Analyzing and generating one-shot prompt with example...\n");

try {
  // Prepare options for the AI
  const options = {};
  if (promptType) options.promptType = promptType;
  if (level) options.level = level;

  let finalQuestion = question;
  let promptAnalysis = null;
  
  // Use task-specific prompting if specified
  if (taskType) {
    const engine = new OneShotPromptEngine();
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, question, options);
    finalQuestion = taskPrompt.enhancedUserMessage;
    promptAnalysis = taskPrompt;
    
    console.log("🔧 Using task-specific one-shot prompting");
    console.log(`📝 Enhanced prompt: ${taskPrompt.analysisType} (confidence: ${(taskPrompt.confidence * 100).toFixed(1)}%)`);
    
    if (showExample) {
      console.log("\n📖 Example being used:");
      console.log(`Q: ${taskPrompt.example.question}`);
      console.log(`A: ${taskPrompt.example.response.substring(0, 200)}...`);
    }
  } else {
    // Regular one-shot analysis
    const engine = new OneShotPromptEngine();
    promptAnalysis = engine.generatePrompt(question, options);
    
    console.log(`📝 Detected type: ${promptAnalysis.analysisType} (confidence: ${(promptAnalysis.confidence * 100).toFixed(1)}%)`);
    
    if (showExample) {
      console.log("\n📖 Example being used:");
      console.log(`Q: ${promptAnalysis.example.question}`);
      console.log(`A: ${promptAnalysis.example.response.substring(0, 200)}...`);
    }
  }
  
  console.log();

  const answer = await chatWithAIOneShot(finalQuestion, options);
  console.log("🤖 Answer:");
  console.log(answer);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  
  if (error.message.includes("API key") || error.message.includes("authentication")) {
    console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
  }
}
