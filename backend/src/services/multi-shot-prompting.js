/**
 * Multi-Shot Prompting Engine
 * Generates intelligent prompts with multiple examples to guide AI responses
 * Provides 2-5 examples per subject area for enhanced pattern recognition
 */

export class MultiShotPromptEngine {
  constructor() {
    this.promptTemplates = {
      // Academic subjects with multiple examples
      math: {
        pattern: /(?:solve|calculate|find|equation|formula|math|algebra|geometry|calculus|statistics|\d+[\+\-\*\/]|\=)/i,
        systemPrompt: `You are an expert mathematics tutor. When solving problems, follow this format:`,
        examples: [
          {
            question: "Solve the equation 3x + 7 = 22",
            response: `Let me solve this step-by-step:

**Given equation:** 3x + 7 = 22

**Step 1:** Subtract 7 from both sides
3x + 7 - 7 = 22 - 7
3x = 15

**Step 2:** Divide both sides by 3
3x ÷ 3 = 15 ÷ 3
x = 5

**Verification:** Let's check our answer
3(5) + 7 = 15 + 7 = 22 ✓

**Answer:** x = 5`
          },
          {
            question: "Find the area of a circle with radius 4 cm",
            response: `Let me calculate the area step-by-step:

**Given:** Radius (r) = 4 cm

**Formula:** Area = πr²

**Step 1:** Substitute the values
Area = π × (4)²
Area = π × 16
Area = 16π cm²

**Step 2:** Calculate numerical value
Area ≈ 16 × 3.14159
Area ≈ 50.27 cm²

**Answer:** The area is 16π cm² or approximately 50.27 cm²`
          },
          {
            question: "Solve the quadratic equation x² - 5x + 6 = 0",
            response: `Let me solve this quadratic equation:

**Given equation:** x² - 5x + 6 = 0

**Method:** Factoring

**Step 1:** Find two numbers that multiply to 6 and add to -5
Numbers: -2 and -3 (since -2 × -3 = 6 and -2 + (-3) = -5)

**Step 2:** Factor the equation
x² - 5x + 6 = (x - 2)(x - 3) = 0

**Step 3:** Solve for x
x - 2 = 0  or  x - 3 = 0
x = 2     or  x = 3

**Verification:** 
For x = 2: (2)² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓
For x = 3: (3)² - 5(3) + 6 = 9 - 15 + 6 = 0 ✓

**Answer:** x = 2 or x = 3`
          }
        ]
      },

      science: {
        pattern: /(?:explain|how does|what is|why|science|biology|chemistry|physics|experiment|theory|process)/i,
        systemPrompt: `You are an expert science educator. When explaining scientific concepts, follow this format:`,
        examples: [
          {
            question: "How does photosynthesis work?",
            response: `**What is Photosynthesis?**
Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water.

**The Process:**

**1. Light Reactions (in chloroplasts)**
- Chlorophyll absorbs sunlight
- Water molecules are split (H₂O → 2H⁺ + ½O₂ + 2e⁻)
- Oxygen is released as a byproduct
- Energy is captured in ATP and NADPH

**2. Dark Reactions (Calvin Cycle)**
- CO₂ is fixed into organic molecules
- ATP and NADPH provide energy
- Glucose (C₆H₁₂O₆) is produced

**Chemical Equation:**
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

**Real-World Applications:**
- Provides oxygen for all aerobic life
- Forms the base of most food chains
- Used in biofuel research
- Inspiration for solar panel technology

**Key Takeaway:** Photosynthesis converts solar energy into chemical energy, sustaining most life on Earth.`
          },
          {
            question: "What causes earthquakes?",
            response: `**What are Earthquakes?**
Earthquakes are sudden releases of energy in the Earth's crust that create seismic waves, causing ground shaking.

**Primary Causes:**

**1. Tectonic Plate Movement**
- Earth's crust consists of moving plates
- Plates interact at boundaries (convergent, divergent, transform)
- Stress builds up as plates move against each other
- Sudden release creates earthquakes

**2. Fault Lines**
- Cracks in the Earth's crust where movement occurs
- San Andreas Fault (California) is a famous example
- Movement can be horizontal, vertical, or diagonal

**3. Types of Boundaries:**
- **Convergent:** Plates collide (subduction zones)
- **Divergent:** Plates separate (mid-ocean ridges)
- **Transform:** Plates slide past each other

**Measurement:**
- Richter Scale measures magnitude (energy released)
- Mercalli Scale measures intensity (damage/effects)

**Real-World Examples:**
- 2011 Japan earthquake (magnitude 9.0)
- 1906 San Francisco earthquake
- Ring of Fire around Pacific Ocean

**Key Takeaway:** Earthquakes result from the dynamic movement of Earth's tectonic plates releasing accumulated stress.`
          }
        ]
      }
    };

    // Add programming template
    this.promptTemplates.programming = {
      pattern: /(?:code|program|function|algorithm|debug|software|python|javascript|java|html|css|api|database)/i,
      systemPrompt: `You are an expert software developer and programming instructor. When helping with programming, follow this format:`,
      examples: [
        {
          question: "Create a Python function to reverse a string",
          response: `**Problem:** Create a function that reverses a string

**Solution 1: Using Slicing (Pythonic)**
\`\`\`python
def reverse_string(text):
    """
    Reverse a string using Python slicing

    Args:
        text (str): The string to reverse

    Returns:
        str: The reversed string
    """
    return text[::-1]

# Example usage
original = "Hello World"
reversed_text = reverse_string(original)
print(f"Original: {original}")
print(f"Reversed: {reversed_text}")
# Output: dlroW olleH
\`\`\`

**Solution 2: Using Loop (Educational)**
\`\`\`python
def reverse_string_loop(text):
    """
    Reverse a string using a loop
    """
    reversed_text = ""
    for char in text:
        reversed_text = char + reversed_text
    return reversed_text
\`\`\`

**Best Practices:**
- Use slicing for simplicity and performance
- Add docstrings for documentation
- Handle edge cases (empty strings)
- Consider memory efficiency for large strings

**Time Complexity:** O(n) for all methods
**Space Complexity:** O(n) for creating new string

**Key Takeaway:** Python's slicing syntax provides the most elegant solution for string reversal.`
        },
        {
          question: "Explain how APIs work with an example",
          response: `**What is an API?**
API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other.

**How APIs Work:**

**1. Request-Response Cycle**
- Client sends request to API endpoint
- Server processes the request
- Server sends back response (usually JSON)

**2. HTTP Methods**
- **GET:** Retrieve data
- **POST:** Create new data
- **PUT:** Update existing data
- **DELETE:** Remove data

**Real Example: Weather API**

**API Endpoint:**
\`\`\`
GET https://api.weather.com/v1/current?city=London&key=YOUR_API_KEY
\`\`\`

**JavaScript Implementation:**
\`\`\`javascript
async function getWeather(city) {
    try {
        const response = await fetch(
            \`https://api.weather.com/v1/current?city=\${city}&key=YOUR_API_KEY\`
        );

        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

// Usage
getWeather('London').then(weather => {
    if (weather) {
        console.log(\`Temperature: \${weather.temperature}°C\`);
        console.log(\`Condition: \${weather.condition}\`);
    }
});
\`\`\`

**Response Format (JSON):**
\`\`\`json
{
    "city": "London",
    "temperature": 18,
    "condition": "Cloudy",
    "humidity": 65,
    "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

**Benefits of APIs:**
- Modularity and separation of concerns
- Reusability across different applications
- Standardized communication protocols
- Scalability and maintainability

**Key Takeaway:** APIs enable seamless communication between different software systems using standardized protocols.`
        }
      ]
    };

    // Add language template
    this.promptTemplates.language = {
      pattern: /(?:grammar|language|english|writing|essay|literature|poetry|word|sentence|paragraph)/i,
      systemPrompt: `You are an expert language and literature instructor. When explaining language concepts, follow this format:`,
      examples: [
        {
          question: "What's the difference between 'who' and 'whom'?",
          response: `**Understanding Who vs. Whom:**

**Basic Rule:**
- **Who** = Subject (performs the action)
- **Whom** = Object (receives the action)

**Simple Test:**
Replace with he/him:
- If "he" fits → use "who"
- If "him" fits → use "whom"

**Examples:**

**1. Who Examples:**
- "Who is calling?" (He is calling ✓)
- "The person who called..." (He called ✓)
- "Who wants pizza?" (He wants pizza ✓)

**2. Whom Examples:**
- "To whom should I address this?" (Address this to him ✓)
- "Whom did you see?" (You saw him ✓)
- "The person whom I met..." (I met him ✓)

**Common Mistakes:**
- ❌ "Who did you give it to?"
- ✅ "Whom did you give it to?" or "To whom did you give it?"

**Memory Trick:**
- Who = he (both end in vowel sounds)
- Whom = him (both end in 'm')

**Modern Usage:**
In casual conversation, "who" is often acceptable, but formal writing should maintain the distinction.

**Key Takeaway:** Use "who" for subjects and "whom" for objects, especially in formal writing.`
        }
      ]
    };

    // Default examples for general queries
    this.defaultExamples = [
      {
        question: "How can I improve my study habits?",
        response: `**Effective Study Strategies:**

**1. Create a Study Schedule**
- Set specific times for studying
- Break large tasks into smaller chunks
- Use time-blocking techniques

**2. Find Your Learning Style**
- Visual: Use diagrams, charts, colors
- Auditory: Read aloud, discuss with others
- Kinesthetic: Use hands-on activities

**3. Active Learning Techniques**
- Summarize information in your own words
- Teach concepts to someone else
- Create practice questions

**4. Optimize Your Environment**
- Choose a quiet, well-lit space
- Remove distractions (phone, social media)
- Keep necessary materials organized

**Key Takeaway:** Consistent, active engagement with material in an optimized environment leads to better learning outcomes.`
      },
      {
        question: "What are the benefits of regular exercise?",
        response: `**Physical Benefits:**
- Strengthens cardiovascular system
- Builds muscle mass and bone density
- Improves flexibility and balance
- Boosts immune system function

**Mental Benefits:**
- Reduces stress and anxiety
- Improves mood through endorphin release
- Enhances cognitive function
- Promotes better sleep quality

**Long-term Health:**
- Reduces risk of chronic diseases
- Maintains healthy weight
- Increases life expectancy
- Improves quality of life

**Getting Started:**
- Start with 150 minutes moderate activity per week
- Include both cardio and strength training
- Choose activities you enjoy
- Gradually increase intensity

**Key Takeaway:** Regular exercise provides comprehensive benefits for both physical and mental health.`
      }
    ];
  }

