import React, { useState } from 'react'
import { fetchMultiShot } from '../services/api'

const MultiShotPrompt = () => {
  const [prompt, setPrompt] = useState('')
  const [examples, setExamples] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || !examples.trim()) return

    setLoading(true)
    try {
      // Split examples by double newlines to create an array
      const examplesArray = examples.split('\n\n').filter(ex => ex.trim())
      const data = await fetchMultiShot(prompt, examplesArray)
      setResponse(data.response)
    } catch (error) {
      setResponse('Error: Failed to get response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prompt-container">
      <h2>Multi-Shot Prompting</h2>
      <p className="description">
        Provide multiple examples to guide the AI's response to your question.
        Separate each example with a blank line.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Examples:</label>
          <textarea
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            placeholder="Enter multiple examples (separate with blank lines):\nQ: What is 2+2? A: 4\n\nQ: What is 3+3? A: 6"
            rows={5}
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
          disabled={loading || !prompt.trim() || !examples.trim()}
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

export default MultiShotPrompt