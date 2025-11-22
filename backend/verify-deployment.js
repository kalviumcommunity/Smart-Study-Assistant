import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Deployment Verification');
console.log('========================');
console.log('Node Version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 3000);
console.log('API Key Set:', process.env.GEMINI_API_KEY ? 'Yes ✅' : 'No ❌');

try {
  console.log('\n📦 Checking packages...');
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  console.log('Gemini AI package: OK ✅');
  
  if (process.env.GEMINI_API_KEY) {
    console.log('\n🧪 Testing API connection...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log('API Test: OK ✅');
    console.log('Response preview:', result.response.text().substring(0, 50) + '...');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('\n✅ All checks passed!');