# Multi-Shot Prompting Implementation

## Overview

This Smart Study Assistant now includes a comprehensive **Multi-Shot Prompting** system that provides AI with multiple examples (2-5) to guide response format and approach. This technique produces the most consistent and well-structured responses compared to zero-shot and one-shot prompting.

## What is Multi-Shot Prompting?

Multi-shot prompting is an advanced technique where the AI is provided with multiple examples (typically 2-5) of the desired input-output format before being asked to respond to a new query. The system:

1. **Analyzes** the user's question to determine the subject area and intent
2. **Selects** multiple appropriate examples from the template library
3. **Presents** the examples to guide the AI's response format and style
4. **Generates** responses that follow the demonstrated patterns with high consistency

## Key Differences from Other Prompting Strategies

| Aspect | Zero-Shot | One-Shot | Multi-Shot |
|--------|-----------|----------|------------|
| **Examples** | None provided | One example provided | Multiple examples (2-5) |
| **Consistency** | Variable format | Good consistency | Excellent consistency |
| **Response Quality** | Basic structure | Well-structured | Highly structured |
| **Pattern Recognition** | Instruction-based | Single pattern | Multiple patterns |
| **Learning Depth** | Surface level | Good understanding | Deep understanding |
| **Response Length** | Often shorter | Usually detailed | Comprehensive and detailed |

## Features

### 🎯 Subject-Specific Multiple Examples
Each subject area has carefully crafted multiple examples:

- **Mathematics** - 3 examples covering different problem types (linear equations, geometry, quadratics)
- **Science** - 2 examples showing different scientific processes (photosynthesis, earthquakes)
- **History** - 2 examples demonstrating historical analysis (WWI causes, Roman Empire fall)
- **Programming** - 2 examples with different coding approaches (string reversal, API usage)
- **Language** - Examples showing grammar rules and usage patterns
- **Creative** - Multiple creative approaches and techniques

### 📋 Task-Specific Multiple Examples
Specialized examples for different task types:
- `explanation` - 2 examples showing different explanation styles
- `problem_solving` - Multiple problem-solving approaches
- `analysis` - Various analytical frameworks
- `comparison` - Different comparison structures
- `summary` - Multiple summary formats
- `tutorial` - Step-by-step guide variations

### 🎓 Configurable Example Count
- **Default**: 3 examples for subject-specific prompts
- **Task-specific**: 2 examples for task-specific prompts
- **Customizable**: Use `--max-examples` to set 1-5 examples
- **Adaptive**: System selects optimal number based on available examples

### 🔄 Enhanced Pattern Recognition
Multiple examples help AI understand:
- **Format variations** - Different ways to structure responses
- **Style consistency** - Maintaining tone and approach
- **Content depth** - Appropriate level of detail
- **Structural patterns** - How to organize information

## Usage

### Command Line Interface

#### Basic Usage
```bash
# Automatic detection with multi-shot prompting
node multi-shot.js "What is photosynthesis?"

# Force specific subject type
node multi-shot.js --type math "Solve 4x - 7 = 21"

# Set difficulty level
node multi-shot.js --level beginner "Explain quantum mechanics"

# Use task-specific prompting
node multi-shot.js --task problem_solving "How do I fix a slow computer?"

# Control number of examples
node multi-shot.js --max-examples 2 "What is DNA?"

# Show the examples being used
node multi-shot.js --show-examples "What causes earthquakes?"
```

#### Advanced Usage
```bash
# Combine multiple options
node multi-shot.js --type science --level intermediate --max-examples 3 --show-examples "Explain photosynthesis"

# Task-specific with custom example count
node multi-shot.js --task explanation --max-examples 2 "How does machine learning work?"

# Compare with other strategies
node demo-multi-shot.js --comparison
```

#### Available Commands
```bash
# Show help
node multi-shot.js --help

# Show available types and options
node multi-shot.js --types

# Show example questions for each type
node multi-shot.js --examples

# Run demonstration
node demo-multi-shot.js

# Compare zero-shot vs one-shot vs multi-shot
node demo-multi-shot.js --comparison

# Run task-specific demo
node demo-multi-shot.js --task-demo

# Interactive demo mode
node demo-multi-shot.js --interactive
```

### API Endpoints

#### Standard Chat with Multi-Shot
```http
POST /chat
Content-Type: application/json

{
  "message": "Solve 3x + 8 = 23",
  "options": {
    "promptType": "math",
    "promptingStrategy": "multi-shot",
    "maxExamples": 3
  }
}
```

#### Dedicated Multi-Shot Endpoint
```http
POST /chat/multi-shot
Content-Type: application/json

{
  "message": "What causes earthquakes?",
  "promptType": "science",
  "level": "intermediate",
  "maxExamples": 2,
  "showExamples": true
}
```

