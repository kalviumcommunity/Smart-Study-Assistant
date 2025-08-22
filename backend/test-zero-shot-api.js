#!/usr/bin/env node
/**
 * Simple test script for Zero-Shot Prompting API endpoints
 * This tests the API without starting a full server
 */

import { ZeroShotPromptEngine } from "./src/services/zero-shot-prompting.js";
import { chatWithAI } from "./src/services/gemini.js";
import dotenv from "dotenv";

dotenv.config();

async function testZeroShotEngine() {
  console.log("🧪 Testing Zero-Shot Prompting Engine");
  console.log("=" * 40);
  
  const engine = new ZeroShotPromptEngine();
  
  // Test 1: Automatic detection
  console.log("\n1. Testing Automatic Subject Detection");
  console.log("-".repeat(35));
  
  const testQuestions = [
    "Solve 3x + 7 = 22",
    "What is DNA?", 
    "When did World War II end?",
    "How do I write a for loop in Python?",
    "Write a poem about nature"
  ];
  
  for (const question of testQuestions) {
    const analysis = engine.generatePrompt(question);
    console.log(`Question: "${question}"`);
    console.log(`Detected: ${analysis.analysisType} (${(analysis.confidence * 100).toFixed(1)}%)`);
    console.log();
  }
  
  // Test 2: Manual type override
  console.log("2. Testing Manual Type Override");
  console.log("-".repeat(30));
  
  const question = "Explain gravity";
  const normalAnalysis = engine.generatePrompt(question);
  const forcedAnalysis = engine.generatePrompt(question, { promptType: "math" });
  
  console.log(`Question: "${question}"`);
  console.log(`Normal detection: ${normalAnalysis.analysisType}`);
  console.log(`Forced as math: ${forcedAnalysis.analysisType}`);
  console.log();
  
  // Test 3: Task-specific prompting
  console.log("3. Testing Task-Specific Prompting");
  console.log("-".repeat(32));
  
  const baseQuestion = "Machine learning";
  const taskTypes = ["explanation", "tutorial", "analysis"];
  
  for (const taskType of taskTypes) {
    const taskPrompt = engine.generateTaskSpecificPrompt(taskType, baseQuestion);
    console.log(`Task: ${taskType}`);
    console.log(`Enhanced: ${taskPrompt.enhancedUserMessage.substring(0, 60)}...`);
    console.log();
  }
  
  // Test 4: Available types
  console.log("4. Testing Available Types");
  console.log("-".repeat(25));
  
  const types = engine.getAvailableTypes();
  console.log(`Available types: ${types.join(", ")}`);
  console.log();
  
  console.log("✅ Zero-Shot Engine tests completed!");
}

async function testIntegration() {
  console.log("\n🔗 Testing Integration with Gemini API");
  console.log("=" * 40);
  
  if (!process.env.GEMINI_API_KEY) {
    console.log("❌ GEMINI_API_KEY not found in environment");
    console.log("💡 Add your API key to .env file to test integration");
    return;
  }
  
  try {
    console.log("Testing simple math question with zero-shot prompting...");
    const response = await chatWithAI("What is 15% of 80?", { promptType: "math" });
    console.log("✅ API integration successful!");
    console.log(`Response preview: ${response.substring(0, 100)}...`);
  } catch (error) {
    console.log("❌ API integration failed:");
    console.log(error.message);
  }
}

async function runTests() {
  try {
    await testZeroShotEngine();
    await testIntegration();
    
    console.log("\n🎉 All tests completed!");
    console.log("\nNext steps:");
    console.log("1. Try: node zero-shot.js 'Your question here'");
    console.log("2. Start server and test API endpoints");
    console.log("3. Run: node demo-zero-shot.js for full demonstration");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

runTests();
