/**
 * Token Usage Tracker
 * Tracks and logs token usage across all AI calls
 */

export class TokenTracker {
  constructor() {
    this.sessions = new Map();
    this.totalUsage = {
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0
    };
    this.startTime = Date.now();
  }

  /**
   * Log token usage for a specific call
   */
  logUsage(context, usageMetadata, additionalInfo = {}) {
    if (!usageMetadata) {
      console.log(`🔢 Token Usage (${context}) - Information not available from API response`);
      return;
    }

    const { promptTokenCount = 0, candidatesTokenCount = 0, totalTokenCount = 0 } = usageMetadata;
    
    // Update totals
    this.totalUsage.calls++;
    this.totalUsage.inputTokens += promptTokenCount;
    this.totalUsage.outputTokens += candidatesTokenCount;
    this.totalUsage.totalTokens += totalTokenCount;

    // Track by session/context
    if (!this.sessions.has(context)) {
      this.sessions.set(context, {
        calls: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        firstCall: Date.now(),
        lastCall: Date.now()
      });
    }

    const session = this.sessions.get(context);
    session.calls++;
    session.inputTokens += promptTokenCount;
    session.outputTokens += candidatesTokenCount;
    session.totalTokens += totalTokenCount;
    session.lastCall = Date.now();

    // Calculate costs (approximate, based on Gemini pricing)
    const inputCost = (promptTokenCount / 1000000) * 0.075; // $0.075 per 1M input tokens
    const outputCost = (candidatesTokenCount / 1000000) * 0.30; // $0.30 per 1M output tokens
    const totalCost = inputCost + outputCost;

    // Log the usage
    console.log(`🔢 Token Usage (${context}) - Input: ${promptTokenCount}, Output: ${candidatesTokenCount}, Total: ${totalTokenCount} tokens (~$${totalCost.toFixed(6)})`);
    
    // Add additional context if provided
    if (additionalInfo.strategy) {
      console.log(`   Strategy: ${additionalInfo.strategy}`);
    }
    if (additionalInfo.testCase) {
      console.log(`   Test Case: ${additionalInfo.testCase}`);
    }
    if (additionalInfo.subject) {
      console.log(`   Subject: ${additionalInfo.subject}`);
    }

    // Show running totals every 10 calls
    if (this.totalUsage.calls % 10 === 0) {
      this.logRunningTotals();
    }
  }

  /**
   * Log running totals
   */
  logRunningTotals() {
    const totalCost = (this.totalUsage.inputTokens / 1000000) * 0.075 + (this.totalUsage.outputTokens / 1000000) * 0.30;
    const runtime = (Date.now() - this.startTime) / 1000;
    
    console.log(`📊 Running Totals - ${this.totalUsage.calls} calls, ${this.totalUsage.totalTokens} tokens, ~$${totalCost.toFixed(4)} (${runtime.toFixed(1)}s)`);
  }

  /**
   * Get session statistics
   */
  getSessionStats(context) {
    return this.sessions.get(context) || null;
  }

  /**
   * Get total statistics
   */
  getTotalStats() {
    const totalCost = (this.totalUsage.inputTokens / 1000000) * 0.075 + (this.totalUsage.outputTokens / 1000000) * 0.30;
    const runtime = (Date.now() - this.startTime) / 1000;
    
    return {
      ...this.totalUsage,
      estimatedCost: totalCost,
      runtime: runtime,
      averageTokensPerCall: this.totalUsage.calls > 0 ? this.totalUsage.totalTokens / this.totalUsage.calls : 0,
      tokensPerSecond: runtime > 0 ? this.totalUsage.totalTokens / runtime : 0
    };
  }

  /**
   * Print detailed summary
   */
  printSummary() {
    const stats = this.getTotalStats();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TOKEN USAGE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total API Calls: ${stats.calls}`);
    console.log(`Total Tokens: ${stats.totalTokens.toLocaleString()}`);
    console.log(`  - Input Tokens: ${stats.inputTokens.toLocaleString()}`);
    console.log(`  - Output Tokens: ${stats.outputTokens.toLocaleString()}`);
    console.log(`Estimated Cost: $${stats.estimatedCost.toFixed(4)}`);
    console.log(`Runtime: ${stats.runtime.toFixed(1)} seconds`);
    console.log(`Average Tokens/Call: ${stats.averageTokensPerCall.toFixed(1)}`);
    console.log(`Tokens/Second: ${stats.tokensPerSecond.toFixed(1)}`);
    
    if (this.sessions.size > 0) {
      console.log('\n📋 By Context:');
      for (const [context, session] of this.sessions.entries()) {
        const sessionCost = (session.inputTokens / 1000000) * 0.075 + (session.outputTokens / 1000000) * 0.30;
        console.log(`  ${context}: ${session.calls} calls, ${session.totalTokens.toLocaleString()} tokens (~$${sessionCost.toFixed(4)})`);
      }
    }
    
    console.log('='.repeat(60));
  }

  /**
   * Reset all statistics
   */
  reset() {
    this.sessions.clear();
    this.totalUsage = {
      calls: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0
    };
    this.startTime = Date.now();
    console.log('🔄 Token usage statistics reset');
  }

  /**
   * Export statistics to JSON
   */
  exportStats() {
    return {
      totalUsage: this.getTotalStats(),
      sessions: Object.fromEntries(this.sessions),
      timestamp: new Date().toISOString()
    };
  }
}

// Global token tracker instance
export const globalTokenTracker = new TokenTracker();

/**
 * Helper function to log token usage
 */
export function logTokenUsage(context, usageMetadata, additionalInfo = {}) {
  globalTokenTracker.logUsage(context, usageMetadata, additionalInfo);
}

/**
 * Helper function to print summary
 */
export function printTokenSummary() {
  globalTokenTracker.printSummary();
}

/**
 * Helper function to get total stats
 */
export function getTokenStats() {
  return globalTokenTracker.getTotalStats();
}

export default TokenTracker;
