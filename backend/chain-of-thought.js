#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import { ChainOfThoughtPromptEngine } from "./src/services/chain-of-thought-prompting.js";
import dotenv from "dotenv";

dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);

// Parse command line options
let promptType = null;
let level = null;
let taskType = null;
let reasoningDepth = null;
let showReasoning = false;
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
  } else if (args[i] === '--depth' && i + 1 < args.length) {
    reasoningDepth = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--show-reasoning') {
    showReasoning = true;
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
  console.log("🧠 Smart Study Assistant - Chain of Thought Prompting");
  console.log("\nUsage: node chain-of-thought.js [options] <your question>");
  console.log("\nOptions:");
  console.log("  --type <type>           Force a specific reasoning type (math, science, logic, etc.)");
  console.log("  --level <level>         Set difficulty level (beginner, intermediate, advanced)");
  console.log("  --task <task>           Use task-specific reasoning (explanation, problem_solving, etc.)");
  console.log("  --depth <depth>         Set reasoning depth (shallow, moderate, deep)");
  console.log("  --show-reasoning        Display the reasoning template being used");
  console.log("  --types                 Show all available reasoning types");
  console.log("  --examples              Show example questions for each type");
  console.log("  --help, -h              Show this help message");
  console.log("\nExamples:");
  console.log("  node chain-of-thought.js \"Why do heavier objects fall at the same rate as lighter ones?\"");
  console.log("  node chain-of-thought.js --type math \"Solve x² - 5x + 6 = 0\"");
  console.log("  node chain-of-thought.js --depth deep --show-reasoning \"How does democracy work?\"");
  console.log("  node chain-of-thought.js --task problem_solving \"How can I improve my study habits?\"");
  console.log("\nChain of Thought Benefits:");
  console.log("  • Shows explicit reasoning process step-by-step");
  console.log("  • Leads to more accurate and transparent answers");
  console.log("  • Helps identify logical flaws and assumptions");
  console.log("  • Improves problem-solving and critical thinking");
  console.log("  • Makes AI responses more educational and trustworthy");
}

function showAvailableTypes() {
  const engine = new ChainOfThoughtPromptEngine();
  const types = engine.getAvailableTypes();
  
  console.log("🧠 Available Reasoning Types:");
  types.forEach(type => {
    console.log(`  • ${type}`);
  });
  
  console.log("\n📋 Available Task Types:");
  console.log("  • explanation - Explain concepts with step-by-step reasoning");
  console.log("  • problem_solving - Solve problems showing strategy and logic");
  console.log("  • analysis - Analyze topics with systematic reasoning");
  console.log("  • comparison - Compare items showing analytical process");
  console.log("  • evaluation - Evaluate topics with clear criteria and reasoning");
  
  console.log("\n🎓 Available Difficulty Levels:");
  console.log("  • beginner - Simple reasoning steps, easy to follow");
  console.log("  • intermediate - Detailed reasoning with clear explanations");
  console.log("  • advanced - Sophisticated reasoning with nuanced analysis");
  
  console.log("\n🔍 Available Reasoning Depths:");
  console.log("  • shallow - Brief reasoning focusing on key steps");
  console.log("  • moderate - Thorough reasoning with clear explanations");
  console.log("  • deep - In-depth reasoning considering multiple perspectives");
}

