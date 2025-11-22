import React, { useState } from 'react'
import { fetchZeroShot } from '../services/api'

const ZeroShotPrompt = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError('')
    setResponse('')
    
    try {
      const data = await fetchZeroShot(prompt)
      setResponse(data.response)
    } catch (error) {
      console.error('Zero-shot error:', error)
      setError('Failed to get response. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="prompt-container">
      <h2>Zero-Shot Prompting</h2>
      <p className="description">
        🎯 Ask any question directly without examples. Perfect for quick answers, explanations, and general knowledge queries.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question here..."
            rows={4}
            className="prompt-input"
          />
        </div>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Ask AI 🤖'
          )}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      {response && (
        <div className="response-container">
          <h3>🤖 AI Response:</h3>
          <div className="response-content">
            {response}
          </div>
        </div>
      )}
    </div>
  )
}

export default ZeroShotPrompt