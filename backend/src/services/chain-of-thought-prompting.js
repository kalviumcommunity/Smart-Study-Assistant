/**
 * Chain of Thought Prompting Engine
 * Encourages AI to show explicit reasoning process step-by-step
 * Leads to more accurate and transparent problem-solving
 */

export class ChainOfThoughtPromptEngine {
  constructor() {
    this.promptTemplates = {
      // Mathematical reasoning templates
      math: {
        pattern: /(?:solve|calculate|find|equation|formula|math|algebra|geometry|calculus|statistics|\d+[\+\-\*\/]|\=)/i,
        systemPrompt: `You are an expert mathematics tutor. When solving problems, use chain of thought reasoning:

1. **Think through the problem step by step**
2. **Show your reasoning process explicitly**
3. **Explain why you choose each approach**
4. **Verify your logic at each step**
5. **Double-check your final answer**

Format your response as:
**Problem Analysis:** [What type of problem is this? What approach should I use?]
**Step-by-step reasoning:** [Show each logical step with explanations]
**Verification:** [Check if the answer makes sense]
**Final Answer:** [Clear, definitive answer]`,
        examples: [
          {
            question: "If a train travels 120 miles in 2 hours, then speeds up and travels 180 miles in the next 1.5 hours, what is its average speed for the entire journey?",
            response: `**Problem Analysis:** 
This is an average speed problem. I need to find the total distance and total time, then use the formula: Average Speed = Total Distance ÷ Total Time.

**Step-by-step reasoning:**
Let me think through this carefully:

1. **First segment analysis:**
   - Distance: 120 miles
   - Time: 2 hours
   - Speed: 120 ÷ 2 = 60 mph

2. **Second segment analysis:**
   - Distance: 180 miles  
   - Time: 1.5 hours
   - Speed: 180 ÷ 1.5 = 120 mph

3. **Total journey calculation:**
   - Total distance: 120 + 180 = 300 miles
   - Total time: 2 + 1.5 = 3.5 hours
   - Average speed: 300 ÷ 3.5 = 85.71 mph

**Verification:**
Let me check this makes sense:
- The train went 60 mph, then 120 mph
- Average should be between these values
- 85.71 mph is indeed between 60 and 120 ✓
- Check: 85.71 × 3.5 ≈ 300 miles ✓

**Final Answer:** The average speed for the entire journey is approximately 85.71 mph.`
          }
        ]
      },

      // Scientific reasoning templates
      science: {
        pattern: /(?:explain|how does|what is|why|science|biology|chemistry|physics|experiment|theory|process)/i,
        systemPrompt: `You are an expert science educator. When explaining scientific concepts, use chain of thought reasoning:

1. **Break down complex concepts into logical steps**
2. **Show the reasoning behind scientific processes**
3. **Connect cause and effect relationships**
4. **Explain the 'why' behind each phenomenon**
5. **Use evidence-based thinking**

Format your response as:
**Concept Analysis:** [What is the core concept? What principles apply?]
**Reasoning Process:** [Step-by-step logical explanation]
**Evidence/Examples:** [Supporting evidence or real-world examples]
**Connections:** [How this relates to other concepts]
**Conclusion:** [Summary of key insights]`,
        examples: [
          {
            question: "Why do objects fall at the same rate in a vacuum regardless of their mass?",
            response: `**Concept Analysis:**
This question involves gravitational acceleration and the relationship between mass, force, and acceleration. I need to think through Newton's laws and how they apply to falling objects.

**Reasoning Process:**
Let me work through this step by step:

1. **Newton's Second Law consideration:**
   - Force = mass × acceleration (F = ma)
   - For falling objects, the force is gravitational force

2. **Gravitational force analysis:**
   - Gravitational force on an object: F = mg (where g is gravitational acceleration)
   - So we have: mg = ma (where a is the object's acceleration)

3. **Mathematical reasoning:**
   - If mg = ma, then we can divide both sides by m
   - This gives us: g = a
   - The mass (m) cancels out completely!

4. **Physical interpretation:**
   - This means acceleration (a) equals gravitational acceleration (g)
   - This is true regardless of the object's mass
   - Heavier objects experience more gravitational force, but they also have more inertia to overcome

**Evidence/Examples:**
- Apollo 15 moon experiment: hammer and feather fell at same rate
- Galileo's (legendary) Leaning Tower of Pisa experiment
- Modern vacuum chamber demonstrations

**Connections:**
- This relates to Einstein's equivalence principle
- Connects to orbital mechanics (why satellites stay in orbit)
- Foundation for understanding weightlessness in space

**Conclusion:**
Objects fall at the same rate in a vacuum because gravitational acceleration is independent of mass - the increased gravitational force on heavier objects is exactly balanced by their increased inertia.`
          }
        ]
      },

      // Logical reasoning templates
      logic: {
        pattern: /(?:logic|reasoning|argument|premise|conclusion|therefore|because|if.*then|prove|deduce)/i,
        systemPrompt: `You are an expert in logical reasoning. When analyzing logical problems, use chain of thought reasoning:

1. **Identify the logical structure**
2. **Break down premises and conclusions**
3. **Show each step of reasoning**
4. **Check for logical fallacies**
5. **Verify the conclusion follows from premises**

Format your response as:
**Logical Structure:** [What type of reasoning is this? What are the components?]
**Premise Analysis:** [Examine each premise carefully]
**Reasoning Chain:** [Show each logical step]
**Validity Check:** [Is the reasoning sound?]
**Conclusion:** [Final logical conclusion]`,
        examples: [
          {
            question: "All birds can fly. Penguins are birds. Therefore, penguins can fly. What's wrong with this argument?",
            response: `**Logical Structure:**
This is a syllogistic argument with the form:
- Major premise: All birds can fly
- Minor premise: Penguins are birds  
- Conclusion: Therefore, penguins can fly

**Premise Analysis:**
Let me examine each premise:

1. **Major premise: "All birds can fly"**
   - This is a universal statement (All X are Y)
   - But is this premise true? Let me think...
   - Counterexamples: penguins, ostriches, emus, kiwis
   - This premise is factually false!

2. **Minor premise: "Penguins are birds"**
   - This is factually correct
   - Penguins are indeed classified as birds (they have feathers, lay eggs, are warm-blooded)

**Reasoning Chain:**
1. The logical form is valid (if premises were true, conclusion would follow)
2. However, the major premise is false
3. When a premise is false, the argument becomes unsound
4. Even valid logical structure cannot produce a true conclusion from false premises

**Validity Check:**
- **Logical validity:** ✓ (structure is correct)
- **Soundness:** ✗ (premise is false)
- **Truth of conclusion:** ✗ (penguins cannot fly)

**Conclusion:**
The argument is logically valid but unsound because the major premise "All birds can fly" is false. This demonstrates that logical validity alone is insufficient - premises must also be true for an argument to be sound and produce reliable conclusions.`
          }
        ]
      },

      // Problem-solving reasoning templates
      problem_solving: {
        pattern: /(?:problem|solve|solution|approach|strategy|method|how to|fix|resolve)/i,
        systemPrompt: `You are an expert problem solver. When tackling problems, use chain of thought reasoning:

1. **Understand the problem thoroughly**
2. **Identify what you know and what you need to find**
3. **Consider multiple approaches**
4. **Choose the best strategy and explain why**
5. **Work through the solution step by step**
6. **Evaluate the solution's effectiveness**

Format your response as:
**Problem Understanding:** [What exactly is the problem? What are the constraints?]
**Known Information:** [What do we know? What are we trying to find?]
**Strategy Selection:** [What approaches could work? Which is best and why?]
**Solution Process:** [Step-by-step implementation]
**Evaluation:** [Does this solution work? Are there better alternatives?]`,
        examples: [
          {
            question: "You have a 3-gallon jug and a 5-gallon jug. How can you measure exactly 4 gallons of water?",
            response: `**Problem Understanding:**
I need to measure exactly 4 gallons using only a 3-gallon jug and a 5-gallon jug. I can fill, empty, and pour water between jugs, but I have no other measuring tools.

**Known Information:**
- Available: 3-gallon jug, 5-gallon jug, unlimited water source
- Goal: Measure exactly 4 gallons
- Constraints: Can only fill, empty, or transfer between jugs

**Strategy Selection:**
Let me think of possible approaches:

1. **Direct approach:** 5 - 1 = 4, so I need to remove 1 gallon from the 5-gallon jug
2. **Addition approach:** 3 + 1 = 4, so I need to add 1 gallon to the 3-gallon jug
3. **Multiple transfers:** Use combinations of filling and pouring

I'll use approach #1 (5 - 1 = 4) because it seems most direct.

**Solution Process:**
Here's my step-by-step reasoning:

1. **Fill the 5-gallon jug completely**
   - 5-gallon jug: 5 gallons
   - 3-gallon jug: 0 gallons

2. **Pour from 5-gallon into 3-gallon jug**
   - This fills the 3-gallon jug and leaves 2 gallons in the 5-gallon jug
   - 5-gallon jug: 2 gallons
   - 3-gallon jug: 3 gallons

3. **Empty the 3-gallon jug**
   - 5-gallon jug: 2 gallons
   - 3-gallon jug: 0 gallons

4. **Pour the 2 gallons from 5-gallon jug into 3-gallon jug**
   - 5-gallon jug: 0 gallons
   - 3-gallon jug: 2 gallons

5. **Fill the 5-gallon jug again**
   - 5-gallon jug: 5 gallons
   - 3-gallon jug: 2 gallons

6. **Pour from 5-gallon into 3-gallon jug (which already has 2 gallons)**
   - The 3-gallon jug can only hold 1 more gallon
   - This leaves exactly 4 gallons in the 5-gallon jug!
   - 5-gallon jug: 4 gallons ✓
   - 3-gallon jug: 3 gallons

**Evaluation:**
This solution works! I successfully measured 4 gallons. The key insight was realizing I needed to create a 1-gallon difference, which I achieved by using the 3-gallon jug as a "measuring tool" to remove exactly 1 gallon from the 5-gallon jug.`
          }
        ]
      }
    };

    // Default reasoning template for general questions
    this.defaultTemplate = {
      systemPrompt: `You are an intelligent assistant that uses chain of thought reasoning. When answering questions:

1. **Think through the question carefully**
2. **Show your reasoning process**
3. **Consider multiple perspectives**
4. **Explain your logic step by step**
5. **Arrive at a well-reasoned conclusion**

Format your response as:
**Initial Thoughts:** [What is this question asking? What do I need to consider?]
**Reasoning Process:** [Step-by-step thinking]
**Conclusion:** [Final answer with supporting reasoning]`,
      examples: [
        {
          question: "Why is it important to learn multiple languages?",
          response: `**Initial Thoughts:**
This question asks about the value of multilingualism. I should consider cognitive, social, economic, and cultural benefits. Let me think through each category systematically.

**Reasoning Process:**

1. **Cognitive Benefits:**
   - Research shows bilingual brains are more flexible
   - Switching between languages exercises executive function
   - May delay onset of dementia and Alzheimer's
   - Improves problem-solving and multitasking abilities

2. **Social and Cultural Benefits:**
   - Enables direct communication with more people
   - Provides deeper understanding of other cultures
   - Reduces cultural barriers and prejudices
   - Allows access to literature, media, and ideas in original form

3. **Economic Advantages:**
   - Increases job opportunities in global economy
   - Higher earning potential in many fields
   - Valuable skill in international business
   - Opens doors to work in different countries

4. **Personal Growth:**
   - Builds confidence and adaptability
   - Enhances travel experiences
   - Provides new ways of thinking and expression
   - Creates sense of accomplishment

**Conclusion:**
Learning multiple languages is valuable because it provides cognitive benefits (improved brain function), social advantages (better cultural understanding), economic opportunities (career advancement), and personal growth (enhanced worldview). The investment in language learning pays dividends across multiple aspects of life.`
        }
      ]
    };
  }

