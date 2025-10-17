import React, { useState } from 'react';
import { generateFlashcards } from '../services/api';

const FlashcardGenerator = () => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setGenerated(false);
    
    try {
      const result = await generateFlashcards(topic, count);
      if (result.flashcards) {
        setFlashcards(result.flashcards);
        setCurrentCard(0);
        setFlipped(false);
        setGenerated(true);
      } else {
        setError('Could not generate flashcards in the expected format. Please try again or use different wording.');
      }
    } catch (err) {
      setError('Error generating flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="prompt-container">
      <h2>Flashcard Generator</h2>
      <p className="description">
        Generate flashcards on any topic to help with your studies.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="topic">Topic:</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Photosynthesis, World War II, Python basics)"
            className="prompt-input"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="count">Number of flashcards:</label>
          <input
            id="count"
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 5)}
            className="prompt-input"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !topic.trim()}
        >
          {loading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </form>

      {loading && <div className="loading-spinner"></div>}
      
      {error && <div className="error-message">{error}</div>}
      
      {generated && flashcards.length > 0 && (
        <div className="flashcards-container">
          <div 
            className={`flashcard ${flipped ? 'flipped' : ''}`} 
            onClick={toggleFlip}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <h3>Question:</h3>
                <p>{flashcards[currentCard].front}</p>
                <div className="flashcard-hint">(Click to see answer)</div>
              </div>
              <div className="flashcard-back">
                <h3>Answer:</h3>
                <p>{flashcards[currentCard].back}</p>
                <div className="flashcard-hint">(Click to see question)</div>
              </div>
            </div>
          </div>
          
          <div className="flashcard-navigation">
            <button 
              onClick={prevCard} 
              disabled={currentCard === 0}
              className="nav-btn"
            >
              Previous
            </button>
            <span className="card-counter">
              {currentCard + 1} of {flashcards.length}
            </span>
            <button 
              onClick={nextCard} 
              disabled={currentCard === flashcards.length - 1}
              className="nav-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;