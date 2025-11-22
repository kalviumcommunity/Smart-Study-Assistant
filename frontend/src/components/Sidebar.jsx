import React from 'react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'zero-shot', label: 'Zero-Shot Prompting', icon: '🎯', description: 'Direct AI responses' },
    { id: 'one-shot', label: 'One-Shot Prompting', icon: '💡', description: 'Learning with examples' },
    { id: 'multi-shot', label: 'Multi-Shot Prompting', icon: '🔄', description: 'Multiple examples' },
    { id: 'chain-of-thought', label: 'Chain of Thought', icon: '🧠', description: 'Step-by-step reasoning' },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', description: 'Study cards generator' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">🚀 AI Tutor</h2>
        <p className="sidebar-subtitle">Choose your learning mode</p>
      </div>
      <nav className="nav-menu">
        {navItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={item.description}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-content">
              <span className="nav-label">{item.label}</span>
              <span className="nav-description">{item.description}</span>
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar