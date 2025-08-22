# One-Shot Prompting Implementation

## Overview

This Smart Study Assistant now includes a comprehensive **One-Shot Prompting** system that provides AI with single examples to guide response format and approach. This technique often produces more consistent and structured responses compared to zero-shot prompting.

## What is One-Shot Prompting?

One-shot prompting is a technique where the AI is provided with exactly one example of the desired input-output format before being asked to respond to a new query. The system:

1. **Analyzes** the user's question to determine the subject area and intent
2. **Selects** an appropriate example from the template library
3. **Presents** the example to guide the AI's response format
4. **Generates** responses that follow the demonstrated pattern

## Key Differences from Zero-Shot

| Aspect | Zero-Shot | One-Shot |
|--------|-----------|----------|
| **Examples** | None provided | One example provided |
| **Consistency** | Variable format | More consistent format |
| **Response Length** | Often shorter | Usually more detailed |
| **Structure** | Basic structure | Well-structured following example |
| **Learning** | Instruction-based | Example-based learning |

## Features

### 🎯 Subject-Specific Examples
Each subject area has carefully crafted examples:

- **Mathematics** - Step-by-step problem solving with verification
- **Science** - Structured explanations with definitions, processes, and applications
- **History** - Chronological analysis with causes, events, and significance
- **Programming** - Code examples with explanations and best practices
- **Language** - Clear definitions with examples and usage rules
- **Creative** - Structured creative guidance with techniques and examples

### 📋 Task-Specific Examples
Specialized examples for different task types:
- `explanation` - Comprehensive concept explanations
- `problem_solving` - Systematic problem resolution
- `analysis` - Detailed topic analysis
- `comparison` - Structured comparisons
- `summary` - Organized summaries
- `tutorial` - Step-by-step guides

### 🎓 Adaptive Difficulty
Examples can be adjusted for different skill levels while maintaining the demonstrated structure.

## Usage

### Command Line Interface

#### Basic Usage
```bash
# Automatic detection with one-shot prompting
node one-shot.js "What is photosynthesis?"

# Force specific subject type
node one-shot.js --type math "Solve 4x - 7 = 21"

# Set difficulty level
node one-shot.js --level beginner "Explain quantum mechanics"

# Use task-specific prompting
node one-shot.js --task problem_solving "How do I fix a slow computer?"

# Show the example being used
node one-shot.js --show-example "What is DNA?"
```

#### Available Commands
```bash
# Show help
node one-shot.js --help

# Show available types and options
node one-shot.js --types

# Show example questions for each type
node one-shot.js --examples

# Run demonstration
node demo-one-shot.js

# Compare zero-shot vs one-shot
node demo-one-shot.js --comparison

# Run task-specific demo
node demo-one-shot.js --task-demo
```

### API Endpoints

#### Standard Chat with One-Shot
```http
POST /chat
Content-Type: application/json

{
  "message": "Solve 3x + 8 = 23",
  "options": {
    "promptType": "math",
    "promptingStrategy": "one-shot"
  }
}
```

#### Dedicated One-Shot Endpoint
```http
POST /chat/one-shot
Content-Type: application/json

{
  "message": "What causes earthquakes?",
  "promptType": "science",
  "level": "intermediate",
  "showExample": true
}
```

#### Compare Zero-Shot vs One-Shot
```http
POST /chat/compare
Content-Type: application/json

{
  "message": "Explain machine learning",
  "promptType": "programming",
  "level": "intermediate"
}
```

## Examples

### Mathematics Example
**Input:** "Solve the equation 4x - 7 = 21"

**One-Shot Template Used:**
```
Human: Solve the equation 3x + 7 = 22