function showExamples() {
  const engine = new ChainOfThoughtPromptEngine();
  const types = engine.getAvailableTypes();
  
  console.log("📚 Example Questions for Each Reasoning Type:");
  console.log("=".repeat(50));
  
  const examples = {
    math: "If a train travels 120 miles in 2 hours, then speeds up and travels 180 miles in the next 1.5 hours, what is its average speed?",
    science: "Why do objects fall at the same rate in a vacuum regardless of their mass?",
    logic: "All birds can fly. Penguins are birds. Therefore, penguins can fly. What's wrong with this argument?",
    problem_solving: "You have a 3-gallon jug and a 5-gallon jug. How can you measure exactly 4 gallons of water?"
  };
  
  types.forEach(type => {
    if (examples[type]) {
      console.log(`\n🔹 ${type.toUpperCase()}:`);
      console.log(`   "${examples[type]}"`);
      
      // Show reasoning approach for this type
      const example = engine.getExampleForType(type);
      if (example) {
        console.log(`   Reasoning approach: Shows ${type} thinking process`);
      }
    }
  });
  
  console.log("\n💡 Try any of these examples:");
  console.log("   node chain-of-thought.js --type math \"What is the average speed problem?\"");
  console.log("   node chain-of-thought.js --depth deep --show-reasoning \"Why do objects fall?\"");
  console.log("   node chain-of-thought.js --task analysis \"Analyze the benefits of exercise\"");
}

if (!question.trim()) {
  console.log("🧠 Smart Study Assistant - Chain of Thought Prompting");
  console.log("Usage: node chain-of-thought.js [options] <your question>");
  console.log("Use --help for more information or --types to see available options");
  process.exit(1);
}

console.log("🧠 Smart Study Assistant - Chain of Thought Prompting");
console.log(`❓ Question: ${question}`);

// Show what options are being used
if (promptType) console.log(`🎯 Reasoning Type: ${promptType}`);
if (level) console.log(`🎓 Level: ${level}`);
if (taskType) console.log(`📋 Task Type: ${taskType}`);
if (reasoningDepth) console.log(`🔍 Reasoning Depth: ${reasoningDepth}`);

console.log("🧠 Generating chain of thought reasoning...\n");

try {
  // Prepare options for the AI
  const options = { promptingStrategy: 'chain-of-thought' };
  if (promptType) options.promptType = promptType;
  if (level) options.level = level;
  if (reasoningDepth) options.reasoningDepth = reasoningDepth;

  let finalQuestion = question;
  let promptAnalysis = null;
  
  // Use task-specific reasoning if specified
  if (taskType) {
    const engine = new ChainOfThoughtPromptEngine();
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, question, options);
    finalQuestion = taskPrompt.enhancedUserMessage;
    promptAnalysis = taskPrompt;
    
    console.log("🔧 Using task-specific chain of thought reasoning");
    console.log(`📝 Enhanced prompt: ${taskPrompt.analysisType} (confidence: ${(taskPrompt.confidence * 100).toFixed(1)}%)`);
    
    if (showReasoning) {
      console.log("\n📖 Reasoning template being used:");
      console.log(`Task: ${taskPrompt.taskType}`);
      console.log(`Type: ${taskPrompt.analysisType}`);
      if (taskPrompt.example) {
        console.log(`Example: ${taskPrompt.example.question}`);
        console.log(`Reasoning approach: ${taskPrompt.example.response.substring(0, 200)}...`);
      }
    }
  } else {
    // Regular chain of thought analysis
    const engine = new ChainOfThoughtPromptEngine();
    promptAnalysis = engine.generatePrompt(question, options);
    
    console.log(`📝 Detected reasoning type: ${promptAnalysis.analysisType} (confidence: ${(promptAnalysis.confidence * 100).toFixed(1)}%)`);
    
    if (showReasoning) {
      console.log("\n📖 Reasoning template being used:");
      console.log(`Type: ${promptAnalysis.analysisType}`);
      if (promptAnalysis.example) {
        console.log(`Example: ${promptAnalysis.example.question}`);
        console.log(`Reasoning approach: ${promptAnalysis.example.response.substring(0, 200)}...`);
      }
    }
  }
  
  console.log();

  const answer = await chatWithAI(finalQuestion, options);
  console.log("🧠 Chain of Thought Response:");
  console.log("=".repeat(40));
  console.log(answer);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  
  if (error.message.includes("API key") || error.message.includes("authentication")) {
    console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
  }
}
