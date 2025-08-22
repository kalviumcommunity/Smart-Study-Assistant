/**
 * RTFC Framework - Retrieval-Augmented Generation with Tool-calling and Function-calling
 * A comprehensive framework for enhanced AI responses with external data retrieval and tool usage
 */

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

class RTFCFramework {
  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    
    // Knowledge base for retrieval
    this.knowledgeBase = new Map();
    
    // Available tools/functions
    this.tools = new Map();
    
    // Initialize built-in tools
    this.initializeTools();
  }

  /**
   * Initialize built-in tools for the framework
   */
  initializeTools() {
    // Calculator tool
    this.registerTool('calculator', {
      description: 'Perform mathematical calculations',
      parameters: {
        expression: 'string - Mathematical expression to evaluate'
      },
      execute: (params) => this.calculateMath(params.expression)
    });

    // Knowledge retrieval tool
    this.registerTool('knowledge_search', {
      description: 'Search for information in the knowledge base',
      parameters: {
        query: 'string - Search query for knowledge retrieval'
      },
      execute: (params) => this.searchKnowledge(params.query)
    });

    // Study helper tool
    this.registerTool('study_helper', {
      description: 'Get study tips and learning strategies',
      parameters: {
        subject: 'string - Subject area (math, science, history, etc.)',
        topic: 'string - Specific topic within the subject'
      },
      execute: (params) => this.getStudyHelp(params.subject, params.topic)
    });

    // Formula lookup tool
    this.registerTool('formula_lookup', {
      description: 'Look up mathematical and scientific formulas',
      parameters: {
        subject: 'string - Subject area (physics, chemistry, math)',
        concept: 'string - Concept or formula name'
      },
      execute: (params) => this.lookupFormula(params.subject, params.concept)
    });
  }

  /**
   * Register a new tool/function
   */
  registerTool(name, toolConfig) {
    this.tools.set(name, toolConfig);
  }

  /**
   * Add knowledge to the retrieval base
   */
  async addKnowledge(topic, content) {
    this.knowledgeBase.set(topic.toLowerCase(), content);
  }

  /**
   * Load knowledge base from file
   */
  async loadKnowledgeBase(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const knowledge = JSON.parse(data);
      
      for (const [topic, content] of Object.entries(knowledge)) {
        await this.addKnowledge(topic, content);
      }
      
      console.log(`✅ Loaded ${Object.keys(knowledge).length} knowledge entries`);
    } catch (error) {
      console.log(`ℹ️  No existing knowledge base found, starting fresh`);
    }
  }

  /**
   * Enhanced chat function with RTFC capabilities
   */
  async chat(userMessage, options = {}) {
    try {
      // Step 1: Analyze if tools are needed
      const toolAnalysis = await this.analyzeToolNeeds(userMessage);
      
      // Step 2: Execute tools if needed
      let toolResults = [];
      if (toolAnalysis.needsTools) {
        toolResults = await this.executeTools(toolAnalysis.suggestedTools, userMessage);
      }

      // Step 3: Retrieve relevant knowledge
      const retrievedKnowledge = await this.retrieveKnowledge(userMessage);

      // Step 4: Generate enhanced response
      const enhancedResponse = await this.generateEnhancedResponse(
        userMessage, 
        toolResults, 
        retrievedKnowledge,
        options
      );

      return {
        response: enhancedResponse,
        toolsUsed: toolResults.map(t => t.tool),
        knowledgeUsed: retrievedKnowledge.length > 0,
        sources: retrievedKnowledge
      };

    } catch (error) {
      console.error("RTFC Framework Error:", error);
      throw error;
    }
  }

  /**
   * Analyze if the user message needs tool assistance
   */
  async analyzeToolNeeds(message) {
    const lowerMessage = message.toLowerCase();
    const needsTools = {
      calculator: /calculate|solve|compute|math|equation|\+|\-|\*|\/|\^|=/.test(lowerMessage),
      knowledge_search: /what is|define|explain|tell me about/.test(lowerMessage),
      study_helper: /how to study|study tips|learning|memorize/.test(lowerMessage),
      formula_lookup: /formula|equation|law of/.test(lowerMessage)
    };

    const suggestedTools = Object.entries(needsTools)
      .filter(([tool, needed]) => needed)
      .map(([tool]) => tool);

    return {
      needsTools: suggestedTools.length > 0,
      suggestedTools
    };
  }

  /**
   * Execute suggested tools
   */
  async executeTools(toolNames, userMessage) {
    const results = [];
    
    for (const toolName of toolNames) {
      const tool = this.tools.get(toolName);
      if (tool) {
        try {
          const params = await this.extractToolParameters(toolName, userMessage);
          const result = await tool.execute(params);
          results.push({
            tool: toolName,
            result,
            success: true
          });
        } catch (error) {
          results.push({
            tool: toolName,
            error: error.message,
            success: false
          });
        }
      }
    }
    
    return results;
  }

  /**
   * Extract parameters for tool execution
   */
  async extractToolParameters(toolName, message) {
    switch (toolName) {
      case 'calculator':
        // Extract mathematical expression
        const mathMatch = message.match(/(?:solve|calculate|compute)?\s*([0-9+\-*/^().\s=x]+)/i);
        return { expression: mathMatch ? mathMatch[1].trim() : message };
      
      case 'knowledge_search':
        // Extract search query
        const searchMatch = message.match(/(?:what is|define|explain|tell me about)\s+(.+)/i);
        return { query: searchMatch ? searchMatch[1].trim() : message };
      
      case 'study_helper':
        // Extract subject and topic
        const subjects = ['math', 'science', 'history', 'english', 'physics', 'chemistry', 'biology'];
        const foundSubject = subjects.find(s => message.toLowerCase().includes(s)) || 'general';
        return { subject: foundSubject, topic: message };
      
      case 'formula_lookup':
        // Extract subject and concept
        const scienceSubjects = ['physics', 'chemistry', 'math'];
        const foundScienceSubject = scienceSubjects.find(s => message.toLowerCase().includes(s)) || 'physics';
        return { subject: foundScienceSubject, concept: message };
      
      default:
        return { query: message };
    }
  }

  /**
   * Retrieve relevant knowledge from the knowledge base
   */
  async retrieveKnowledge(query) {
    const queryLower = query.toLowerCase();
    const relevantKnowledge = [];

    for (const [topic, content] of this.knowledgeBase.entries()) {
      if (queryLower.includes(topic) || topic.includes(queryLower.split(' ')[0])) {
        relevantKnowledge.push({
          topic,
          content: content.substring(0, 500) // Limit content length
        });
      }
    }

    return relevantKnowledge;
  }

  /**
   * Generate enhanced response using all available information
   */
  async generateEnhancedResponse(userMessage, toolResults, retrievedKnowledge, options) {
    let systemPrompt = "You are a helpful study assistant with access to tools and knowledge base. ";
    
    // Add tool results to context
    if (toolResults.length > 0) {
      systemPrompt += "Tool results: ";
      toolResults.forEach(result => {
        if (result.success) {
          systemPrompt += `${result.tool}: ${result.result}. `;
        }
      });
    }

    // Add retrieved knowledge to context
    if (retrievedKnowledge.length > 0) {
      systemPrompt += "Relevant knowledge: ";
      retrievedKnowledge.forEach(knowledge => {
        systemPrompt += `${knowledge.topic}: ${knowledge.content}. `;
      });
    }

    systemPrompt += "Provide clear, concise, and well-formatted responses. Use the tool results and knowledge to enhance your answer.";

    const response = await this.genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: userMessage }
          ]
        }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    // Clean up the response
    let cleanText = response.text
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,6}\s*/gm, '')
      .replace(/^\s*[\*\-\+]\s*/gm, '• ')
      .replace(/^\s*\d+\.\s*/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+/gm, '')
      .replace(/\s+$/gm, '')
      .trim();

    return cleanText;
  }

  // Tool implementations
  calculateMath(expression) {
    try {
      // Simple math evaluation (in production, use a proper math parser)
      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      const result = eval(sanitized);
      return `Calculation result: ${result}`;
    } catch (error) {
      return `Cannot calculate: ${expression}`;
    }
  }

  searchKnowledge(query) {
    const results = [];
    for (const [topic, content] of this.knowledgeBase.entries()) {
      if (topic.includes(query.toLowerCase()) || content.toLowerCase().includes(query.toLowerCase())) {
        results.push(`${topic}: ${content.substring(0, 200)}...`);
      }
    }
    return results.length > 0 ? results.join('\n') : 'No relevant knowledge found';
  }

  getStudyHelp(subject, topic) {
    const studyTips = {
      math: "Break problems into steps, practice regularly, use visual aids",
      science: "Connect concepts to real-world examples, use diagrams, conduct experiments",
      history: "Create timelines, use mnemonics, connect events to causes and effects",
      english: "Read actively, take notes, discuss with others, practice writing"
    };
    
    return studyTips[subject] || "Create a study schedule, use active recall, and practice regularly";
  }

  lookupFormula(subject, concept) {
    const formulas = {
      physics: {
        gravity: "F = G(m1*m2)/r²",
        velocity: "v = d/t",
        acceleration: "a = (v_f - v_i)/t"
      },
      chemistry: {
        ideal_gas: "PV = nRT",
        density: "ρ = m/V"
      },
      math: {
        quadratic: "x = (-b ± √(b²-4ac))/2a",
        area_circle: "A = πr²"
      }
    };
    
    const subjectFormulas = formulas[subject] || {};
    const conceptKey = Object.keys(subjectFormulas).find(key => 
      concept.toLowerCase().includes(key) || key.includes(concept.toLowerCase())
    );
    
    return conceptKey ? subjectFormulas[conceptKey] : 'Formula not found';
  }
}

export default RTFCFramework;
