#!/usr/bin/env node
/**
 * Evaluation CLI Tool for Smart Study Assistant
 * Command-line interface for running evaluations with different configurations
 */

import { EvaluationTestRunner } from "./evaluation/test-runner.js";
import { AIJudge } from "./evaluation/judge.js";
import { printTokenSummary } from "./src/utils/token-tracker.js";
import fs from 'fs/promises';
import dotenv from "dotenv";

dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);

// Parse command line options
let strategies = null;
let testCases = null;
let outputDir = './evaluation/results';
let maxConcurrent = 1;
let reasoningDepth = 'moderate';
let maxExamples = 3;
let loadResults = null;
let quick = false;

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--strategies' && i + 1 < args.length) {
    strategies = args[i + 1].split(',');
    i++; // Skip next argument
  } else if (args[i] === '--test-cases' && i + 1 < args.length) {
    testCases = args[i + 1].split(',');
    i++; // Skip next argument
  } else if (args[i] === '--output-dir' && i + 1 < args.length) {
    outputDir = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--concurrent' && i + 1 < args.length) {
    maxConcurrent = parseInt(args[i + 1]);
    i++; // Skip next argument
  } else if (args[i] === '--reasoning-depth' && i + 1 < args.length) {
    reasoningDepth = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--max-examples' && i + 1 < args.length) {
    maxExamples = parseInt(args[i + 1]);
    i++; // Skip next argument
  } else if (args[i] === '--load-results' && i + 1 < args.length) {
    loadResults = args[i + 1];
    i++; // Skip next argument
  } else if (args[i] === '--quick') {
    quick = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    showHelp();
    process.exit(0);
  } else if (args[i] === '--list-tests') {
    await listTests();
    process.exit(0);
  } else if (args[i] === '--analyze' && i + 1 < args.length) {
    await analyzeResults(args[i + 1]);
    process.exit(0);
  }
}

function showHelp() {
  console.log("🧪 Smart Study Assistant - Evaluation Tool");
  console.log("\nUsage: node evaluate.js [options]");
  console.log("\nOptions:");
  console.log("  --strategies <list>         Comma-separated list of strategies to test");
  console.log("                              (zero-shot,one-shot,multi-shot,chain-of-thought)");
  console.log("  --test-cases <list>         Comma-separated list of test case IDs to run");
  console.log("  --output-dir <path>         Directory to save results (default: ./evaluation/results)");
  console.log("  --concurrent <num>          Number of concurrent tests (default: 1)");
  console.log("  --reasoning-depth <depth>   Chain of thought depth (shallow,moderate,deep)");
  console.log("  --max-examples <num>        Max examples for multi-shot (default: 3)");
  console.log("  --load-results <file>       Load and analyze previous results");
  console.log("  --quick                     Run quick evaluation (subset of tests)");
  console.log("  --list-tests                List all available test cases");
  console.log("  --analyze <file>            Analyze results from a specific file");
  console.log("  --help, -h                  Show this help message");
  console.log("\nExamples:");
  console.log("  node evaluate.js                                    # Run all tests with all strategies");
  console.log("  node evaluate.js --strategies zero-shot,multi-shot  # Test specific strategies");
  console.log("  node evaluate.js --test-cases math_001,science_001  # Test specific cases");
  console.log("  node evaluate.js --quick                            # Quick evaluation");
  console.log("  node evaluate.js --concurrent 2                     # Run 2 tests concurrently");
  console.log("  node evaluate.js --analyze results.json             # Analyze previous results");
  console.log("\nEvaluation Process:");
  console.log("  1. Loads test dataset with expected answers");
  console.log("  2. Runs each test case with specified strategies");
  console.log("  3. Uses AI judge to evaluate responses");
  console.log("  4. Generates comprehensive evaluation report");
  console.log("  5. Saves results for future analysis");
}

