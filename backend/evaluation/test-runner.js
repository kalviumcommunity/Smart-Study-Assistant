/**
 * Testing Framework for Smart Study Assistant
 * Runs evaluation tests across all prompting strategies
 */

import fs from 'fs/promises';
import path from 'path';
import { chatWithAI, chatWithAIOneShot, chatWithAIMultiShot, chatWithAIChainOfThought } from "../src/services/gemini.js";
import { AIJudge } from "./judge.js";
import dotenv from "dotenv";

dotenv.config();

export class EvaluationTestRunner {
  constructor() {
    this.judge = new AIJudge();
    this.strategies = {
      'zero-shot': chatWithAI,
      'one-shot': chatWithAIOneShot,
      'multi-shot': chatWithAIMultiShot,
      'chain-of-thought': chatWithAIChainOfThought
    };
    this.results = [];
  }

  /**
   * Load test dataset from JSON file
   */
  async loadDataset(datasetPath = './evaluation/dataset.json') {
    try {
      const datasetContent = await fs.readFile(datasetPath, 'utf-8');
      return JSON.parse(datasetContent);
    } catch (error) {
      throw new Error(`Failed to load dataset: ${error.message}`);
    }
  }

  /**
   * Run a single test case with a specific strategy
   */
  async runSingleTest(testCase, strategy, options = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`Running ${testCase.id} with ${strategy} strategy...`);
      
      // Get the appropriate chat function
      const chatFunction = this.strategies[strategy];
      if (!chatFunction) {
        throw new Error(`Unknown strategy: ${strategy}`);
      }

      // Prepare options for the strategy
      const strategyOptions = {
        promptType: testCase.subject,
        level: testCase.difficulty,
        ...options
      };

      // Add strategy-specific options
      if (strategy === 'multi-shot') {
        strategyOptions.maxExamples = options.maxExamples || 3;
      } else if (strategy === 'chain-of-thought') {
        strategyOptions.reasoningDepth = options.reasoningDepth || 'moderate';
      }

