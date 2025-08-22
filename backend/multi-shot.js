#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import { MultiShotPromptEngine } from "./src/services/multi-shot-prompting.js";
import dotenv from "dotenv";

dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);

// Parse command line options
let promptType = null;
let level = null;
let taskType = null;
let showExamples = false;
let maxExamples = null;
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
  } else if (args[i] === '--max-examples' && i + 1 < args.length) {
    maxExamples = parseInt(args[i + 1]);
    i++; // Skip next argument
  } else if (args[i] === '--show-examples') {
    showExamples = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    showHelp();
    process.exit(0);
  } else if (args[i] === '--types') {
    showAvailableTypes();
    process.exit(0);
  } else if (args[i] === '--examples') {
    showExampleQuestions();
    process.exit(0);
  } else {
    // Collect remaining arguments as the question
    question = args.slice(i).join(' ');
    break;
  }
}

function showHelp() {
  console.log("🤖 Smart Study Assistant - Multi-Shot Prompting");
  console.log("\nUsage: node multi-shot.js [options] <your question>");
  console.log("\nOptions:");
  console.log("  --type <type>           Force a specific prompt type (math, science, history, etc.)");
  console.log("  --level <level>         Set difficulty level (beginner, intermediate, advanced)");
  console.log("  --task <task>           Use task-specific prompting (explanation, problem_solving, etc.)");
  console.log("  --max-examples <num>    Maximum number of examples to use (1-5, default: 3)");
  console.log("  --show-examples         Display the examples used for prompting");
  console.log("  --types                 Show all available prompt types");
  console.log("  --examples              Show example questions for each type");
  console.log("  --help, -h              Show this help message");
  console.log("\nExamples:");
  console.log("  node multi-shot.js What is photosynthesis?");
  console.log("  node multi-shot.js --type math Solve 4x - 3 = 17");
  console.log("  node multi-shot.js --level beginner --show-examples Explain quantum physics");
  console.log("  node multi-shot.js --task problem_solving --max-examples 2 How do I fix a slow computer?");
  console.log("\nMulti-Shot vs One-Shot vs Zero-Shot:");
  console.log("  • Multi-shot provides multiple examples (2-5) to guide the AI's response format");
  console.log("  • One-shot provides exactly one example to guide the AI's response format");
  console.log("  • Zero-shot relies only on instructions without examples");
  console.log("  • Multi-shot often produces the most consistent, well-structured responses");
}

function showAvailableTypes() {
  const engine = new MultiShotPromptEngine();
  const types = engine.getAvailableTypes();
  
  console.log("🎯 Available Prompt Types:");
  types.forEach(type => {
    console.log(`  • ${type}`);
  });
  
  console.log("\n📋 Available Task Types:");
  console.log("  • explanation - Explain concepts clearly with multiple examples");
  console.log("  • problem_solving - Solve problems step by step with various approaches");
  console.log("  • analysis - Analyze topics in detail with comprehensive examples");
  console.log("  • comparison - Compare and contrast with multiple perspectives");
  console.log("  • summary - Provide comprehensive summaries with different formats");
  console.log("  • tutorial - Create tutorials or guides with step-by-step examples");
  console.log("  • research - Research and provide information with multiple sources");
  console.log("  • creative - Help with creative tasks using various techniques");
  
  console.log("\n🎓 Available Difficulty Levels:");
  console.log("  • beginner - Simple terms and basic concepts");
  console.log("  • intermediate - Comprehensive explanations");
  console.log("  • advanced - Detailed, technical explanations");
  
  console.log("\n📊 Example Count Options:");
  console.log("  • Default: 3 examples for subject-specific prompts");
  console.log("  • Default: 2 examples for task-specific prompts");
  console.log("  • Use --max-examples to customize (1-5 examples)");
}

function showExampleQuestions() {
  const engine = new MultiShotPromptEngine();
  const types = engine.getAvailableTypes();

  console.log("📚 Example Questions for Each Type:");
  console.log("=".repeat(50));
  
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
      
      // Show how many examples are available for this type
      const typeExamples = engine.getExamplesForType(type);
      console.log(`   (${typeExamples.length} examples available)`);
    }
  });
  
  console.log("\n💡 Try any of these examples:");
  console.log("   node multi-shot.js --type math \"Solve x² - 5x + 6 = 0\"");
  console.log("   node multi-shot.js --show-examples \"How does DNA work?\"");
  console.log("   node multi-shot.js --max-examples 2 --task explanation \"Explain machine learning\"");
}

if (!question.trim()) {
  console.log("🤖 Smart Study Assistant - Multi-Shot Prompting");
  console.log("Usage: node multi-shot.js [options] <your question>");
  console.log("Use --help for more information or --types to see available options");
  process.exit(1);
}

console.log("🤖 Smart Study Assistant - Multi-Shot Prompting");
console.log(`❓ Question: ${question}`);

// Show what options are being used
if (promptType) console.log(`🎯 Prompt Type: ${promptType}`);
if (level) console.log(`🎓 Level: ${level}`);
if (taskType) console.log(`📋 Task Type: ${taskType}`);
if (maxExamples) console.log(`📊 Max Examples: ${maxExamples}`);

console.log("🧠 Analyzing and generating multi-shot prompt with multiple examples...\n");

try {
  // Prepare options for the AI
  const options = { promptingStrategy: 'multi-shot' };
  if (promptType) options.promptType = promptType;
  if (level) options.level = level;
  if (maxExamples) options.maxExamples = maxExamples;

  let finalQuestion = question;
  let promptAnalysis = null;
  
  // Use task-specific prompting if specified
  if (taskType) {
    const engine = new MultiShotPromptEngine();
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, question, options);
    finalQuestion = taskPrompt.enhancedUserMessage;
    promptAnalysis = taskPrompt;
    
    console.log("🔧 Using task-specific multi-shot prompting");
    console.log(`📝 Enhanced prompt: ${taskPrompt.analysisType} (confidence: ${(taskPrompt.confidence * 100).toFixed(1)}%)`);
    console.log(`📊 Using ${taskPrompt.exampleCount} examples`);
    
    if (showExamples) {
      console.log("\n📖 Examples being used:");
      taskPrompt.examples.forEach((example, index) => {
        console.log(`\n**Example ${index + 1}:**`);
        console.log(`Q: ${example.question}`);
        console.log(`A: ${example.response.substring(0, 200)}...`);
      });
    }
  } else {
    // Regular multi-shot analysis
    const engine = new MultiShotPromptEngine();
    promptAnalysis = engine.generatePrompt(question, options);
    
    console.log(`📝 Detected type: ${promptAnalysis.analysisType} (confidence: ${(promptAnalysis.confidence * 100).toFixed(1)}%)`);
    console.log(`📊 Using ${promptAnalysis.exampleCount} examples`);
    
    if (showExamples) {
      console.log("\n📖 Examples being used:");
      promptAnalysis.examples.forEach((example, index) => {
        console.log(`\n**Example ${index + 1}:**`);
        console.log(`Q: ${example.question}`);
        console.log(`A: ${example.response.substring(0, 200)}...`);
      });
    }
  }
  
  console.log();

  const answer = await chatWithAI(finalQuestion, options);
  console.log("🤖 Answer:");
  console.log(answer);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  
  if (error.message.includes("API key") || error.message.includes("authentication")) {
    console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
  }
}