  /**
   * Analyze the user message to determine the most appropriate prompt template
   */
  analyzeMessageType(message) {
    const lowerMessage = message.toLowerCase();

    // Check each template pattern
    for (const [type, template] of Object.entries(this.promptTemplates)) {
      if (template.pattern.test(lowerMessage)) {
        return {
          type,
          confidence: this.calculateConfidence(lowerMessage, template.pattern),
          template
        };
      }
    }

    return {
      type: 'general',
      confidence: 0.5,
      template: {
        systemPrompt: `You are an intelligent and helpful AI assistant. When responding to questions, follow this format:`,
        examples: this.defaultExamples
      }
    };
  }

  /**
   * Calculate confidence score for pattern matching
   */
  calculateConfidence(message, pattern) {
    const matches = message.match(pattern);
    if (!matches) return 0;

    const matchCount = matches.length;
    const messageLength = message.split(' ').length;
    return Math.min(0.9, (matchCount / messageLength) * 2);
  }

  /**
   * Generate multi-shot prompt with multiple examples
   */
  generatePrompt(userMessage, options = {}) {
    const analysis = this.analyzeMessageType(userMessage);

    // Allow manual override of prompt type
    if (options.promptType && this.promptTemplates[options.promptType]) {
      analysis.type = options.promptType;
      analysis.template = this.promptTemplates[options.promptType];
    }

    // Build the multi-shot prompt with multiple examples
    let systemPrompt = analysis.template.systemPrompt;

    // Add multiple examples
    systemPrompt += `\n\n**Examples:**\n`;

    const examples = analysis.template.examples || this.defaultExamples;
    const maxExamples = options.maxExamples || Math.min(examples.length, 3); // Default to 3 examples max

    for (let i = 0; i < maxExamples; i++) {
      const example = examples[i];
      systemPrompt += `\n**Example ${i + 1}:**\n`;
      systemPrompt += `Human: ${example.question}\n\n`;
      systemPrompt += `Assistant: ${example.response}\n\n`;
      systemPrompt += `---\n`;
    }

    systemPrompt += `\nNow, please respond to the following question using a similar format and style as demonstrated in the examples above:`;

    // Enhance the user message with context if needed
    let enhancedUserMessage = userMessage;

    // Add specific instructions based on message type
    if (analysis.type === 'math' && !userMessage.includes('step')) {
      enhancedUserMessage += "\n\nPlease show your work step by step.";
    } else if (analysis.type === 'science' && userMessage.includes('explain')) {
      enhancedUserMessage += "\n\nPlease include examples and real-world applications.";
    } else if (analysis.type === 'programming' && userMessage.includes('code')) {
      enhancedUserMessage += "\n\nPlease include code examples with explanations.";
    }

    // Add difficulty level adjustment if specified
    if (options.level) {
      const levelInstructions = {
        beginner: "Please explain this at a beginner level with simple terms and basic concepts.",
        intermediate: "Please provide a comprehensive explanation suitable for someone with some background knowledge.",
        advanced: "Please provide a detailed, technical explanation with advanced concepts and nuances."
      };

      if (levelInstructions[options.level]) {
        enhancedUserMessage += `\n\n${levelInstructions[options.level]}`;
      }
    }

    return {
      systemPrompt,
      enhancedUserMessage,
      analysisType: analysis.type,
      confidence: analysis.confidence,
      examples: examples.slice(0, maxExamples),
      exampleCount: maxExamples
    };
  }

