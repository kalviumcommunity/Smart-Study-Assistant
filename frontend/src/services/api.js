import axios from 'axios';

const API_URL = 'http://localhost:3000';

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