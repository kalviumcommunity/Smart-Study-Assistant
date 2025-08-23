# Token Usage Logging System

## Overview

The Smart Study Assistant now includes comprehensive token usage logging that automatically tracks and displays token consumption for all AI API calls. This helps monitor costs, optimize performance, and understand usage patterns across different prompting strategies.

## Features

### 🔢 Automatic Token Logging
- **Real-time tracking** - Every AI call logs token usage immediately
- **Detailed breakdown** - Shows input tokens, output tokens, and total
- **Cost estimation** - Provides approximate cost based on current Gemini pricing
- **Context awareness** - Tracks which service/strategy used the tokens
- **Session statistics** - Maintains running totals and averages

### 📊 Comprehensive Statistics
- **Total usage** - Cumulative tokens across all calls
- **Per-call averages** - Average tokens per API request
- **Performance metrics** - Tokens per second throughput
- **Cost tracking** - Estimated costs with breakdown
- **Context grouping** - Usage by service (Gemini, RTFC, Judge, etc.)

### 🛠️ Token Management Tools
- **Statistics utility** - Dedicated CLI for token management
- **Export functionality** - Save usage data to JSON files
- **Reset capability** - Clear statistics for new sessions
- **Token estimation** - Estimate tokens for text before sending

## Usage Examples

### Automatic Logging in Action

When you run any AI command, you'll see token usage logged automatically:

```bash
node chain-of-thought.js "What is 2 + 2?"
```

Output includes:
```
🔢 Token Usage (Gemini Service) - Input: 89, Output: 245, Total: 334 tokens (~$0.000081)
   Strategy: chain-of-thought
   Subject: math
```

### Token Statistics Utility

```bash
# Show current session statistics
node token-stats.js summary

# Estimate tokens for text
node token-stats.js estimate "How does photosynthesis work?"

# Export statistics to file
node token-stats.js export my-usage.json

# Reset statistics
node token-stats.js reset
```

### Evaluation Pipeline Tracking

The evaluation system provides comprehensive token tracking:

```bash
node evaluate.js --quick
```

Shows detailed breakdown:
```
============================================================
📊 TOKEN USAGE SUMMARY
============================================================
Total API Calls: 6
Total Tokens: 8,450
  - Input Tokens: 3,200
  - Output Tokens: 5,250
Estimated Cost: $0.0018
Runtime: 45.2 seconds
Average Tokens/Call: 1408.3
Tokens/Second: 187.0

📋 By Context:
  Gemini Service: 3 calls, 4,200 tokens (~$0.0009)
  AI Judge: 3 calls, 4,250 tokens (~$0.0009)
============================================================
```

## Token Logging Details

### What Gets Logged

For each AI API call, the system logs:

1. **Input Tokens** - Tokens in the prompt/system message
2. **Output Tokens** - Tokens in the AI response
3. **Total Tokens** - Sum of input and output
4. **Estimated Cost** - Based on current Gemini pricing
5. **Context Information** - Service, strategy, subject, etc.

### Logging Format

```
🔢 Token Usage (Context) - Input: X, Output: Y, Total: Z tokens (~$cost)
   Additional Context: value
   Strategy: strategy_name
   Subject: subject_area
```

### Cost Estimation

Based on Gemini 2.5 Flash pricing (as of implementation):
- **Input tokens**: $0.075 per 1M tokens
- **Output tokens**: $0.30 per 1M tokens

*Note: Actual costs may vary. Check current Google AI pricing.*

## Integration Points

### Services with Token Logging

1. **Gemini Service** (`src/services/gemini.js`)
   - All prompting strategies (zero-shot, one-shot, multi-shot, chain-of-thought)
   - Legacy basic chat function
   - Enhanced context tracking

2. **RTFC Framework** (`src/frameworks/rtfc.js`)
   - Tool-augmented responses
   - Knowledge retrieval integration
   - Enhanced prompting with context

3. **AI Judge System** (`evaluation/judge.js`)
   - Response evaluation calls
   - Batch evaluation tracking
   - Quality assessment metrics

### CLI Tools with Token Summaries

All CLI tools now show token usage summaries:

- `chain-of-thought.js` - Chain of thought prompting
- `multi-shot.js` - Multi-shot prompting  
- `evaluate.js` - Evaluation pipeline
- `token-stats.js` - Token management utility

## Configuration and Customization

### TokenTracker Class

The core `TokenTracker` class provides:

```javascript
import { TokenTracker, logTokenUsage } from './src/utils/token-tracker.js';

// Create custom tracker
const myTracker = new TokenTracker();

// Log usage
myTracker.logUsage('My Service', usageMetadata, {
  strategy: 'custom',
  context: 'special'
});

// Get statistics
const stats = myTracker.getTotalStats();
```

### Global Tracker

The system uses a global tracker instance:

```javascript
import { globalTokenTracker, printTokenSummary } from './src/utils/token-tracker.js';

// Print summary anytime
printTokenSummary();

// Get current stats
const stats = globalTokenTracker.getTotalStats();
```

## Performance Insights

### Token Usage Patterns

Based on testing, typical token usage:

- **Simple questions**: 50-200 tokens
- **Complex explanations**: 500-1500 tokens  
- **Chain of thought**: 800-2000 tokens
- **Multi-shot prompting**: 1000-2500 tokens
- **Evaluation judging**: 2000-3000 tokens

### Cost Optimization Tips

1. **Choose appropriate strategies** - Zero-shot uses fewer tokens than multi-shot
2. **Optimize prompt length** - Shorter prompts reduce input token costs
3. **Monitor running totals** - Use token summaries to track usage
4. **Use estimation** - Estimate tokens before making calls

### Performance Monitoring

The system tracks:
- **Tokens per second** - API throughput performance
- **Average tokens per call** - Efficiency metrics
- **Cost per session** - Budget tracking
- **Usage by context** - Service-specific analysis

## Troubleshooting

### Common Issues

**Token information not available:**
```
🔢 Token Usage (Context) - Information not available from API response
```
- This can happen if the API response doesn't include usage metadata
- The system continues to work normally
- Consider updating the API client if this persists

**High token usage:**
- Review prompt templates for unnecessary verbosity
- Consider using shorter examples in multi-shot prompting
- Monitor chain-of-thought depth settings

**Cost concerns:**
- Use the token estimation utility before making calls
- Export usage statistics for analysis
- Set up monitoring alerts for high usage

### Debugging

Enable detailed logging by checking:
1. API response structure for usage metadata
2. Token tracker initialization
3. Context information accuracy

## Future Enhancements

Potential improvements:
- **Rate limiting** based on token budgets
- **Usage alerts** when thresholds are exceeded
- **Historical tracking** across sessions
- **Advanced analytics** and reporting
- **Integration with billing APIs** for real costs

## Best Practices

1. **Monitor regularly** - Check token summaries after evaluation runs
2. **Export data** - Save usage statistics for analysis
3. **Optimize prompts** - Use estimation to refine prompts
4. **Track by context** - Understand which services use most tokens
5. **Set budgets** - Use statistics to plan API usage

The token logging system provides complete visibility into AI API usage, helping you optimize costs and performance while maintaining high-quality responses across all prompting strategies.
