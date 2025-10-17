import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ZeroShotPrompt from './components/ZeroShotPrompt'
import OneShotPrompt from './components/OneShotPrompt'
import MultiShotPrompt from './components/MultiShotPrompt'
import ChainOfThoughtPrompt from './components/ChainOfThoughtPrompt'

function App() {
  const [activeTab, setActiveTab] = useState('zero-shot')

  const renderContent = () => {
    switch (activeTab) {
      case 'zero-shot':
        return <ZeroShotPrompt />
      case 'one-shot':
        return <OneShotPrompt />
      case 'multi-shot':
        return <MultiShotPrompt />
      case 'chain-of-thought':
        return <ChainOfThoughtPrompt />
      default:
        return <ZeroShotPrompt />
    }
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Header />
        {renderContent()}
      </div>
    </div>
  )
}

export default App
