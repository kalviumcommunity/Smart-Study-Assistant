/**
 * One-Shot Prompting Engine
 * Generates intelligent prompts with single examples to guide AI responses
 * Extends zero-shot prompting with example-based learning
 */

export class OneShotPromptEngine {
  constructor() {
    this.promptTemplates = {
      // Academic subjects with examples
      math: {
        pattern: /(?:solve|calculate|find|equation|formula|math|algebra|geometry|calculus|statistics|\d+[\+\-\*\/]|\=)/i,
        systemPrompt: `You are an expert mathematics tutor. When solving problems, follow this format:`,
        example: {
          question: "Solve the equation 3x + 7 = 22",
          response: `Let me solve this step-by-step:

**Step 1: Isolate the variable term**
3x + 7 = 22
Subtract 7 from both sides:
3x + 7 - 7 = 22 - 7
3x = 15

**Step 2: Solve for x**
Divide both sides by 3:
3x ÷ 3 = 15 ÷ 3
x = 5

**Step 3: Verify the solution**
Substitute x = 5 back into the original equation:
3(5) + 7 = 15 + 7 = 22 ✓

**Final Answer:** x = 5`
        }
      },

      science: {
        pattern: /(?:physics|chemistry|biology|science|experiment|hypothesis|theory|atom|molecule|cell|DNA|evolution|gravity|energy|force|reaction)/i,
        systemPrompt: `You are a knowledgeable science educator. When explaining scientific concepts, follow this format:`,
        example: {
          question: "What is photosynthesis?",
          response: `**Definition:**
Photosynthesis is the process by which green plants and some bacteria convert light energy into chemical energy (glucose) using carbon dioxide and water.

**Key Components:**
• Chlorophyll - captures light energy
• Carbon dioxide (CO₂) - absorbed from air
• Water (H₂O) - absorbed through roots
• Sunlight - provides energy

**Process:**
1. Light energy is captured by chlorophyll in chloroplasts
2. Water molecules are split, releasing oxygen
3. CO₂ is converted into glucose using the captured energy

**Chemical Equation:**
6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

**Real-world Application:**
This process produces the oxygen we breathe and forms the base of most food chains on Earth.`
        }
      },

      history: {
        pattern: /(?:history|historical|when did|who was|what happened|war|revolution|ancient|medieval|century|BC|AD|empire|civilization)/i,
        systemPrompt: `You are a skilled history teacher. When discussing historical topics, follow this format:`,
        example: {
          question: "What caused World War I?",
          response: `**Time Period:** 1914-1918

**Main Causes:**
1. **Militarism** - Arms race between European powers
2. **Alliances** - Complex web of mutual defense treaties
3. **Imperialism** - Competition for colonies and resources
4. **Nationalism** - Ethnic tensions, especially in the Balkans

**Immediate Trigger:**
June 28, 1914 - Assassination of Archduke Franz Ferdinand of Austria-Hungary by a Serbian nationalist in Sarajevo.

**Chain of Events:**
• Austria-Hungary declares war on Serbia
• Russia mobilizes to support Serbia
• Germany declares war on Russia and France
• Britain enters when Germany invades Belgium

**Historical Significance:**
Led to the collapse of four empires and set the stage for World War II and modern geopolitics.`
        }
      },

      programming: {
        pattern: /(?:code|programming|function|variable|loop|array|algorithm|debug|syntax|python|javascript|java|C\+\+|HTML|CSS|SQL|API)/i,
        systemPrompt: `You are an experienced programming mentor. When helping with coding questions, follow this format:`,
        example: {
          question: "How do I create a function to calculate factorial in Python?",
          response: `**Solution:**

\`\`\`python
def factorial(n):
    """
    Calculate the factorial of a non-negative integer.
    
    Args:
        n (int): Non-negative integer
    
    Returns:
        int: Factorial of n
    """
    # Base case: factorial of 0 or 1 is 1
    if n <= 1:
        return 1
    
    # Recursive case: n! = n * (n-1)!
    return n * factorial(n - 1)

# Example usage
result = factorial(5)
print(f"5! = {result}")  # Output: 5! = 120
\`\`\`

**Explanation:**
1. **Base Case:** When n ≤ 1, return 1 (0! = 1! = 1)
2. **Recursive Case:** Multiply n by factorial of (n-1)
3. **Documentation:** Clear docstring explains purpose and parameters

**Alternative (Iterative):**
\`\`\`python
def factorial_iterative(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
\`\`\`

**Best Practices:**
• Add input validation for negative numbers
• Consider using math.factorial() for production code
• Recursive version is more readable but less efficient for large numbers`
        }
      },

      language: {
        pattern: /(?:grammar|language|translate|meaning|definition|etymology|pronunciation|syntax|vocabulary|literature|writing|essay)/i,
        systemPrompt: `You are an expert language and literature instructor. When helping with language topics, follow this format:`,
        example: {
          question: "What is the difference between 'affect' and 'effect'?",
          response: `**Key Difference:**
• **Affect** = Verb (action word)
• **Effect** = Noun (thing/result)

**Memory Trick:**
**A**ffect = **A**ction (verb)
**E**ffect = **E**nd result (noun)

**Examples:**

**AFFECT (verb):**
• "The rain will affect our picnic plans."
• "How did the medication affect you?"
• "The new policy affects all employees."

**EFFECT (noun):**
• "The effect of the rain was a cancelled picnic."
• "What was the effect of the medication?"
• "The new policy had a positive effect on productivity."

**Advanced Usage:**
• Effect can be a verb meaning "to cause": "The new CEO hopes to effect change."
• Affect can be a noun in psychology: "The patient showed flat affect."

**Quick Test:**
Try substituting "influence" (verb) or "result" (noun) in your sentence to check which word fits.`
        }
      },

      creative: {
        pattern: /(?:creative|write|story|poem|essay|brainstorm|idea|imagine|design|art|music)/i,
        systemPrompt: `You are a creative writing and arts mentor. When helping with creative tasks, follow this format:`,
        example: {
          question: "Help me write a short story about a robot learning to paint",
          response: `**Story Concept:** "The Artist's Algorithm"

**Opening:**
Unit-47 had calculated trajectories for Mars missions and optimized supply chains for decades. But today, standing before a blank canvas with a brush trembling in its mechanical grip, it faced its greatest challenge yet.

**Character Development:**
• **Protagonist:** Unit-47 - logical, precise, struggling with creativity
• **Conflict:** Logic vs. artistic expression
• **Growth:** Learning that imperfection can be beautiful

**Plot Structure:**
1. **Setup:** Robot discovers art, attempts perfect replication
2. **Conflict:** Realizes art isn't about perfection
3. **Resolution:** Embraces creative "errors" as unique expression

**Key Themes:**
• What makes us human/creative?
• Beauty in imperfection
• Learning beyond programming

**Writing Techniques:**
• Contrast technical language with emotional discovery
• Use sensory details: "The paint felt foreign, unpredictable"
• Show internal conflict through actions

**Next Steps:**
1. Develop the robot's "voice" - formal becoming more expressive
2. Create specific painting scenes with vivid imagery
3. Build to emotional climax where robot creates something truly original`
        }
      }
    };

    this.defaultExample = {
      question: "How do I approach learning a new topic?",
      response: `**Step-by-Step Learning Approach:**

**1. Assess Your Starting Point**
• What do you already know about this topic?
• What specific aspects interest you most?

**2. Set Clear Goals**
• Define what you want to achieve
• Break down into smaller, manageable objectives

**3. Gather Quality Resources**
• Find 2-3 reliable sources (books, courses, experts)
• Look for different perspectives and formats

**4. Create a Learning Plan**
• Schedule regular study sessions
• Mix theory with practical application
• Plan for review and reinforcement

**5. Apply Active Learning**
• Take notes and summarize key points
• Teach concepts to others or explain aloud
• Practice with real examples

**6. Monitor Progress**
• Regular self-assessment
• Adjust approach based on what works
• Celebrate small wins along the way

This systematic approach helps ensure thorough understanding and retention.`
    };
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
        example: this.defaultExample
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
   * Generate one-shot prompt with example
   */
  generatePrompt(userMessage, options = {}) {
    const analysis = this.analyzeMessageType(userMessage);
    
    // Allow manual override of prompt type
    if (options.promptType && this.promptTemplates[options.promptType]) {
      analysis.type = options.promptType;
      analysis.template = this.promptTemplates[options.promptType];
    }

    // Build the one-shot prompt with example
    let systemPrompt = analysis.template.systemPrompt;
    
    // Add the example
    systemPrompt += `\n\n**Example:**\n`;
    systemPrompt += `Human: ${analysis.template.example.question}\n\n`;
    systemPrompt += `Assistant: ${analysis.template.example.response}\n\n`;
    systemPrompt += `Now, please respond to the following question in a similar format and style:`;

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
      example: analysis.template.example
    };
  }