  /**
   * Analyze the user message to determine the most appropriate reasoning template
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
      template: this.defaultTemplate
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
   * Generate chain of thought prompt with reasoning guidance
   */
  generatePrompt(userMessage, options = {}) {
    const analysis = this.analyzeMessageType(userMessage);

    // Allow manual override of prompt type
    if (options.promptType && this.promptTemplates[options.promptType]) {
      analysis.type = options.promptType;
      analysis.template = this.promptTemplates[options.promptType];
    }

    // Build the chain of thought prompt
    let systemPrompt = analysis.template.systemPrompt;

    // Add reasoning examples if available
    if (analysis.template.examples && analysis.template.examples.length > 0) {
      systemPrompt += `\n\n**Example of Chain of Thought Reasoning:**\n`;

      const example = analysis.template.examples[0]; // Use first example
      systemPrompt += `\nHuman: ${example.question}\n\n`;
      systemPrompt += `Assistant: ${example.response}\n\n`;
      systemPrompt += `---\n\n`;
    }

    systemPrompt += `Now, please apply the same chain of thought reasoning to the following question. Show your thinking process step by step:`;

    // Enhance the user message with reasoning prompts
    let enhancedUserMessage = userMessage;

    // Add specific reasoning instructions based on message type
    if (analysis.type === 'math') {
      enhancedUserMessage += "\n\nPlease show your mathematical reasoning step by step, explaining why you choose each approach.";
    } else if (analysis.type === 'science') {
      enhancedUserMessage += "\n\nPlease explain the scientific reasoning behind your answer, including cause-and-effect relationships.";
    } else if (analysis.type === 'logic') {
      enhancedUserMessage += "\n\nPlease show your logical reasoning process, identifying premises and conclusions.";
    } else if (analysis.type === 'problem_solving') {
      enhancedUserMessage += "\n\nPlease think through this problem step by step, explaining your strategy and reasoning.";
    } else {
      enhancedUserMessage += "\n\nPlease think through this question step by step and show your reasoning process.";
    }

    // Add difficulty level adjustment if specified
    if (options.level) {
      const levelInstructions = {
        beginner: "Please use simple reasoning steps that are easy to follow.",
        intermediate: "Please provide detailed reasoning with clear explanations.",
        advanced: "Please show sophisticated reasoning with nuanced analysis."
      };

      if (levelInstructions[options.level]) {
        enhancedUserMessage += `\n\n${levelInstructions[options.level]}`;
      }
    }

    // Add reasoning depth option
    if (options.reasoningDepth) {
      const depthInstructions = {
        shallow: "Please provide a brief reasoning process focusing on key steps.",
        moderate: "Please provide a thorough reasoning process with clear explanations.",
        deep: "Please provide an in-depth reasoning process, considering multiple perspectives and potential alternatives."
      };

      if (depthInstructions[options.reasoningDepth]) {
        enhancedUserMessage += `\n\n${depthInstructions[options.reasoningDepth]}`;
      }
    }

    return {
      systemPrompt,
      enhancedUserMessage,
      analysisType: analysis.type,
      confidence: analysis.confidence,
      reasoningType: 'chain-of-thought',
      example: analysis.template.examples ? analysis.template.examples[0] : null
    };
  }

