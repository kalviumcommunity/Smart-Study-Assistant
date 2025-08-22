#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import { MultiShotPromptEngine } from "./src/services/multi-shot-prompting.js";
import dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);

// Demo configurations
const demoQuestions = [
  {
    question: "Solve the equation 2x + 5 = 13",
    type: "math",
    description: "Mathematics problem solving with step-by-step approach"
  },
  {
    question: "How does the water cycle work?",
    type: "science", 
    description: "Scientific process explanation with real-world applications"
  },
  {
    question: "What caused the French Revolution?",
    type: "history",
    description: "Historical analysis with multiple factors and timeline"
  },
  {
    question: "Create a JavaScript function to find the largest number in an array",
    type: "programming",
    description: "Programming solution with multiple approaches and explanations"
  }
];

const taskDemoQuestions = [
  {
    question: "How does artificial intelligence work?",
    task: "explanation",
    description: "Comprehensive explanation with multiple examples"
  },
  {
    question: "My laptop won't start up properly",
    task: "problem_solving", 
    description: "Systematic problem-solving approach with multiple solutions"
  }
];

function showHelp() {
  console.log("🤖 Smart Study Assistant - Multi-Shot Prompting Demo");
  console.log("\nUsage: node demo-multi-shot.js [options]");
  console.log("\nOptions:");
  console.log("  --comparison        Compare zero-shot, one-shot, and multi-shot responses");
  console.log("  --task-demo         Demonstrate task-specific multi-shot prompting");
  console.log("  --interactive       Interactive demo mode");
  console.log("  --help, -h          Show this help message");
  console.log("\nDefault: Runs standard multi-shot prompting demonstration");
}

