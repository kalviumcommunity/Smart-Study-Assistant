#!/usr/bin/env node
/**
 * Token Statistics Utility
 * Shows current token usage statistics and provides token management commands
 */

import { globalTokenTracker, printTokenSummary, getTokenStats } from "./src/utils/token-tracker.js";
import fs from 'fs/promises';
import path from 'path';

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log("🔢 Token Statistics Utility");
  console.log("\nUsage: node token-stats.js [command]");
  console.log("\nCommands:");
  console.log("  summary, stats    Show current token usage summary");
  console.log("  reset            Reset token usage statistics");
  console.log("  export [file]    Export token statistics to JSON file");
  console.log("  estimate <text>  Estimate token count for given text");
  console.log("  help, -h         Show this help message");
  console.log("\nExamples:");
  console.log("  node token-stats.js summary");
  console.log("  node token-stats.js export token-usage.json");
  console.log("  node token-stats.js estimate \"How does photosynthesis work?\"");
  console.log("\nNote: This utility shows statistics from the current session.");
  console.log("Token usage is automatically logged during AI calls.");
}

function estimateTokenCount(text) {
  // Simple token estimation (rough approximation)
  // Real tokenization would require the actual tokenizer
  const words = text.split(/\s+/).length;
  const characters = text.length;
  
  // Rough estimates based on common patterns:
  // - Average ~4 characters per token for English text
  // - But can vary significantly based on content
  const estimatedTokens = Math.ceil(characters / 4);
  const wordBasedEstimate = Math.ceil(words * 1.3); // Words * 1.3 is often close
  
  console.log("📊 Token Count Estimation");
  console.log("=".repeat(40));
  console.log(`Text: "${text}"`);
  console.log(`Characters: ${characters}`);
  console.log(`Words: ${words}`);
  console.log(`Estimated Tokens (char-based): ~${estimatedTokens}`);
  console.log(`Estimated Tokens (word-based): ~${wordBasedEstimate}`);
  console.log(`Range: ${Math.min(estimatedTokens, wordBasedEstimate)}-${Math.max(estimatedTokens, wordBasedEstimate)} tokens`);
  console.log("\n⚠️  Note: This is a rough estimate. Actual token count may vary.");
  console.log("Real tokenization depends on the specific model's tokenizer.");
}

async function exportStats(filename) {
  try {
    const stats = globalTokenTracker.exportStats();
    const outputPath = filename || `token-stats-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    await fs.writeFile(outputPath, JSON.stringify(stats, null, 2));
    console.log(`📁 Token statistics exported to: ${outputPath}`);
    
    // Also show summary
    console.log("\n📊 Exported Statistics:");
    console.log(`Total Calls: ${stats.totalUsage.calls}`);
    console.log(`Total Tokens: ${stats.totalUsage.totalTokens.toLocaleString()}`);
    console.log(`Estimated Cost: $${stats.totalUsage.estimatedCost.toFixed(4)}`);
    console.log(`Runtime: ${stats.totalUsage.runtime.toFixed(1)} seconds`);
    
  } catch (error) {
    console.error("❌ Error exporting statistics:", error.message);
  }
}

function resetStats() {
  globalTokenTracker.reset();
  console.log("🔄 Token usage statistics have been reset.");
  console.log("New statistics will be tracked from this point forward.");
}

function showCurrentStats() {
  const stats = getTokenStats();
  
  if (stats.calls === 0) {
    console.log("📊 No token usage recorded in current session.");
    console.log("Token usage will be automatically tracked when you make AI calls.");
    console.log("\nTry running:");
    console.log("  node chain-of-thought.js \"What is 2+2?\"");
    console.log("  node multi-shot.js \"Explain photosynthesis\"");
    console.log("  node evaluate.js --quick");
    return;
  }
  
  printTokenSummary();
  
  // Additional insights
  console.log("\n💡 Insights:");
  if (stats.estimatedCost > 0.01) {
    console.log(`⚠️  High usage detected: $${stats.estimatedCost.toFixed(4)} estimated cost`);
  } else if (stats.estimatedCost > 0.001) {
    console.log(`📊 Moderate usage: $${stats.estimatedCost.toFixed(4)} estimated cost`);
  } else {
    console.log(`✅ Low usage: $${stats.estimatedCost.toFixed(6)} estimated cost`);
  }
  
  if (stats.averageTokensPerCall > 2000) {
    console.log("📝 High average tokens per call - consider optimizing prompts");
  } else if (stats.averageTokensPerCall > 1000) {
    console.log("📝 Moderate token usage per call");
  } else {
    console.log("📝 Efficient token usage per call");
  }
  
  if (stats.tokensPerSecond > 200) {
    console.log("⚡ High throughput - good API performance");
  } else if (stats.tokensPerSecond > 100) {
    console.log("⚡ Moderate throughput");
  } else if (stats.calls > 0) {
    console.log("⚡ Lower throughput - may indicate network or processing delays");
  }
}

// Main execution
async function main() {
  switch (command) {
    case 'help':
    case '-h':
    case undefined:
      showHelp();
      break;
      
    case 'summary':
    case 'stats':
      showCurrentStats();
      break;
      
    case 'reset':
      resetStats();
      break;
      
    case 'export':
      await exportStats(args[1]);
      break;
      
    case 'estimate':
      if (args[1]) {
        estimateTokenCount(args.slice(1).join(' '));
      } else {
        console.log("❌ Please provide text to estimate tokens for.");
        console.log("Example: node token-stats.js estimate \"Your text here\"");
      }
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log("Use 'node token-stats.js help' for available commands.");
      break;
  }
}

main().catch(error => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
