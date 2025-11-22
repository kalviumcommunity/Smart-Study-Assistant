import { chatWithAI } from './src/services/gemini.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAPI() {
  console.log('🧪 Testing Gemini API connection...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set ✅' : 'Missing ❌');
  
  try {
    const response = await chatWithAI('Hello, can you help me with math?');
    console.log('✅ API Test Successful!');
    console.log('Response:', response.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.error('Full error:', error);
  }
}

testAPI();