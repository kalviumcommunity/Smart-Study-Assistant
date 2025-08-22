/**
 * Zero-Shot Prompting Engine
 * Generates intelligent prompts for various types of questions without requiring examples
 */

export class ZeroShotPromptEngine {
  constructor() {
    this.promptTemplates = {
      // Academic subjects
      math: {
        pattern: /(?:solve|calculate|find|equation|formula|math|algebra|geometry|calculus|statistics|\d+[\+\-\*\/]|\=)/i,
        systemPrompt: `You are an expert mathematics tutor. When solving problems:
1. Break down the problem step-by-step
2. Show all work and calculations clearly
3. Explain the reasoning behind each step
4. Provide the final answer clearly
5. If applicable, verify the solution
6. Use proper mathematical notation

Always be thorough but concise in your explanations.`
      },

      science: {
        pattern: /(?:physics|chemistry|biology|science|experiment|hypothesis|theory|atom|molecule|cell|DNA|evolution|gravity|energy|force|reaction)/i,
        systemPrompt: `You are a knowledgeable science educator. When explaining scientific concepts:
1. Start with clear definitions of key terms
2. Explain the underlying principles
3. Use analogies when helpful for understanding
4. Include relevant examples or applications
5. Mention any important formulas or equations
6. Connect concepts to real-world phenomena

Make complex topics accessible while maintaining scientific accuracy.`
      },

      history: {
        pattern: /(?:history|historical|when did|who was|what happened|war|revolution|ancient|medieval|century|BC|AD|empire|civilization)/i,
        systemPrompt: `You are a skilled history teacher. When discussing historical topics:
1. Provide clear chronological context
2. Explain causes and effects of events
3. Include key figures and their roles
4. Describe the broader historical significance
5. Connect events to their time period
6. Use specific dates and locations when relevant

Present information in an engaging, narrative style while remaining factually accurate.`
      },

      language: {
        pattern: /(?:grammar|language|translate|meaning|definition|etymology|pronunciation|syntax|vocabulary|literature|writing|essay)/i,
        systemPrompt: `You are an expert language and literature instructor. When helping with language topics:
1. Provide clear, accurate definitions
2. Include examples in context
3. Explain grammar rules with practical applications
4. Offer writing tips and techniques
5. Discuss literary devices and their effects
6. Help with proper usage and style

Focus on practical understanding and application.`
      },

      programming: {
        pattern: /(?:code|programming|function|variable|loop|array|algorithm|debug|syntax|python|javascript|java|C\+\+|HTML|CSS|SQL|API)/i,
        systemPrompt: `You are an experienced programming mentor. When helping with coding questions:
1. Explain concepts clearly with practical examples
2. Show code snippets when relevant
3. Discuss best practices and common pitfalls
4. Break down complex problems into smaller steps
5. Explain the logic behind solutions
6. Suggest debugging approaches when applicable

Focus on understanding principles, not just providing code.`
      },

      general_study: {
        pattern: /(?:study|learn|understand|explain|help|homework|assignment|test|exam|quiz|review)/i,
        systemPrompt: `You are a dedicated study assistant and tutor. When helping students:
1. Assess what the student needs to understand
2. Break down complex topics into manageable parts
3. Provide clear, step-by-step explanations
4. Offer study strategies and tips
5. Encourage active learning and critical thinking
6. Adapt explanations to the student's level

Always be supportive, patient, and focused on helping the student truly understand the material.`
      },

      creative: {
        pattern: /(?:creative|write|story|poem|essay|brainstorm|idea|imagine|design|art|music)/i,
        systemPrompt: `You are a creative writing and arts mentor. When helping with creative tasks:
1. Encourage original thinking and expression
2. Provide constructive feedback and suggestions
3. Offer techniques and methods for improvement
4. Help overcome creative blocks
5. Discuss different styles and approaches
6. Inspire confidence in creative abilities

Foster creativity while providing practical guidance.`
      }
    };

    this.defaultPrompt = `You are an intelligent and helpful AI assistant. When responding to questions:
1. Analyze the question carefully to understand what's being asked
2. Provide accurate, well-structured information
3. Use clear, concise language appropriate for the context
4. Include relevant details and examples when helpful
5. If the question is ambiguous, ask for clarification
6. Be honest about limitations in your knowledge

Always aim to be helpful, informative, and educational in your responses.`;
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
          systemPrompt: template.systemPrompt
        };
      }
    }

    return {
      type: 'general',
      confidence: 0.5,
      systemPrompt: this.defaultPrompt
    };
  }

  /**
   * Calculate confidence score for pattern matching
   */
  calculateConfidence(message, pattern) {
    const matches = message.match(pattern);
    if (!matches) return 0;
    
    // Simple confidence based on number of matches and message length
    const matchCount = matches.length;
    const messageLength = message.split(' ').length;
    return Math.min(0.9, (matchCount / messageLength) * 2);
  }

  /**
   * Generate enhanced prompt based on message analysis
   */
  generatePrompt(userMessage, options = {}) {
    const analysis = this.analyzeMessageType(userMessage);
    
    // Allow manual override of prompt type
    if (options.promptType && this.promptTemplates[options.promptType]) {
      analysis.type = options.promptType;
      analysis.systemPrompt = this.promptTemplates[options.promptType].systemPrompt;
    }

    // Enhance the user message with context if needed
    let enhancedUserMessage = userMessage;
    
    // Add specific instructions based on message type
    if (analysis.type === 'math' && !userMessage.includes('step')) {
      enhancedUserMessage += "\n\nPlease show your work step by step.";
    } else if (analysis.type === 'science' && userMessage.includes('explain')) {
      enhancedUserMessage += "\n\nPlease include examples to help me understand.";
    } else if (analysis.type === 'programming' && userMessage.includes('code')) {
      enhancedUserMessage += "\n\nPlease explain the logic and include comments.";
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
      systemPrompt: analysis.systemPrompt,
      enhancedUserMessage,
      analysisType: analysis.type,
      confidence: analysis.confidence
    };
  }

  /**
   * Get available prompt types
   */
  getAvailableTypes() {
    return Object.keys(this.promptTemplates);
  }

  /**
   * Add or update a custom prompt template
   */
  addCustomTemplate(name, pattern, systemPrompt) {
    this.promptTemplates[name] = {
      pattern: new RegExp(pattern, 'i'),
      systemPrompt
    };
  }

  /**
   * Generate a prompt for a specific task type
   */
  generateTaskSpecificPrompt(taskType, userMessage, options = {}) {
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

    return this.generatePrompt(enhancedMessage, options);
  }
}

export default ZeroShotPromptEngine;
