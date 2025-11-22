import axios from 'axios';

// Use environment variable or fallback to deployed backend
const API_URL = import.meta.env.VITE_API_URL || 'https://smart-study-assistant-hfqr.onrender.com';

// Add request interceptor for better error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
    const response = await axios.post(`${API_URL}/chat/flashcards`, { topic, count });
    return response.data;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};