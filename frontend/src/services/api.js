import axios from 'axios';

const API_URL = 'https://smart-study-assistant-hfqr.onrender.com';

export const fetchZeroShot = async (prompt) => {
  try {
    const response = await axios.post(`${API_URL}/chat/zero-shot`, { message: prompt });
    return { response: response.data.reply };
  } catch (error) {
    console.error('Error in zero-shot API call:', error);
    throw error;
  }
};

export const fetchOneShot = async (prompt, example) => {
  try {
    const response = await axios.post(`${API_URL}/chat/one-shot`, { message: prompt, example });
    return { response: response.data.reply };
  } catch (error) {
    console.error('Error in one-shot API call:', error);
    throw error;
  }
};

export const fetchMultiShot = async (prompt, examples) => {
  try {
    const response = await axios.post(`${API_URL}/chat/multi-shot`, { message: prompt, examples });
    return { response: response.data.reply };
  } catch (error) {
    console.error('Error in multi-shot API call:', error);
    throw error;
  }
};

export const fetchChainOfThought = async (prompt) => {
  try {
    const response = await axios.post(`${API_URL}/chat/chain-of-thought`, { message: prompt });
    return { response: response.data.reply };
  } catch (error) {
    console.error('Error in chain-of-thought API call:', error);
    throw error;
  }
};

export const generateFlashcards = async (topic, count = 5) => {
  try {
    // Using chain of thought for better structured flashcards
    const prompt = `Create ${count} flashcards about "${topic}". 
    For each flashcard, provide:
    1. A clear question on the front
    2. A concise but comprehensive answer on the back
    3. Format as JSON with this structure: 
    [
      {"front": "Question here", "back": "Answer here"},
      ...
    ]
    Make sure the content is educational, accurate, and helpful for studying.`;
    
    const response = await axios.post(`${API_URL}/chat/chain-of-thought`, { message: prompt });
    
    // Try to parse the response as JSON if it contains JSON structure
    try {
      const jsonMatch = response.data.reply.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return { flashcards: JSON.parse(jsonStr), rawResponse: response.data.reply };
      }
    } catch (parseError) {
      console.error('Error parsing flashcards JSON:', parseError);
    }
    
    // Return the raw response if JSON parsing fails
    return { rawResponse: response.data.reply };
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};