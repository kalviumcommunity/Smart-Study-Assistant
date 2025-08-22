# RTFC Framework - Retrieval-Augmented Generation with Tool-calling and Function-calling

## 🚀 Overview

The RTFC Framework enhances your AI model with:
- **R**etrieval: Built-in knowledge base for study topics
- **T**ool-calling: Automated tool selection and execution
- **F**unction-calling: Mathematical calculations and specialized functions
- **C**ontext-aware: Enhanced responses using all available information

## 🔧 Available Tools

### 1. **Calculator**
- **Purpose**: Perform mathematical calculations
- **Triggers**: Words like "solve", "calculate", "compute", math symbols
- **Example**: `node rtfc.js ask "Solve 3x + 7 = 22"`

### 2. **Knowledge Search**
- **Purpose**: Search built-in study knowledge base
- **Triggers**: "What is", "define", "explain", "tell me about"
- **Example**: `node rtfc.js ask "What is photosynthesis?"`

### 3. **Study Helper**
- **Purpose**: Provide study tips and learning strategies
- **Triggers**: "how to study", "study tips", "learning"
- **Example**: `node rtfc.js ask "How to study math effectively?"`

### 4. **Formula Lookup**
- **Purpose**: Find mathematical and scientific formulas
- **Triggers**: "formula", "equation", "law of"
- **Example**: `node rtfc.js ask "What is the quadratic formula?"`

## 📚 Built-in Knowledge Base

The framework includes pre-loaded knowledge on:
- **Photosynthesis**: Process, equation, components
- **Gravity**: Newton's law, acceleration, concepts
- **Cell Structure**: Basic cell components and functions
- **Water Cycle**: Evaporation, condensation, precipitation
- **Quadratic Formula**: Mathematical formula and usage
- **World War 1**: Causes, timeline, major powers

## 🖥️ Command Line Usage

### Basic Commands
```bash
# Ask a question with RTFC enhancement
node rtfc.js ask "What is DNA?"

# Get detailed response with framework info
node rtfc.js detailed "Explain gravity"

# List available tools
node rtfc.js tools

# Show help
node rtfc.js help

# Direct question (no command needed)
node rtfc.js "What causes rain?"
```

### Example Outputs

#### Math Problem:
```bash
node rtfc.js ask "Solve 2x + 5 = 15"
```
**Output:**
- 🔧 Tools used: calculator
- Step-by-step solution with clear explanation
- Final answer: x = 5

#### Knowledge Query:
```bash
node rtfc.js detailed "What is photosynthesis?"
```
**Output:**
- 🔧 Tools used: knowledge_search
- 📚 Knowledge retrieved: Yes
- 📖 Sources: photosynthesis
- Enhanced answer with chemical equation

## 🌐 API Endpoints

### Standard Chat
```http
POST /chat
Content-Type: application/json

{
  "message": "What is gravity?"
}
```

### Enhanced RTFC Chat
```http
POST /chat/rtfc
Content-Type: application/json

{
  "message": "Solve 3x + 7 = 22",
  "detailed": false
}
```

### Detailed RTFC Response
```http
POST /chat/rtfc
Content-Type: application/json

{
  "message": "What is photosynthesis?",
  "detailed": true
}
```

**Detailed Response Format:**
```json
{
  "reply": "Enhanced answer text...",
  "toolsUsed": ["knowledge_search"],
  "knowledgeUsed": true,
  "sources": [
    {
      "topic": "photosynthesis",
      "content": "Process description..."
    }
  ]
}
```

## 🔄 How RTFC Works

1. **Analysis**: Analyzes user message for tool needs
2. **Tool Execution**: Runs appropriate tools (calculator, knowledge search, etc.)
3. **Knowledge Retrieval**: Searches built-in knowledge base
4. **Enhanced Generation**: Creates response using all available context
5. **Clean Output**: Formats response for readability

## 🎯 Use Cases

### Perfect for:
- **Math Problems**: Automatic calculation with step-by-step solutions
- **Science Questions**: Enhanced with built-in scientific knowledge
- **Study Help**: Combines multiple tools for comprehensive answers
- **Formula Lookup**: Quick access to mathematical and scientific formulas

### Example Scenarios:

**Math Student:**
```bash
node rtfc.js ask "What's the quadratic formula and solve x² + 5x + 6 = 0"
```
- Uses formula_lookup tool for the formula
- Uses calculator tool for the solution
- Provides both formula and worked example

**Science Student:**
```bash
node rtfc.js detailed "How does photosynthesis work?"
```
- Retrieves knowledge from built-in database
- Provides chemical equation
- Shows framework usage details

## 🛠️ Extending the Framework

### Adding New Knowledge:
```javascript
import { addKnowledge } from "./src/services/rtfc-gemini.js";
await addKnowledge("mitosis", "Cell division process...");
```

### Registering New Tools:
```javascript
import { registerTool } from "./src/services/rtfc-gemini.js";
registerTool('weather', {
  description: 'Get weather information',
  parameters: { location: 'string - City name' },
  execute: (params) => getWeather(params.location)
});
```

## 📊 Performance Benefits

- **Faster Responses**: Thinking disabled for speed
- **More Accurate**: Context from tools and knowledge base
- **Comprehensive**: Multiple information sources combined
- **Educational**: Perfect for study assistance

## 🎉 Success Metrics

✅ **Tool Integration**: 4 built-in tools working perfectly
✅ **Knowledge Base**: 6+ study topics pre-loaded
✅ **Clean Output**: Formatted responses without excessive markdown
✅ **Multi-modal**: Handles math, science, and general questions
✅ **Extensible**: Easy to add new tools and knowledge

Your Smart Study Assistant now has enterprise-level AI capabilities with the RTFC framework!
