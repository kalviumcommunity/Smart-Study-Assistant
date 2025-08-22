# Zero-Shot Prompting Implementation

## Overview

This Smart Study Assistant now includes a comprehensive **Zero-Shot Prompting** system that intelligently adapts AI responses based on the type of question asked, without requiring specific examples or training data.

## What is Zero-Shot Prompting?

Zero-shot prompting is a technique where the AI can handle various tasks and question types using only the instructions in the prompt, without needing examples. The system automatically:

1. **Analyzes** the user's question to determine the subject area and intent
2. **Selects** the most appropriate prompting strategy 
3. **Generates** specialized system prompts for optimal responses
4. **Enhances** the user's question with context-specific instructions

## Features

### 🎯 Automatic Subject Detection
The system automatically detects and optimizes for:
- **Mathematics** - Step-by-step problem solving with clear calculations
- **Science** - Detailed explanations with examples and real-world applications  
- **History** - Chronological context with causes, effects, and significance
- **Programming** - Code examples with explanations and best practices
- **Language/Literature** - Grammar rules, definitions, and writing techniques
- **General Study** - Adaptive tutoring with learning strategies
- **Creative Tasks** - Inspiration and constructive feedback

### 📋 Task-Specific Prompting
Choose specific task types for targeted responses:
- `explanation` - Clear, thorough concept explanations
- `problem_solving` - Step-by-step problem resolution
- `analysis` - Detailed topic analysis
- `comparison` - Compare and contrast different concepts
- `summary` - Comprehensive summaries
- `tutorial` - Step-by-step guides and tutorials
- `research` - Information gathering and research
- `creative` - Creative writing and brainstorming

### 🎓 Difficulty Levels
Adjust response complexity:
- `beginner` - Simple terms and basic concepts
- `intermediate` - Comprehensive explanations with some technical detail
- `advanced` - Detailed, technical explanations with nuances

## Usage

### Command Line Interface

#### Basic Usage
```bash
# Automatic detection
node zero-shot.js "What is photosynthesis?"

# Force specific subject type
node zero-shot.js --type science "Explain quantum mechanics"

# Set difficulty level
node zero-shot.js --level beginner "How do computers work?"

# Use task-specific prompting
node zero-shot.js --task tutorial "How to solve quadratic equations"

# Combine options
node zero-shot.js --type math --level intermediate --task problem_solving "Find the derivative of x²+3x+2"
```

#### Available Commands
```bash
# Show help
node zero-shot.js --help

# Show available types and options
node zero-shot.js --types

# Run demonstration
node demo-zero-shot.js

# Run task-specific demo
node demo-zero-shot.js --task-demo
```

### API Endpoints

#### Standard Chat with Zero-Shot
```http
POST /chat
Content-Type: application/json

{
  "message": "Solve 2x + 5 = 15",
  "options": {
    "promptType": "math",
    "level": "intermediate"
  }
}
```

#### Advanced Zero-Shot Endpoint
```http
POST /chat/zero-shot
Content-Type: application/json

{
  "message": "Explain machine learning",
  "promptType": "programming",
  "level": "intermediate", 
  "taskType": "explanation"
}
```

#### Analyze Message (No Response)
```http
POST /chat/analyze
Content-Type: application/json

{
  "message": "What causes earthquakes?",
  "promptType": "science"
}
```

#### Get Available Options
```http
GET /chat/types
```

## Examples

### Mathematics Example
**Input:** "Solve the quadratic equation 2x² - 8x + 6 = 0"

**Zero-Shot Enhancement:**
- Detects: Mathematics subject
- Adds: "Please show your work step by step"
- Uses: Math-specific system prompt with calculation focus

**Result:** Step-by-step solution with clear mathematical reasoning

### Science Example  
**Input:** "How does photosynthesis work?"

**Zero-Shot Enhancement:**
- Detects: Science subject
- Uses: Science-specific prompt emphasizing examples and applications
- Includes: Request for real-world connections

**Result:** Detailed explanation with examples and practical applications

### Programming Example
**Input:** "Create a Python function to calculate factorial"

**Zero-Shot Enhancement:**
- Detects: Programming subject
- Adds: "Please explain the logic and include comments"
- Uses: Programming-specific prompt focusing on best practices

**Result:** Code with explanations, comments, and best practices

## Integration with RTFC Framework

The zero-shot prompting system is fully integrated with the existing RTFC (Retrieval-Augmented Generation with Tool-calling and Function-calling) framework:

- **Enhanced Prompts** - RTFC responses use zero-shot prompting for better context
- **Tool Integration** - Zero-shot prompts work with calculator, knowledge search, and other tools
- **Knowledge Base** - Retrieved knowledge is presented using subject-appropriate formatting

## Configuration

### Adding Custom Prompt Types

```javascript
import { ZeroShotPromptEngine } from './src/services/zero-shot-prompting.js';

const engine = new ZeroShotPromptEngine();

// Add custom prompt type
engine.addCustomTemplate(
  'economics',
  /(?:economics|market|supply|demand|inflation|GDP)/i,
  `You are an economics expert. When explaining economic concepts:
  1. Define key economic terms clearly
  2. Use real-world examples and case studies
  3. Explain cause and effect relationships
  4. Include relevant economic principles
  5. Connect to current economic conditions`
);
```

### Environment Setup

Make sure your `.env` file includes:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Benefits

1. **Intelligent Adaptation** - Responses automatically adapt to question type
2. **No Training Required** - Works immediately without examples or fine-tuning  
3. **Consistent Quality** - Maintains high response quality across all subjects
4. **Flexible Control** - Manual override options for specific needs
5. **Educational Focus** - Optimized for learning and understanding
6. **Scalable** - Easy to add new subject areas and task types

## Technical Details

- **Pattern Matching** - Uses regex patterns to detect subject areas
- **Confidence Scoring** - Calculates confidence levels for automatic detection
- **Prompt Templates** - Modular system prompts for different subjects
- **Message Enhancement** - Automatically adds context-specific instructions
- **API Integration** - Seamless integration with existing Gemini API calls

## Testing

Run the demonstration to see zero-shot prompting in action:

```bash
# Full demo with different subject areas
node demo-zero-shot.js

# Task-specific prompting demo  
node demo-zero-shot.js --task-demo
```

This will show examples of how the system handles different types of questions and adapts its responses accordingly.