async function runStandardDemo() {
  console.log("🎯 Multi-Shot Prompting Demonstration");
  console.log("=".repeat(50));
  console.log("\nMulti-shot prompting uses multiple examples (2-5) to guide AI responses,");
  console.log("providing better pattern recognition and more consistent formatting.\n");

  const engine = new MultiShotPromptEngine();

  for (let i = 0; i < demoQuestions.length; i++) {
    const demo = demoQuestions[i];
    
    console.log(`\n📋 Demo ${i + 1}: ${demo.description}`);
    console.log(`❓ Question: "${demo.question}"`);
    
    // Generate multi-shot prompt
    const promptAnalysis = engine.generatePrompt(demo.question, { 
      promptType: demo.type,
      maxExamples: 3
    });
    
    console.log(`🎯 Detected Type: ${promptAnalysis.analysisType}`);
    console.log(`📊 Using ${promptAnalysis.exampleCount} examples`);
    console.log(`🎓 Confidence: ${(promptAnalysis.confidence * 100).toFixed(1)}%`);
    
    console.log("\n📖 Examples being used:");
    promptAnalysis.examples.forEach((example, index) => {
      console.log(`\n**Example ${index + 1}:**`);
      console.log(`Q: ${example.question}`);
      console.log(`A: ${example.response.substring(0, 150)}...`);
    });
    
    console.log("\n🤖 AI Response:");
    console.log("-" * 40);
    
    try {
      const response = await chatWithAI(demo.question, { 
        promptingStrategy: 'multi-shot',
        promptType: demo.type,
        maxExamples: 3
      });
      console.log(response);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
    
    if (i < demoQuestions.length - 1) {
      console.log("\n" + "=".repeat(50));
      await new Promise(resolve => setTimeout(resolve, 2000)); // Brief pause
    }
  }
}

async function runTaskDemo() {
  console.log("🔧 Task-Specific Multi-Shot Prompting Demo");
  console.log("=".repeat(50));
  console.log("\nTask-specific prompting uses examples tailored to specific types of tasks,");
  console.log("such as explanations, problem-solving, analysis, etc.\n");

  const engine = new MultiShotPromptEngine();

  for (let i = 0; i < taskDemoQuestions.length; i++) {
    const demo = taskDemoQuestions[i];
    
    console.log(`\n📋 Task Demo ${i + 1}: ${demo.description}`);
    console.log(`❓ Question: "${demo.question}"`);
    console.log(`🔧 Task Type: ${demo.task}`);
    
    // Generate task-specific multi-shot prompt
    const taskPrompt = engine.generateTaskSpecificPrompt(demo.task, demo.question, {
      maxExamples: 2
    });
    
    console.log(`🎯 Analysis Type: ${taskPrompt.analysisType}`);
    console.log(`📊 Using ${taskPrompt.exampleCount} task-specific examples`);
    console.log(`🎓 Confidence: ${(taskPrompt.confidence * 100).toFixed(1)}%`);
    
    console.log("\n📖 Task-specific examples being used:");
    taskPrompt.examples.forEach((example, index) => {
      console.log(`\n**Example ${index + 1}:**`);
      console.log(`Q: ${example.question}`);
      console.log(`A: ${example.response.substring(0, 150)}...`);
    });
    
    console.log("\n🤖 AI Response:");
    console.log("-" * 40);
    
    try {
      const response = await chatWithAI(taskPrompt.enhancedUserMessage, { 
        promptingStrategy: 'multi-shot',
        maxExamples: 2
      });
      console.log(response);
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
    
    if (i < taskDemoQuestions.length - 1) {
      console.log("\n" + "=".repeat(50));
      await new Promise(resolve => setTimeout(resolve, 2000)); // Brief pause
    }
  }
}

async function runComparisonDemo() {
  console.log("⚖️  Prompting Strategy Comparison Demo");
  console.log("=".repeat(50));
  console.log("\nComparing Zero-Shot vs One-Shot vs Multi-Shot prompting");
  console.log("on the same question to show the differences in approach and output.\n");

  const testQuestion = "Explain how photosynthesis works";
  const promptType = "science";

  console.log(`❓ Test Question: "${testQuestion}"`);
  console.log(`🎯 Prompt Type: ${promptType}\n`);

  // Import other engines for comparison
  const { ZeroShotPromptEngine } = await import("./src/services/zero-shot-prompting.js");
  const { OneShotPromptEngine } = await import("./src/services/one-shot-prompting.js");
  
  const zeroShotEngine = new ZeroShotPromptEngine();
  const oneShotEngine = new OneShotPromptEngine();
  const multiShotEngine = new MultiShotPromptEngine();

  // Zero-Shot
  console.log("🔹 ZERO-SHOT PROMPTING (No Examples)");
  console.log("-" * 30);
  try {
    const zeroShotResponse = await chatWithAI(testQuestion, { 
      promptingStrategy: 'zero-shot',
      promptType: promptType
    });
    console.log(zeroShotResponse.substring(0, 300) + "...\n");
  } catch (error) {
    console.error("❌ Zero-shot error:", error.message);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // One-Shot
  console.log("🔸 ONE-SHOT PROMPTING (1 Example)");
  console.log("-" * 30);
  try {
    const oneShotResponse = await chatWithAI(testQuestion, { 
      promptingStrategy: 'one-shot',
      promptType: promptType
    });
    console.log(oneShotResponse.substring(0, 300) + "...\n");
  } catch (error) {
    console.error("❌ One-shot error:", error.message);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Multi-Shot
  console.log("🔶 MULTI-SHOT PROMPTING (Multiple Examples)");
  console.log("-" * 30);
  try {
    const multiShotResponse = await chatWithAI(testQuestion, { 
      promptingStrategy: 'multi-shot',
      promptType: promptType,
      maxExamples: 3
    });
    console.log(multiShotResponse.substring(0, 300) + "...\n");
  } catch (error) {
    console.error("❌ Multi-shot error:", error.message);
  }

  console.log("📊 COMPARISON SUMMARY:");
  console.log("• Zero-shot: Fast, basic structure, may vary in format");
  console.log("• One-shot: Good consistency, follows single example pattern");
  console.log("• Multi-shot: Best consistency, rich examples, comprehensive format");
}

async function runInteractiveDemo() {
  console.log("🎮 Interactive Multi-Shot Prompting Demo");
  console.log("=".repeat(50));
  console.log("Ask any question and see multi-shot prompting in action!");
  console.log("Type 'exit' to quit.\n");

  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const engine = new MultiShotPromptEngine();

  const askQuestion = () => {
    rl.question("❓ Your question: ", async (question) => {
      if (question.toLowerCase() === 'exit') {
        console.log("👋 Thanks for trying multi-shot prompting!");
        rl.close();
        return;
      }

      if (!question.trim()) {
        console.log("Please enter a question.");
        askQuestion();
        return;
      }

      try {
        const analysis = engine.generatePrompt(question, { maxExamples: 3 });
        
        console.log(`\n🎯 Detected: ${analysis.analysisType} (${(analysis.confidence * 100).toFixed(1)}% confidence)`);
        console.log(`📊 Using ${analysis.exampleCount} examples\n`);
        
        const response = await chatWithAI(question, { 
          promptingStrategy: 'multi-shot',
          maxExamples: 3
        });
        
        console.log("🤖 Response:");
        console.log("-".repeat(30));
        console.log(response);
        console.log("\n" + "=".repeat(50) + "\n");
        
      } catch (error) {
        console.error("❌ Error:", error.message);
      }
      
      askQuestion();
    });
  };

  askQuestion();
}

// Main execution
async function main() {
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.includes('--comparison')) {
    await runComparisonDemo();
  } else if (args.includes('--task-demo')) {
    await runTaskDemo();
  } else if (args.includes('--interactive')) {
    await runInteractiveDemo();
  } else {
    await runStandardDemo();
  }
}

main().catch(console.error);