async function listTests() {
  try {
    const runner = new EvaluationTestRunner();
    const dataset = await runner.loadDataset();
    
    console.log("📚 Available Test Cases:");
    console.log("=".repeat(50));
    
    dataset.test_cases.forEach(testCase => {
      console.log(`\n🔹 ${testCase.id}`);
      console.log(`   Subject: ${testCase.subject}`);
      console.log(`   Difficulty: ${testCase.difficulty}`);
      console.log(`   Question: "${testCase.question}"`);
      console.log(`   Tags: ${testCase.tags.join(', ')}`);
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`Total test cases: ${dataset.test_cases.length}`);
    
    const bySubject = {};
    dataset.test_cases.forEach(tc => {
      bySubject[tc.subject] = (bySubject[tc.subject] || 0) + 1;
    });
    
    console.log(`By subject:`);
    Object.entries(bySubject).forEach(([subject, count]) => {
      console.log(`  ${subject}: ${count} tests`);
    });
    
  } catch (error) {
    console.error("❌ Error listing tests:", error.message);
  }
}

async function analyzeResults(filepath) {
  try {
    console.log(`📊 Analyzing results from: ${filepath}`);
    
    const runner = new EvaluationTestRunner();
    const results = await runner.loadResults(filepath);
    
    if (results.aggregate_stats) {
      // This is an evaluation report
      runner.printSummaryReport(results);
    } else if (Array.isArray(results)) {
      // This is raw test results, need to evaluate
      console.log("Raw test results detected, running evaluation...");
      const evaluationReport = await runner.evaluateResults(results);
      runner.printSummaryReport(evaluationReport);
    } else {
      console.log("Unknown results format");
    }
    
  } catch (error) {
    console.error("❌ Error analyzing results:", error.message);
  }
}

async function runQuickEvaluation() {
  console.log("⚡ Running quick evaluation...");
  
  // Quick evaluation uses subset of tests and strategies
  const quickStrategies = ['zero-shot', 'chain-of-thought'];
  const quickTestCases = ['math_001', 'science_001', 'programming_001'];
  
  return {
    strategies: quickStrategies,
    testCaseIds: quickTestCases,
    maxConcurrent: 2,
    reasoningDepth: 'moderate',
    maxExamples: 2
  };
}

async function main() {
  try {
    console.log("🧪 Smart Study Assistant - Evaluation Tool");
    console.log("=".repeat(50));
    
    // Handle special commands
    if (loadResults) {
      await analyzeResults(loadResults);
      return;
    }
    
    // Create test runner
    const runner = new EvaluationTestRunner();
    
    // Prepare options
    let options = {
      strategies: strategies || ['zero-shot', 'one-shot', 'multi-shot', 'chain-of-thought'],
      testCaseIds: testCases,
      maxConcurrent,
      outputDir,
      reasoningDepth,
      maxExamples,
      saveResults: true
    };
    
    // Override with quick options if requested
    if (quick) {
      const quickOptions = await runQuickEvaluation();
      options = { ...options, ...quickOptions };
    }
    
    console.log("\n📋 Evaluation Configuration:");
    console.log(`Strategies: ${options.strategies.join(', ')}`);
    console.log(`Test Cases: ${options.testCaseIds ? options.testCaseIds.join(', ') : 'All'}`);
    console.log(`Max Concurrent: ${options.maxConcurrent}`);
    console.log(`Output Directory: ${options.outputDir}`);
    console.log(`Reasoning Depth: ${options.reasoningDepth}`);
    console.log(`Max Examples: ${options.maxExamples}`);
    
    // Confirm before running (unless quick mode)
    if (!quick) {
      console.log("\n⚠️  This will run multiple AI requests and may take significant time.");
      console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log("\n🚀 Starting evaluation...");
    
    // Run complete evaluation
    const { testResults, evaluationReport } = await runner.runCompleteEvaluation(options);
    
    console.log("\n✅ Evaluation completed successfully!");
    console.log(`📊 Check the results in: ${options.outputDir}`);

    // Show quick stats
    const stats = evaluationReport.aggregate_stats;
    if (stats && stats.average_scores) {
      console.log(`\n🎯 Quick Summary:`);
      console.log(`Overall Score: ${stats.average_scores.overall.toFixed(2)}/10`);
      console.log(`Best Strategy: ${Object.entries(stats.by_strategy)
        .sort((a, b) => b[1].average_score - a[1].average_score)[0][0]}`);
      console.log(`Tests Completed: ${evaluationReport.metadata.evaluated_tests}/${evaluationReport.metadata.total_tests}`);
    }

    // Print token usage summary
    printTokenSummary();
    
  } catch (error) {
    console.error("\n❌ Evaluation failed:", error.message);
    
    if (error.message.includes("API key") || error.message.includes("authentication")) {
      console.log("💡 Make sure your GEMINI_API_KEY is set in the .env file");
    }
    
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Evaluation interrupted by user');
  console.log('Partial results may be saved in the output directory');
  process.exit(0);
});

// Run main function
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
