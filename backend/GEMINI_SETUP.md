# Google Gemini API Setup Guide

## 🚀 Quick Setup

Your Smart Study Assistant has been updated to use Google Gemini API instead of OpenAI.

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Update Environment Variables

Update your `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
```

### 3. Test the Setup

Run the test to verify everything is working:

```bash
cd backend
node test-ai.js
```

## 🔧 What Changed

### Files Updated:
- ✅ `src/services/openai.js` → `src/services/gemini.js`
- ✅ `src/routes/chat.js` - Updated import
- ✅ `.env` - Changed to use GEMINI_API_KEY
- ✅ `package.json` - Added @google/genai, removed openai

### API Changes:
- **Model**: Now using `gemini-2.5-flash` (fast and efficient)
- **API**: Google Gemini API (free tier available)
- **Response Format**: Clean, readable text without excessive markdown
- **Performance**: Thinking disabled for faster responses
- **Formatting**: Automatic cleanup of verbose formatting

## 🆓 Benefits of Gemini API

- **Free Tier**: Generous free usage limits
- **Fast**: Gemini 2.5 Flash is optimized for speed
- **Reliable**: Google's infrastructure
- **Study-Friendly**: Great for educational content

## 🧪 Testing

The test file will check:
1. API key configuration
2. Basic chat functionality
3. Math problem solving
4. Educational content generation

## 🔍 Troubleshooting

If you get errors:
- Make sure your API key is correct
- Check that you have internet connection
- Verify the API key has proper permissions
- Check Google AI Studio for usage limits

## 📚 Next Steps

Once the API is working, you can:

### 🖥️ **Command Line Usage (Quick Questions)**
Ask questions directly in the terminal:

```bash
# Detailed responses with formatting
node ask.js What is photosynthesis?
node ask.js Solve 2x + 5 = 15
node ask.js "Explain the water cycle"

# Simple responses (minimal formatting)
node q.js What is DNA?
node q.js How does gravity work?
```

### 🌐 **Server Usage (API Integration)**
- Start your server: `node src/index.js`
- Test the chat endpoint: `POST http://localhost:3000/chat`
- Integrate with your frontend application

### 💡 **Usage Tips**
- Use quotes for multi-word questions: `node ask.js "What are the parts of a cell?"`
- Both tools work with any study topic: math, science, history, literature, etc.
- The `ask.js` tool shows the question and has nice formatting
- The `q.js` tool gives just the answer (great for quick lookups)