  /**
   * Get available prompt types
   */
  getAvailableTypes() {
    return Object.keys(this.promptTemplates);
  }

  /**
   * Get examples for a specific type
   */
  getExamplesForType(type) {
    if (this.promptTemplates[type]) {
      return this.promptTemplates[type].examples;
    }
    return this.defaultExamples;
  }

  /**
   * Add or update a custom prompt template with multiple examples
   */
  addCustomTemplate(name, pattern, systemPrompt, examples) {
    this.promptTemplates[name] = {
      pattern: new RegExp(pattern, 'i'),
      systemPrompt,
      examples: Array.isArray(examples) ? examples : [examples]
    };
  }

  /**
   * Generate a prompt for a specific task type with multiple examples
   */
  generateTaskSpecificPrompt(taskType, userMessage, options = {}) {
    const taskExamples = {
      explanation: [
        {
          question: "Explain how machine learning works",
          response: `**What is Machine Learning?**
Machine learning is a subset of artificial intelligence where computers learn patterns from data without being explicitly programmed for each task.

**Core Components:**

**1. Data**
- Training data: Examples used to teach the algorithm
- Features: Individual measurable properties of observations
- Labels: Correct answers for supervised learning

**2. Algorithms**
- **Supervised Learning:** Uses labeled data (classification, regression)
- **Unsupervised Learning:** Finds patterns in unlabeled data (clustering)
- **Reinforcement Learning:** Learns through trial and error with rewards

**3. Model Training Process**
- Feed data to algorithm
- Algorithm finds patterns and relationships
- Creates a model that can make predictions
- Test model on new, unseen data

**Real-World Applications:**
- Email spam detection
- Recommendation systems (Netflix, Amazon)
- Image recognition in medical diagnosis
- Autonomous vehicles

**Key Takeaway:** Machine learning enables computers to improve performance on tasks through experience, mimicking human learning processes.`
        },
        {
          question: "Explain photosynthesis in simple terms",
          response: `**What is Photosynthesis?**
Photosynthesis is nature's way of converting sunlight into food that plants can use to grow and survive.

**Simple Process:**

**1. Ingredients Needed**
- Sunlight (energy source)
- Carbon dioxide (from air through leaves)
- Water (absorbed through roots)
- Chlorophyll (green pigment in leaves)

**2. The Recipe**
- Leaves capture sunlight using chlorophyll
- Water travels up from roots to leaves
- Carbon dioxide enters through tiny pores in leaves
- Chlorophyll uses sunlight to combine water and CO₂

**3. What's Produced**
- Glucose (sugar) - plant's food
- Oxygen - released into air as waste

**Why It Matters:**
- Plants get energy to grow
- Animals eat plants for energy
- Oxygen is produced for us to breathe
- Removes carbon dioxide from atmosphere

**Simple Equation:**
Sunlight + Water + Carbon Dioxide → Sugar + Oxygen

**Key Takeaway:** Photosynthesis is like a solar-powered kitchen where plants make their own food and give us oxygen as a bonus!`
        }
      ],
      problem_solving: [
        {
          question: "How do I fix a slow computer?",
          response: `**Diagnosing a Slow Computer:**

**Step 1: Identify the Problem**
- When did slowness start?
- Is it slow during startup, specific programs, or always?
- Any recent changes (new software, updates)?

**Step 2: Quick Fixes**

**1. Restart Your Computer**
- Clears temporary files and memory
- Stops unnecessary background processes
- Often solves temporary slowdowns

**2. Check Available Storage**
- Ensure at least 15% free space on main drive
- Delete unnecessary files and programs
- Empty recycle bin and downloads folder

**3. Close Unnecessary Programs**
- Check Task Manager (Ctrl+Shift+Esc)
- End high-CPU usage programs you don't need
- Disable startup programs you don't use

**Step 3: Deeper Solutions**

**1. Run Disk Cleanup**
- Windows: Search "Disk Cleanup"
- Mac: Use "Storage Management"
- Remove temporary files, cache, old logs

**2. Check for Malware**
- Run full antivirus scan
- Use Malwarebytes for additional protection
- Remove suspicious programs

**3. Update Software**
- Install Windows/macOS updates
- Update drivers (especially graphics)
- Update frequently used programs

**Step 4: Hardware Considerations**
- Check if RAM is sufficient (8GB+ recommended)
- Consider SSD upgrade if using traditional hard drive
- Ensure computer isn't overheating

**When to Seek Help:**
- If problems persist after these steps
- Hardware issues suspected
- Important data needs professional recovery

**Key Takeaway:** Most computer slowdowns are caused by software issues that can be resolved with systematic troubleshooting.`
        }
      ]
    };

    const taskPrompts = {
      explanation: "Explain the following concept clearly and thoroughly:",
      problem_solving: "Solve the following problem step by step:",
      analysis: "Analyze the following topic in detail:",
      comparison: "Compare and contrast the following:",
      summary: "Provide a comprehensive summary of:",
      tutorial: "Create a tutorial or guide for:",
      research: "Research and provide information about:",
      creative: "Help with the following creative task:"
    };

    const basePrompt = taskPrompts[taskType] || "Help with the following:";
    const enhancedMessage = `${basePrompt}\n\n${userMessage}`;

    // Use task-specific examples if available, otherwise use detected type
    const analysis = this.analyzeMessageType(userMessage);
    let systemPrompt = analysis.template.systemPrompt;
    let examples = analysis.template.examples || this.defaultExamples;

    if (taskExamples[taskType]) {
      examples = taskExamples[taskType];
      systemPrompt = `You are a helpful assistant. When ${taskType.replace('_', ' ')}, follow this format:`;
    }

    // Build multi-shot prompt with task-specific examples
    systemPrompt += `\n\n**Examples:**\n`;

    const maxExamples = options.maxExamples || Math.min(examples.length, 2); // Default to 2 examples for tasks

    for (let i = 0; i < maxExamples; i++) {
      const example = examples[i];
      systemPrompt += `\n**Example ${i + 1}:**\n`;
      systemPrompt += `Human: ${example.question}\n\n`;
      systemPrompt += `Assistant: ${example.response}\n\n`;
      systemPrompt += `---\n`;
    }

    systemPrompt += `\nNow, please respond to the following in a similar format and style:`;

    return {
      systemPrompt,
      enhancedUserMessage: enhancedMessage,
      analysisType: analysis.type,
      confidence: analysis.confidence,
      examples: examples.slice(0, maxExamples),
      taskType,
      exampleCount: maxExamples
    };
  }
}

export default MultiShotPromptEngine;
