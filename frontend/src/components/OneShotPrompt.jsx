import React, { useState } from 'react'
import { fetchOneShot } from '../services/api'

const OneShotPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const [example, setExample] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || !example.trim()) return

    setLoading(true)
    try {
      const data = await fetchOneShot(prompt, example)
      setResponse(data.response)
    } catch (error) {
      setResponse('Error: Failed to get response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prompt-container">
      <h2>One-Shot Prompting</h2>
      <p className="description">
        Provide one example to guide the AI's response to your question.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Example:</label>
          <textarea
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="Enter an example (e.g., Q: What is 2+2? A: 4)"
            rows={3}
            className="prompt-input"
          />
        </div>
        <div className="input-group">
          <label>Your Question:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question here..."
            rows={3}
            className="prompt-input"
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !prompt.trim() || !example.trim()}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {loading && <div className="loading-spinner"></div>}
      
      {response && (
        <div className="response-container">
          <h3>Response:</h3>
          <div className="response-content">
            {response}
          </div>
        </div>
      )}
    </div>
  )
}

export default OneShotPrompt