import RTFCFramework from '../frameworks/rtfc.js';
import dotenv from "dotenv";

dotenv.config();

// Initialize RTFC Framework
const rtfcFramework = new RTFCFramework();

// Load initial knowledge base
await initializeKnowledgeBase();

async function initializeKnowledgeBase() {
  // Add some initial study-related knowledge
  await rtfcFramework.addKnowledge('photosynthesis', 
    'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. The equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2');
  
  await rtfcFramework.addKnowledge('gravity', 
    'Gravity is a fundamental force that attracts objects with mass. Newton\'s law of universal gravitation: F = G(m1*m2)/r². On Earth, acceleration due to gravity is approximately 9.8 m/s²');
  
  await rtfcFramework.addKnowledge('cell structure', 
    'Basic cell components include: cell membrane (controls entry/exit), nucleus (contains DNA), cytoplasm (gel-like substance), mitochondria (powerhouse), ribosomes (protein synthesis)');
  
  await rtfcFramework.addKnowledge('water cycle', 
    'The water cycle includes: evaporation (liquid to gas), condensation (gas to liquid), precipitation (rain/snow), and collection (water gathering in bodies of water)');
  
  await rtfcFramework.addKnowledge('quadratic formula', 
    'The quadratic formula solves ax² + bx + c = 0: x = (-b ± √(b²-4ac))/2a. The discriminant (b²-4ac) determines the number of real solutions');
  
  await rtfcFramework.addKnowledge('world war 1', 
    'WWI (1914-1918) was caused by militarism, alliances, nationalism, imperialism, and the assassination of Archduke Franz Ferdinand. Major powers included Germany, Austria-Hungary vs Britain, France, Russia, USA');

  console.log('✅ RTFC Knowledge base initialized');
}

/**
 * Enhanced chat function using RTFC framework
 */
export async function chatWithAI(userMessage, options = {}) {
  try {
    const result = await rtfcFramework.chat(userMessage, options);
    
    // Log framework usage for debugging
    if (result.toolsUsed.length > 0) {
      console.log(`🔧 Tools used: ${result.toolsUsed.join(', ')}`);
    }
    if (result.knowledgeUsed) {
      console.log(`📚 Knowledge retrieved: ${result.sources.length} sources`);
    }
    
    return result.response;
  } catch (error) {
    console.error("RTFC Gemini Service Error:", error);
    throw error;
  }
}

/**
 * Get detailed response with metadata
 */
export async function chatWithAIDetailed(userMessage, options = {}) {
  try {
    return await rtfcFramework.chat(userMessage, options);
  } catch (error) {
    console.error("RTFC Gemini Service Error:", error);
    throw error;
  }
}

/**
 * Add new knowledge to the framework
 */
export async function addKnowledge(topic, content) {
  return await rtfcFramework.addKnowledge(topic, content);
}

/**
 * Register a new tool
 */
export function registerTool(name, toolConfig) {
  return rtfcFramework.registerTool(name, toolConfig);
}

/**
 * Get available tools
 */
export function getAvailableTools() {
  return Array.from(rtfcFramework.tools.keys());
}

export default rtfcFramework;