#### Compare All Strategies
```http
POST /chat/compare
Content-Type: application/json

{
  "message": "Explain machine learning",
  "promptType": "programming",
  "level": "intermediate"
}
```

Response includes zero-shot, one-shot, and multi-shot responses for comparison.

## Examples

### Mathematics Example
**Input:** "Solve the equation 4x - 7 = 21"

**Multi-Shot Templates Used:**
1. Linear equation solving with verification
2. Geometry area calculation with formulas
3. Quadratic equation factoring with multiple methods

**Result:** Comprehensive step-by-step solution following demonstrated patterns with verification and clear formatting.

### Science Example
**Input:** "How does photosynthesis work?"

**Multi-Shot Templates Used:**
1. Photosynthesis process with chemical equations
2. Earthquake causes with scientific explanations

**Result:** Detailed explanation with process breakdown, chemical equations, real-world applications, and structured formatting.

### Programming Example
**Input:** "Create a function to find the largest number in an array"

**Multi-Shot Templates Used:**
1. String reversal with multiple approaches
2. API usage with comprehensive examples

**Result:** Multiple solution approaches, code examples, best practices, complexity analysis, and detailed explanations.

## Configuration

### Adding Custom Multi-Shot Templates

```javascript
import { MultiShotPromptEngine } from './src/services/multi-shot-prompting.js';

const engine = new MultiShotPromptEngine();

// Add custom template with multiple examples
engine.addCustomTemplate(
  'biology',
  /(?:cell|dna|gene|protein|organism)/i,
  'You are a biology expert. When explaining biological concepts:',
  [
    {
      question: "How do cells divide?",
      response: "Detailed explanation of mitosis..."
    },
    {
      question: "What is DNA structure?",
      response: "Comprehensive DNA structure explanation..."
    }
  ]
);
```

### Customizing Example Count

```javascript
// Generate prompt with specific number of examples
const promptResult = engine.generatePrompt(userMessage, {
  promptType: 'science',
  maxExamples: 4  // Use 4 examples instead of default 3
});
```

## Technical Implementation

### Architecture Components

- **MultiShotPromptEngine** - Core engine managing multiple examples
- **Template System** - Organized examples by subject and task type
- **Pattern Matching** - Intelligent subject detection
- **Example Selection** - Optimal example count determination
- **API Integration** - Seamless integration with existing endpoints

### Example Management

- **Storage**: Examples stored in structured templates
- **Selection**: Intelligent selection based on question type
- **Formatting**: Consistent formatting across all examples
- **Validation**: Quality assurance for example relevance

## Performance Considerations

### Benefits
- **Higher Quality**: More consistent and comprehensive responses
- **Better Structure**: Well-organized, formatted outputs
- **Enhanced Learning**: AI learns from multiple patterns
- **Improved Accuracy**: Better understanding of expected format

### Trade-offs
- **Token Usage**: Uses more tokens due to multiple examples
- **Response Time**: Slightly longer due to larger prompts
- **Complexity**: More sophisticated prompt engineering required

### Optimization
- **Smart Selection**: Only use necessary number of examples
- **Caching**: Template caching for better performance
- **Adaptive Count**: Adjust example count based on question complexity

## Integration with RTFC Framework

Multi-shot prompting is fully integrated with the RTFC (Retrieval-Augmented Generation with Tool-calling and Function-calling) framework:

- **Enhanced Responses** - RTFC responses use multi-shot prompting for better context
- **Tool Integration** - Multi-shot prompts work with calculator, knowledge search, and other tools
- **Knowledge Base** - Retrieved knowledge is presented using multi-shot formatting patterns

## Testing

Run the demonstration to see multi-shot prompting in action:

```bash
# Full demo with different subject areas
node demo-multi-shot.js

# Task-specific prompting demo  
node demo-multi-shot.js --task-demo

# Compare all three strategies
node demo-multi-shot.js --comparison

# Interactive testing
node demo-multi-shot.js --interactive
```

This will show examples of how the system handles different types of questions and adapts its responses using multiple examples for guidance.

## Best Practices

### When to Use Multi-Shot
- **Complex Topics**: When detailed, structured responses are needed
- **Consistency Required**: When format consistency is important
- **Educational Content**: For teaching and learning scenarios
- **Professional Use**: When high-quality responses are critical

### Example Selection Tips
- **Diversity**: Choose examples showing different aspects
- **Relevance**: Ensure examples match the question domain
- **Quality**: Use high-quality, well-structured examples
- **Balance**: Mix simple and complex examples appropriately

### Performance Optimization
- **Example Count**: Use 2-3 examples for most cases
- **Token Management**: Monitor token usage in production
- **Caching**: Cache frequently used templates
- **Monitoring**: Track response quality and adjust as needed