      // Get model response
      const modelResponse = await chatFunction(testCase.question, strategyOptions);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        testCase,
        strategy,
        modelResponse,
        responseTime,
        timestamp: new Date().toISOString(),
        success: true
      };

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      console.error(`Error running ${testCase.id} with ${strategy}:`, error.message);
      
      return {
        testCase,
        strategy,
        modelResponse: null,
        responseTime,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Run all test cases with all strategies
   */
  async runAllTests(options = {}) {
    const {
      strategies = Object.keys(this.strategies),
      testCaseIds = null, // null means all test cases
      maxConcurrent = 1, // Number of concurrent tests
      saveResults = true,
      outputDir = './evaluation/results'
    } = options;

    console.log("🧪 Starting evaluation test run...");
    console.log(`Strategies: ${strategies.join(', ')}`);
    
    // Load dataset
    const dataset = await this.loadDataset();
    let testCases = dataset.test_cases;
    
    // Filter test cases if specified
    if (testCaseIds) {
      testCases = testCases.filter(tc => testCaseIds.includes(tc.id));
    }
    
    console.log(`Test cases: ${testCases.length}`);
    console.log(`Total tests to run: ${testCases.length * strategies.length}`);

    const allResults = [];
    const startTime = Date.now();

    // Run tests for each strategy
    for (const strategy of strategies) {
      console.log(`\n📋 Running ${strategy} strategy tests...`);
      
      const strategyResults = [];
      
      // Run tests in batches to avoid overwhelming the API
      for (let i = 0; i < testCases.length; i += maxConcurrent) {
        const batch = testCases.slice(i, i + maxConcurrent);
        
        const batchPromises = batch.map(testCase => 
          this.runSingleTest(testCase, strategy, options)
        );
        
        const batchResults = await Promise.all(batchPromises);
        strategyResults.push(...batchResults);
        
        // Small delay between batches
        if (i + maxConcurrent < testCases.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      allResults.push(...strategyResults);
      
      const successCount = strategyResults.filter(r => r.success).length;
      console.log(`${strategy}: ${successCount}/${strategyResults.length} tests successful`);
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(`\n✅ Test run completed in ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`Total tests: ${allResults.length}`);
    console.log(`Successful: ${allResults.filter(r => r.success).length}`);
    console.log(`Failed: ${allResults.filter(r => !r.success).length}`);

    // Save results if requested
    if (saveResults) {
      await this.saveResults(allResults, outputDir, 'test-results');
    }

    this.results = allResults;
    return allResults;
  }

  /**
   * Evaluate all test results using AI judge
   */
  async evaluateResults(testResults = null, options = {}) {
    const results = testResults || this.results;
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      throw new Error("No successful test results to evaluate");
    }

    console.log(`\n🤖 Starting AI judge evaluation of ${successfulResults.length} results...`);

    const evaluations = [];
    
    for (const result of successfulResults) {
      try {
        console.log(`Evaluating ${result.testCase.id} (${result.strategy})...`);
        
        const evaluation = await this.judge.evaluateResponse(
          result.testCase,
          result.modelResponse,
          result.strategy
        );
        
        // Add test result metadata
        evaluation.test_metadata = {
          response_time: result.responseTime,
          timestamp: result.timestamp
        };
        
        evaluations.push(evaluation);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`Failed to evaluate ${result.testCase.id}:`, error.message);
      }
    }

    console.log(`✅ Completed ${evaluations.length} evaluations`);

    // Calculate aggregate statistics
    const stats = this.judge.calculateAggregateStats(evaluations);

    const evaluationReport = {
      metadata: {
        timestamp: new Date().toISOString(),
        total_tests: results.length,
        successful_tests: successfulResults.length,
        evaluated_tests: evaluations.length,
        evaluation_version: "1.0"
      },
      aggregate_stats: stats,
      individual_evaluations: evaluations
    };

    // Save evaluation results
    if (options.saveResults !== false) {
      await this.saveResults(evaluationReport, options.outputDir || './evaluation/results', 'evaluation-report');
    }

    return evaluationReport;
  }

  /**
   * Run complete evaluation pipeline
   */
  async runCompleteEvaluation(options = {}) {
    console.log("🚀 Starting complete evaluation pipeline...\n");
    
    // Step 1: Run all tests
    const testResults = await this.runAllTests(options);
    
    // Step 2: Evaluate results with AI judge
    const evaluationReport = await this.evaluateResults(testResults, options);
    
    // Step 3: Generate summary report
    this.printSummaryReport(evaluationReport);
    
    return {
      testResults,
      evaluationReport
    };
  }

  /**
   * Print summary report to console
   */
  printSummaryReport(evaluationReport) {
    const { aggregate_stats, metadata } = evaluationReport;
    
    console.log("\n" + "=".repeat(60));
    console.log("📊 EVALUATION SUMMARY REPORT");
    console.log("=".repeat(60));
    
    console.log(`\n📈 OVERALL STATISTICS:`);
    console.log(`Total Tests: ${metadata.total_tests}`);
    console.log(`Successful Tests: ${metadata.successful_tests}`);
    console.log(`Evaluated Tests: ${metadata.evaluated_tests}`);
    console.log(`Error Rate: ${(aggregate_stats.error_rate * 100).toFixed(1)}%`);
    
    if (aggregate_stats.average_scores) {
      console.log(`\n🎯 AVERAGE SCORES (1-10 scale):`);
      console.log(`Overall: ${aggregate_stats.average_scores.overall.toFixed(2)}`);
      console.log(`Accuracy: ${aggregate_stats.average_scores.accuracy.toFixed(2)}`);
      console.log(`Completeness: ${aggregate_stats.average_scores.completeness.toFixed(2)}`);
      console.log(`Clarity: ${aggregate_stats.average_scores.clarity.toFixed(2)}`);
      console.log(`Methodology: ${aggregate_stats.average_scores.methodology.toFixed(2)}`);
      console.log(`Educational Value: ${aggregate_stats.average_scores.educational_value.toFixed(2)}`);
    }
    
    console.log(`\n📊 GRADE DISTRIBUTION:`);
    Object.entries(aggregate_stats.grade_distribution).forEach(([grade, count]) => {
      console.log(`${grade}: ${count} tests`);
    });
    
    console.log(`\n📋 BY STRATEGY:`);
    Object.entries(aggregate_stats.by_strategy).forEach(([strategy, data]) => {
      console.log(`${strategy}: ${data.average_score.toFixed(2)} avg (${data.count} tests)`);
    });
    
    console.log(`\n📚 BY SUBJECT:`);
    Object.entries(aggregate_stats.by_subject).forEach(([subject, data]) => {
      console.log(`${subject}: ${data.average_score.toFixed(2)} avg (${data.count} tests)`);
    });
    
    if (aggregate_stats.common_strengths.length > 0) {
      console.log(`\n✅ COMMON STRENGTHS:`);
      aggregate_stats.common_strengths.forEach(({ element, count }) => {
        console.log(`- ${element} (${count} times)`);
      });
    }
    
    if (aggregate_stats.common_weaknesses.length > 0) {
      console.log(`\n❌ COMMON WEAKNESSES:`);
      aggregate_stats.common_weaknesses.forEach(({ element, count }) => {
        console.log(`- ${element} (${count} times)`);
      });
    }
    
    console.log("\n" + "=".repeat(60));
  }

  /**
   * Save results to JSON file
   */
  async saveResults(data, outputDir, filename) {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fullFilename = `${filename}-${timestamp}.json`;
      const filepath = path.join(outputDir, fullFilename);
      
      // Save data
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      console.log(`💾 Results saved to: ${filepath}`);
      
      return filepath;
    } catch (error) {
      console.error(`Failed to save results: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load previous results from file
   */
  async loadResults(filepath) {
    try {
      const content = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load results: ${error.message}`);
    }
  }
}

export default EvaluationTestRunner;
