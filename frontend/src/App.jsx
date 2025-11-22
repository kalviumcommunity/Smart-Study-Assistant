import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ZeroShotPrompt from './components/ZeroShotPrompt'
import OneShotPrompt from './components/OneShotPrompt'
import MultiShotPrompt from './components/MultiShotPrompt'
import ChainOfThoughtPrompt from './components/ChainOfThoughtPrompt'
import FlashcardGenerator from './components/FlashcardGenerator'

function App() {
  const [activeTab, setActiveTab] = useState('zero-shot')
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  // Check backend connection on app load
  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/chat/types`)
      if (response.ok) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      console.error('Backend connection failed:', error)
      setConnectionStatus('error')
    }
  }

  const renderContent = () => {
    if (connectionStatus === 'checking') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to backend...</p>
          </div>
        </div>
      )
    }

    if (connectionStatus === 'error') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Backend Connection Failed</h3>
            <p className="text-red-600 mb-4">Unable to connect to the backend server.</p>
            <button 
              onClick={checkBackendConnection}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'zero-shot':
        return <ZeroShotPrompt isLoading={isLoading} setIsLoading={setIsLoading} />
      case 'one-shot':
        return <OneShotPrompt isLoading={isLoading} setIsLoading={setIsLoading} />
      case 'multi-shot':
        return <MultiShotPrompt isLoading={isLoading} setIsLoading={setIsLoading} />
      case 'chain-of-thought':
        return <ChainOfThoughtPrompt isLoading={isLoading} setIsLoading={setIsLoading} />
      case 'flashcards':
        return <FlashcardGenerator isLoading={isLoading} setIsLoading={setIsLoading} />
      default:
        return <ZeroShotPrompt isLoading={isLoading} setIsLoading={setIsLoading} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="app-container flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-content flex-1">
          <Header connectionStatus={connectionStatus} />
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
