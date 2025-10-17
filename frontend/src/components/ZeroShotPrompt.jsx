import React, { useState } from 'react'
import { fetchZeroShot } from '../services/api'

const ZeroShotPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const data = await fetchZeroShot(prompt)
      setResponse(data.response)
    } catch (error) {
      setResponse('Error: Failed to get response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prompt-container">
      <h2>Zero-Shot Prompting</h2>
      <p className="description">
        Ask any question without providing examples. The AI will respond based on its knowledge.
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

export default ZeroShotPrompt