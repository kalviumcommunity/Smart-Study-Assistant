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
      console.log('Flashcard result:', result); // Debug log
      
      if (result.flashcards && result.flashcards.length > 0) {
        setFlashcards(result.flashcards);
        setCurrentCard(0);
        setFlipped(false);
        setGenerated(true);
      } else if (result.rawResponse) {
        setError(`Raw response received: ${result.rawResponse.substring(0, 200)}...`);
      } else {
        setError('No flashcards generated. Please try a different topic.');
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
        🃏 Generate interactive flashcards for active recall and spaced repetition learning. Perfect for memorizing key concepts, definitions, and facts.
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
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '300px',
              margin: '20px auto',
              perspective: '1000px',
              cursor: 'pointer'
            }}
          >
            <div className="flashcard-inner" style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
              <div className="flashcard-front" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: '#fff',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>📝 Question</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.5', textAlign: 'center' }}>
                  {flashcards[currentCard]?.front || 'Loading...'}
                </p>
                <div className="flashcard-hint" style={{
                  position: 'absolute',
                  bottom: '10px',
                  fontSize: '12px',
                  opacity: '0.7',
                  color: '#6b7280'
                }}>💡 Click to see answer</div>
              </div>
              <div className="flashcard-back" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                transform: 'rotateY(180deg)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '16px' }}>✅ Answer</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.5', textAlign: 'center' }}>
                  {flashcards[currentCard]?.back || 'Loading...'}
                </p>
                <div className="flashcard-hint" style={{
                  position: 'absolute',
                  bottom: '10px',
                  fontSize: '12px',
                  opacity: '0.8'
                }}>🔄 Click to see question</div>
              </div>
            </div>
          </div>
          
          <div className="flashcard-navigation" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '600px',
            margin: '20px auto 0',
            padding: '0 20px'
          }}>
            <button 
              onClick={prevCard} 
              disabled={currentCard === 0}
              style={{
                backgroundColor: currentCard === 0 ? '#ccc' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: currentCard === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ← Previous
            </button>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              backgroundColor: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              {currentCard + 1} of {flashcards.length}
            </span>
            <button 
              onClick={nextCard} 
              disabled={currentCard === flashcards.length - 1}
              style={{
                backgroundColor: currentCard === flashcards.length - 1 ? '#ccc' : '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: currentCard === flashcards.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;