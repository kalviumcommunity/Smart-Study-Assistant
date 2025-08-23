#!/usr/bin/env node
import { chatWithAI } from "./src/services/gemini.js";
import { ChainOfThoughtPromptEngine } from "./src/services/chain-of-thought-prompting.js";
import dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);

// Demo configurations
const demoQuestions = [
  {
    question: "If I buy 3 apples for $2.40 and 5 oranges for $3.75, what's the cost per fruit if I calculate the average?",
    type: "math",
    description: "Mathematical reasoning with step-by-step calculation"
  },
  {
    question: "Why do we see lightning before hearing thunder during a storm?",
    type: "science", 
    description: "Scientific reasoning with cause-and-effect analysis"
  },
  {
    question: "If all cats are mammals, and all mammals are animals, what can we conclude about cats?",
    type: "logic",
    description: "Logical reasoning with syllogistic structure"
  },
  {
    question: "How would you organize a study schedule for 5 different subjects with limited time?",
    type: "problem_solving",
    description: "Problem-solving reasoning with strategy development"
  }
];

const taskDemoQuestions = [
  {
    question: "How does compound interest work and why is it called 'the eighth wonder of the world'?",
    task: "explanation",
    description: "Explanatory reasoning with step-by-step breakdown"
  },
  {
    question: "Compare the advantages and disadvantages of online learning versus traditional classroom learning",
    task: "comparison", 
    description: "Comparative reasoning with systematic analysis"
  },
  {
    question: "Evaluate whether social media has a net positive or negative impact on society",
    task: "evaluation",
    description: "Evaluative reasoning with criteria-based judgment"
  }
];

function showHelp() {
  console.log("🧠 Smart Study Assistant - Chain of Thought Demo");
  console.log("\nUsage: node demo-chain-of-thought.js [options]");
  console.log("\nOptions:");
  console.log("  --comparison        Compare different prompting strategies with chain of thought");
  console.log("  --task-demo         Demonstrate task-specific chain of thought reasoning");
  console.log("  --reasoning-depths  Show different reasoning depth levels");
  console.log("  --interactive       Interactive demo mode");
  console.log("  --help, -h          Show this help message");
  console.log("\nDefault: Runs standard chain of thought reasoning demonstration");
}

