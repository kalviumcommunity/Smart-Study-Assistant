#!/usr/bin/env node
import { chatWithAI, chatWithAIDetailed, getAvailableTools } from "./src/services/rtfc-gemini.js";
import dotenv from "dotenv";

dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];
const question = args.slice(1).join(' ');

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in environment variables!");
  console.log("💡 Please add your Gemini API key to the .env file");
  process.exit(1);
}

async function main() {
  try {
    switch (command) {
      case 'ask':
        if (!question.trim()) {
          console.log("🤖 RTFC Smart Study Assistant");
          console.log("Usage: node rtfc.js ask <your question>");
          console.log("Example: node rtfc.js ask What is photosynthesis?");
          console.log("Example: node rtfc.js ask Solve 2x + 5 = 15");
          return;
        }
        
        console.log(`❓ Question: ${question}`);
        console.log("🔄 Processing with RTFC framework...\n");
        
        const answer = await chatWithAI(question);
        console.log("🤖 Enhanced Answer:");
        console.log(answer);
        break;

      case 'detailed':
        if (!question.trim()) {
          console.log("Usage: node rtfc.js detailed <your question>");
          return;
        }
        
        console.log(`❓ Question: ${question}`);
        console.log("🔄 Processing with RTFC framework...\n");
        
        const detailedResult = await chatWithAIDetailed(question);
        console.log("🤖 Enhanced Answer:");
        console.log(detailedResult.response);
        
        console.log("\n📊 Framework Usage:");
        console.log(`🔧 Tools used: ${detailedResult.toolsUsed.length > 0 ? detailedResult.toolsUsed.join(', ') : 'None'}`);
        console.log(`📚 Knowledge retrieved: ${detailedResult.knowledgeUsed ? 'Yes' : 'No'}`);
        if (detailedResult.sources.length > 0) {
          console.log(`📖 Sources: ${detailedResult.sources.map(s => s.topic).join(', ')}`);
        }
        break;

      case 'tools':
        console.log("🔧 Available RTFC Tools:");
        const tools = getAvailableTools();
        tools.forEach(tool => {
          console.log(`  • ${tool}`);
        });
        break;

      case 'help':
        showHelp();
        break;

      default:
        if (command && !['ask', 'detailed', 'tools', 'help'].includes(command)) {
          // Treat as a direct question
          const fullQuestion = [command, ...args.slice(1)].join(' ');
          console.log(`❓ Question: ${fullQuestion}`);
          console.log("🔄 Processing with RTFC framework...\n");
          
          const answer = await chatWithAI(fullQuestion);
          console.log("🤖 Enhanced Answer:");
          console.log(answer);
        } else {
          showHelp();
        }
        break;
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("API key") || error.message.includes("authentication")) {
      console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
    }
  }
}

function showHelp() {
  console.log("🤖 RTFC Smart Study Assistant");
  console.log("Enhanced AI with Retrieval, Tool-calling, and Function-calling");
  console.log("");
  console.log("Commands:");
  console.log("  ask <question>      - Ask a question with RTFC enhancement");
  console.log("  detailed <question> - Get detailed response with framework info");
  console.log("  tools              - List available tools");
  console.log("  help               - Show this help message");
  console.log("");
  console.log("Examples:");
  console.log("  node rtfc.js ask What is photosynthesis?");
  console.log("  node rtfc.js ask Solve 3x + 7 = 22");
  console.log("  node rtfc.js detailed Explain gravity");
  console.log("  node rtfc.js What is DNA?  (direct question)");
  console.log("");
  console.log("Features:");
  console.log("  🔧 Tool calling - Calculator, knowledge search, study helpers");
  console.log("  📚 Knowledge retrieval - Built-in study knowledge base");
  console.log("  🤖 Enhanced responses - Context-aware AI answers");
}

main();