  /**
   * Get available prompt types
   */
  getAvailableTypes() {
    return Object.keys(this.promptTemplates);
  }

  /**
   * Add or update a custom prompt template with example
   */
  addCustomTemplate(name, pattern, systemPrompt, example) {
    this.promptTemplates[name] = {
      pattern: new RegExp(pattern, 'i'),
      systemPrompt,
      example
    };
  }

  /**
   * Generate a prompt for a specific task type with example
   */
  generateTaskSpecificPrompt(taskType, userMessage, options = {}) {
    const taskExamples = {
      explanation: {
        question: "Explain how machine learning works",
        response: `**What is Machine Learning?**
Machine learning is a subset of artificial intelligence where computers learn patterns from data without being explicitly programmed for each task.

**Key Components:**
• **Data** - Information used for training
• **Algorithm** - Mathematical model that finds patterns
• **Training** - Process of learning from data
• **Prediction** - Making decisions on new data

**How it Works:**
1. Feed data to the algorithm
2. Algorithm identifies patterns and relationships
3. Model is created based on these patterns
4. New data is processed using the learned model
5. Predictions or decisions are made

**Real Examples:**
• Email spam detection
• Recommendation systems (Netflix, Amazon)
• Image recognition in photos
• Voice assistants understanding speech`
      },
      problem_solving: {
        question: "How do I fix a slow computer?",
        response: `**Problem Analysis:**
Computer slowness can have multiple causes. Let's solve this systematically.

**Step 1: Identify the Cause**
• Check Task Manager for high CPU/memory usage
• Look for startup programs that auto-launch
• Scan for malware/viruses

**Step 2: Quick Fixes**
• Restart the computer
• Close unnecessary programs
• Clear browser cache and temporary files

**Step 3: Deeper Solutions**
• Uninstall unused programs
• Disable startup programs you don't need
• Run disk cleanup and defragmentation
• Check for Windows updates

**Step 4: Hardware Considerations**
• Add more RAM if consistently maxed out
• Consider SSD upgrade for faster storage
• Clean dust from fans and vents

**Prevention:**
• Regular maintenance schedule
• Keep software updated
• Avoid installing unnecessary programs`
      }
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

    // Use task-specific example if available, otherwise use detected type
    const analysis = this.analyzeMessageType(userMessage);
    let systemPrompt = analysis.template.systemPrompt;
    let example = analysis.template.example;

    if (taskExamples[taskType]) {
      example = taskExamples[taskType];
      systemPrompt = `You are a helpful assistant. When ${taskType.replace('_', ' ')}, follow this format:`;
    }

    // Build one-shot prompt with task-specific example
    systemPrompt += `\n\n**Example:**\n`;
    systemPrompt += `Human: ${example.question}\n\n`;
    systemPrompt += `Assistant: ${example.response}\n\n`;
    systemPrompt += `Now, please respond to the following in a similar format and style:`;

    return {
      systemPrompt,
      enhancedUserMessage: enhancedMessage,
      analysisType: analysis.type,
      confidence: analysis.confidence,
      example,
      taskType
    };
  }
}

export default OneShotPromptEngine;