async function runStandardDemo() {
  console.log("🧠 Chain of Thought Reasoning Demonstration");
  console.log("=".repeat(50));
  console.log("\nChain of thought prompting encourages AI to show explicit reasoning,");
  console.log("leading to more accurate, transparent, and educational responses.\n");

  const engine = new ChainOfThoughtPromptEngine();

  for (let i = 0; i < demoQuestions.length; i++) {
    const demo = demoQuestions[i];
    
    console.log(`\n📋 Demo ${i + 1}: ${demo.description}`);
    console.log(`❓ Question: "${demo.question}"`);
    
    // Generate chain of thought prompt
    const promptAnalysis = engine.generatePrompt(demo.question, { 
      promptType: demo.type,
      reasoningDepth: 'moderate'
    });
    
    console.log(`🧠 Reasoning Type: ${promptAnalysis.analysisType}`);
    console.log(`🎓 Confidence: ${(promptAnalysis.confidence * 100).toFixed(1)}%`);
    console.log(`🔍 Approach: Chain of thought with step-by-step reasoning`);
    
    console.log("\n🧠 AI Response with Chain of Thought:");
    console.log("-".repeat(40));
    
    try {
      const response = await chatWithAI(demo.question, { 
        promptingStrategy: 'chain-of-thought',
        promptType: demo.type,
        reasoningDepth: 'moderate'
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
  console.log("🔧 Task-Specific Chain of Thought Demo");
  console.log("=".repeat(50));
  console.log("\nTask-specific chain of thought adapts reasoning approach");
  console.log("based on the type of cognitive task being performed.\n");

  const engine = new ChainOfThoughtPromptEngine();

  for (let i = 0; i < taskDemoQuestions.length; i++) {
    const demo = taskDemoQuestions[i];
    
    console.log(`\n📋 Task Demo ${i + 1}: ${demo.description}`);
    console.log(`❓ Question: "${demo.question}"`);
    console.log(`🔧 Task Type: ${demo.task}`);
    
    // Generate task-specific chain of thought prompt
    const taskPrompt = engine.generateTaskSpecificPrompt(demo.task, demo.question, {
      reasoningDepth: 'moderate'
    });
    
    console.log(`🧠 Analysis Type: ${taskPrompt.analysisType}`);
    console.log(`🎓 Confidence: ${(taskPrompt.confidence * 100).toFixed(1)}%`);
    console.log(`🔍 Reasoning Focus: ${demo.task} with systematic thinking`);
    
    console.log("\n🧠 AI Response with Task-Specific Reasoning:");
    console.log("-".repeat(40));
    
    try {
      const response = await chatWithAI(taskPrompt.enhancedUserMessage, { 
        promptingStrategy: 'chain-of-thought',
        reasoningDepth: 'moderate'
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

async function runReasoningDepthDemo() {
  console.log("🔍 Reasoning Depth Levels Demo");
  console.log("=".repeat(50));
  console.log("\nDemonstrating different levels of reasoning depth:");
  console.log("shallow, moderate, and deep reasoning approaches.\n");

  const testQuestion = "Why is biodiversity important for ecosystems?";
  const depths = ['shallow', 'moderate', 'deep'];

  console.log(`❓ Test Question: "${testQuestion}"\n`);

  for (const depth of depths) {
    console.log(`🔍 ${depth.toUpperCase()} REASONING:`);
    console.log("-".repeat(30));
    
    try {
      const response = await chatWithAI(testQuestion, { 
        promptingStrategy: 'chain-of-thought',
        promptType: 'science',
        reasoningDepth: depth
      });
      
      // Show abbreviated response for comparison
      const preview = response.length > 400 ? response.substring(0, 400) + "..." : response;
      console.log(preview);
      console.log();
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("📊 DEPTH COMPARISON SUMMARY:");
  console.log("• Shallow: Brief reasoning focusing on key points");
  console.log("• Moderate: Balanced reasoning with clear explanations");
  console.log("• Deep: Comprehensive reasoning with multiple perspectives");
}

async function runComparisonDemo() {
  console.log("⚖️  Prompting Strategy Comparison with Chain of Thought");
  console.log("=".repeat(50));
  console.log("\nComparing standard prompting vs chain of thought prompting");
  console.log("to show the difference in reasoning transparency.\n");

  const testQuestion = "How does photosynthesis benefit both plants and animals?";
  const promptType = "science";

  console.log(`❓ Test Question: "${testQuestion}"`);
  console.log(`🎯 Prompt Type: ${promptType}\n`);

  // Standard prompting
  console.log("🔹 STANDARD PROMPTING (No explicit reasoning)");
  console.log("-".repeat(30));
  try {
    const standardResponse = await chatWithAI(testQuestion, { 
      promptType: promptType
    });
    console.log(standardResponse.substring(0, 300) + "...\n");
  } catch (error) {
    console.error("❌ Standard prompting error:", error.message);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Chain of thought prompting
  console.log("🧠 CHAIN OF THOUGHT PROMPTING (Explicit reasoning)");
  console.log("-".repeat(30));
  try {
    const cotResponse = await chatWithAI(testQuestion, { 
      promptingStrategy: 'chain-of-thought',
      promptType: promptType,
      reasoningDepth: 'moderate'
    });
    console.log(cotResponse.substring(0, 400) + "...\n");
  } catch (error) {
    console.error("❌ Chain of thought error:", error.message);
  }

  console.log("📊 COMPARISON SUMMARY:");
  console.log("• Standard: Direct answer, less transparent reasoning");
  console.log("• Chain of Thought: Shows thinking process, more educational");
  console.log("• Chain of Thought: Better for complex problems and learning");
  console.log("• Chain of Thought: More trustworthy and verifiable responses");
}

async function runInteractiveDemo() {
  console.log("🎮 Interactive Chain of Thought Demo");
  console.log("=".repeat(50));
  console.log("Ask any question and see chain of thought reasoning in action!");
  console.log("Type 'exit' to quit, 'depth <level>' to change reasoning depth.\n");

  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const engine = new ChainOfThoughtPromptEngine();
  let currentDepth = 'moderate';

  const askQuestion = () => {
    rl.question("❓ Your question (or command): ", async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log("👋 Thanks for exploring chain of thought reasoning!");
        rl.close();
        return;
      }

      if (input.toLowerCase().startsWith('depth ')) {
        const newDepth = input.split(' ')[1];
        if (['shallow', 'moderate', 'deep'].includes(newDepth)) {
          currentDepth = newDepth;
          console.log(`🔍 Reasoning depth set to: ${currentDepth}\n`);
        } else {
          console.log("❌ Invalid depth. Use: shallow, moderate, or deep\n");
        }
        askQuestion();
        return;
      }

      if (!input.trim()) {
        console.log("Please enter a question or command.");
        askQuestion();
        return;
      }

      try {
        const analysis = engine.generatePrompt(input, { reasoningDepth: currentDepth });
        
        console.log(`\n🧠 Reasoning Type: ${analysis.analysisType} (${(analysis.confidence * 100).toFixed(1)}% confidence)`);
        console.log(`🔍 Depth: ${currentDepth}\n`);
        
        const response = await chatWithAI(input, { 
          promptingStrategy: 'chain-of-thought',
          reasoningDepth: currentDepth
        });
        
        console.log("🧠 Chain of Thought Response:");
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
  } else if (args.includes('--reasoning-depths')) {
    await runReasoningDepthDemo();
  } else if (args.includes('--interactive')) {
    await runInteractiveDemo();
  } else {
    await runStandardDemo();
  }
}

main().catch(console.error);
