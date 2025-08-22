#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import { ZeroShotPromptEngine } from "./src/services/zero-shot-prompting.js";
import dotenv from "dotenv";

dotenv.config();

async function runDemo() {
  console.log("🚀 Zero-Shot Prompting Demo");
  console.log("=" * 50);
  
  const engine = new ZeroShotPromptEngine();
  
  // Demo questions for different categories
  const demoQuestions = [
    {
      category: "Mathematics",
      question: "Solve the quadratic equation: 2x² - 8x + 6 = 0",
      options: { promptType: "math" }
    },
    {
      category: "Science",
      question: "Explain how photosynthesis works in plants",
      options: { promptType: "science", level: "intermediate" }
    },
    {
      category: "History",
      question: "What were the main causes of World War I?",
      options: { promptType: "history" }
    },
    {
      category: "Programming",
      question: "How do I create a function in Python that calculates factorial?",
      options: { promptType: "programming" }
    },
    {
      category: "Auto-Detection",
      question: "Write a creative short story about a robot learning to paint",
      options: {} // Let the system auto-detect this as creative
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
    
    if (demo.options.promptType) {
      console.log(`Forced Type: ${demo.options.promptType}`);
    }
    if (demo.options.level) {
      console.log(`Level: ${demo.options.level}`);
    }
    
    console.log("\n🤖 AI Response:");
    console.log("-".repeat(15));
    
    try {
      const response = await chatWithAI(demo.question, demo.options);
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
  
  console.log("\n✨ Demo completed!");
  console.log("\nTry the interactive mode:");
  console.log("node zero-shot.js <your question>");
  console.log("node zero-shot.js --help for more options");
}

// Task-specific demo
async function runTaskDemo() {
  console.log("\n🎯 Task-Specific Prompting Demo");
  console.log("=" * 40);
  
  const engine = new ZeroShotPromptEngine();
  const question = "Machine learning algorithms";
  
  const taskTypes = [
    "explanation",
    "analysis", 
    "tutorial",
    "comparison"
  ];
  
  for (const taskType of taskTypes) {
    console.log(`\n📋 Task: ${taskType.toUpperCase()}`);
    console.log("-".repeat(25));
    
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, question);
    console.log(`Enhanced Question: ${taskPrompt.enhancedUserMessage}`);
    console.log(`Analysis Type: ${taskPrompt.analysisType}`);
    
    console.log("\n🤖 Response:");
    try {
      const response = await chatWithAI(taskPrompt.enhancedUserMessage);
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

if (args.includes('--task-demo')) {
  runTaskDemo().catch(console.error);
} else if (args.includes('--help')) {
  console.log("🤖 Zero-Shot Prompting Demo");
  console.log("\nUsage:");
  console.log("  node demo-zero-shot.js          Run main demo");
  console.log("  node demo-zero-shot.js --task-demo  Run task-specific demo");
  console.log("  node demo-zero-shot.js --help       Show this help");
} else {
  runDemo().catch(console.error);
}
