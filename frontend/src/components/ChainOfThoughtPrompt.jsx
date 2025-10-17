import React, { useState } from 'react'
import { fetchChainOfThought } from '../services/api'

const ChainOfThoughtPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const data = await fetchChainOfThought(prompt)
      setResponse(data.response)
    } catch (error) {
      setResponse('Error: Failed to get response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prompt-container">
      <h2>Chain of Thought Prompting</h2>
      <p className="description">
        Ask complex questions that require step-by-step reasoning. The AI will show its thinking process.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a complex question (e.g., 'Solve this math problem step by step...')"
            rows={4}
            className="prompt-input"
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !prompt.trim()}
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

export default ChainOfThoughtPrompt