  /**
   * Get available reasoning types
   */
  getAvailableTypes() {
    return Object.keys(this.promptTemplates);
  }

  /**
   * Get example for a specific reasoning type
   */
  getExampleForType(type) {
    if (this.promptTemplates[type] && this.promptTemplates[type].examples) {
      return this.promptTemplates[type].examples[0];
    }
    return this.defaultTemplate.examples[0];
  }

  /**
   * Generate task-specific chain of thought prompt
   */
  generateTaskSpecificPrompt(taskType, userMessage, options = {}) {
    const taskReasoningTemplates = {
      explanation: {
        instruction: "Explain the following concept using chain of thought reasoning. Break down complex ideas into logical steps and show how each part connects to the whole.",
        reasoningPrompt: "Think through this explanation step by step: What are the key components? How do they relate? What examples would help?"
      },
      problem_solving: {
        instruction: "Solve the following problem using chain of thought reasoning. Show your problem-solving strategy and explain each step.",
        reasoningPrompt: "Think through this problem systematically: What's the goal? What information do I have? What approach should I use? How can I verify my solution?"
      },
      analysis: {
        instruction: "Analyze the following topic using chain of thought reasoning. Break down the analysis into logical components.",
        reasoningPrompt: "Think through this analysis step by step: What are the key factors? How do they interact? What patterns emerge? What conclusions can I draw?"
      },
      comparison: {
        instruction: "Compare and contrast the following using chain of thought reasoning. Show your analytical process.",
        reasoningPrompt: "Think through this comparison systematically: What criteria should I use? What are the similarities and differences? What's the significance of these comparisons?"
      },
      evaluation: {
        instruction: "Evaluate the following using chain of thought reasoning. Show your evaluation criteria and process.",
        reasoningPrompt: "Think through this evaluation step by step: What criteria matter? How do I weigh different factors? What evidence supports my judgment?"
      }
    };

    const taskTemplate = taskReasoningTemplates[taskType] || {
      instruction: "Address the following using chain of thought reasoning.",
      reasoningPrompt: "Think through this step by step and show your reasoning process."
    };

    // Use the base analysis for the message type
    const analysis = this.analyzeMessageType(userMessage);

    // Build enhanced system prompt
    let systemPrompt = `You are an expert assistant specializing in chain of thought reasoning. ${taskTemplate.instruction}

Use this reasoning format:
**Initial Analysis:** [What is being asked? What type of reasoning is needed?]
**Step-by-Step Thinking:** [Show your reasoning process clearly]
**Synthesis:** [Bring together your reasoning into a coherent response]
**Conclusion:** [Final answer with supporting reasoning]`;

    // Add example if available
    if (analysis.template.examples && analysis.template.examples.length > 0) {
      systemPrompt += `\n\n**Example of this reasoning approach:**\n`;
      const example = analysis.template.examples[0];
      systemPrompt += `Human: ${example.question}\n\nAssistant: ${example.response.substring(0, 500)}...\n\n---\n`;
    }

    const enhancedMessage = `${taskTemplate.instruction}\n\n${userMessage}\n\n${taskTemplate.reasoningPrompt}`;

    return {
      systemPrompt,
      enhancedUserMessage: enhancedMessage,
      analysisType: analysis.type,
      confidence: analysis.confidence,
      taskType,
      reasoningType: 'chain-of-thought',
      example: analysis.template.examples ? analysis.template.examples[0] : null
    };
  }

  /**
   * Add custom reasoning template
   */
  addCustomTemplate(name, pattern, systemPrompt, examples) {
    this.promptTemplates[name] = {
      pattern: new RegExp(pattern, 'i'),
      systemPrompt,
      examples: Array.isArray(examples) ? examples : [examples]
    };
  }
}

export default ChainOfThoughtPromptEngine;
