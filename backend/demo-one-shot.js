#!/usr/bin/env node
import { chatWithAIOneShot } from "./src/services/gemini.js";
import { OneShotPromptEngine } from "./src/services/one-shot-prompting.js";
import { chatWithAI } from "./src/services/gemini.js";
import dotenv from "dotenv";

dotenv.config();

async function runDemo() {
  console.log("🚀 One-Shot Prompting Demo");
  console.log("=" * 50);
  
  const engine = new OneShotPromptEngine();
  
  // Demo questions for different categories
  const demoQuestions = [
    {
      category: "Mathematics",
      question: "Solve the equation: 4x - 7 = 21",
      options: { promptType: "math" }
    },
    {
      category: "Science",
      question: "What is cellular respiration?",
      options: { promptType: "science", level: "intermediate" }
    },
    {
      category: "History",
      question: "What caused the French Revolution?",
      options: { promptType: "history" }
    },
    {
      category: "Programming",
      question: "How do I create a class in Python?",
      options: { promptType: "programming" }
    },
    {
      category: "Creative Writing",
      question: "Help me write a story about time travel",
      options: { promptType: "creative" }
    }
  ];

  for (let i = 0; i < demoQuestions.length; i++) {
    const demo = demoQuestions[i];
    
    console.log(`\n${i + 1}. ${demo.category} Example`);
    console.log("-".repeat(30));
    console.log(`Question: ${demo.question}`);
    
    // Show prompt analysis
    const analysis = engine.generatePrompt(demo.question, demo.options);
    console.log(`Detected Type: ${analysis.analysisType}`);
    console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
    
    // Show the example being used
    console.log(`\n📖 Example Used:`);
    console.log(`Q: ${analysis.example.question}`);
    console.log(`A: ${analysis.example.response.substring(0, 150)}...`);
    
    if (demo.options.promptType) {
      console.log(`Forced Type: ${demo.options.promptType}`);
    }
    if (demo.options.level) {
      console.log(`Level: ${demo.options.level}`);
    }
    
    console.log("\n🤖 One-Shot AI Response:");
    console.log("-".repeat(20));
    
    try {
      const response = await chatWithAIOneShot(demo.question, demo.options);
      console.log(response);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    
    console.log("\n" + "=".repeat(50));
    
    // Add a small delay between requests
    if (i < demoQuestions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log("\n✨ One-Shot Demo completed!");
  console.log("\nTry the interactive mode:");
  console.log("node one-shot.js <your question>");
  console.log("node one-shot.js --help for more options");
}

// Comparison demo: Zero-shot vs One-shot
async function runComparisonDemo() {
  console.log("\n🔄 Zero-Shot vs One-Shot Comparison");
  console.log("=" * 45);
  
  const testQuestion = "Solve the equation 3x + 8 = 23";
  
  console.log(`\nTest Question: "${testQuestion}"`);
  console.log("\n" + "-".repeat(45));
  
  try {
    // Zero-shot response
    console.log("🎯 ZERO-SHOT RESPONSE:");
    console.log("-".repeat(20));
    const zeroShotResponse = await chatWithAI(testQuestion, { promptType: "math" });
    console.log(zeroShotResponse.substring(0, 300) + "...");
    
    console.log("\n" + "-".repeat(45));
    
    // One-shot response
    console.log("🎯 ONE-SHOT RESPONSE (with example):");
    console.log("-".repeat(35));
    const oneShotResponse = await chatWithAIOneShot(testQuestion, { promptType: "math" });
    console.log(oneShotResponse.substring(0, 300) + "...");
    
    console.log("\n📊 COMPARISON NOTES:");
    console.log("• Zero-shot: Relies on instructions only");
    console.log("• One-shot: Uses example to guide response format");
    console.log("• One-shot typically provides more consistent structure");
    console.log("• One-shot may be more verbose due to example influence");
    
  } catch (error) {
    console.error("Error in comparison:", error.message);
  }
}

// Task-specific demo
async function runTaskDemo() {
  console.log("\n🎯 Task-Specific One-Shot Prompting Demo");
  console.log("=" * 45);
  
  const engine = new OneShotPromptEngine();
  const question = "Artificial intelligence in healthcare";
  
  const taskTypes = [
    "explanation",
    "analysis", 
    "problem_solving"
  ];
  
  for (const taskType of taskTypes) {
    console.log(`\n📋 Task: ${taskType.toUpperCase()}`);
    console.log("-".repeat(30));
    
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, question);
    console.log(`Enhanced Question: ${taskPrompt.enhancedUserMessage.substring(0, 100)}...`);
    console.log(`Analysis Type: ${taskPrompt.analysisType}`);
    
    console.log(`\n📖 Example Used:`);
    console.log(`Q: ${taskPrompt.example.question}`);
    console.log(`A: ${taskPrompt.example.response.substring(0, 100)}...`);
    
    console.log("\n🤖 Response:");
    try {
      const response = await chatWithAIOneShot(taskPrompt.enhancedUserMessage);
      // Show only first 200 characters for demo
      console.log(response.substring(0, 200) + "...");
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--comparison')) {
  runComparisonDemo().catch(console.error);
} else if (args.includes('--task-demo')) {
  runTaskDemo().catch(console.error);
} else if (args.includes('--help')) {
  console.log("🤖 One-Shot Prompting Demo");
  console.log("\nUsage:");
  console.log("  node demo-one-shot.js              Run main demo");
  console.log("  node demo-one-shot.js --comparison  Compare zero-shot vs one-shot");
  console.log("  node demo-one-shot.js --task-demo   Run task-specific demo");
  console.log("  node demo-one-shot.js --help        Show this help");
  console.log("\nWhat is One-Shot Prompting?");
  console.log("• Provides a single example to guide AI responses");
  console.log("• More consistent output format than zero-shot");
  console.log("• Helps AI understand desired response structure");
  console.log("• Particularly effective for structured tasks");
} else {
  runDemo().catch(console.error);
}
