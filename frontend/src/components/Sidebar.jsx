import React from 'react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'zero-shot', label: 'Zero-Shot Prompting' },
    { id: 'one-shot', label: 'One-Shot Prompting' },
    { id: 'multi-shot', label: 'Multi-Shot Prompting' },
    { id: 'chain-of-thought', label: 'Chain of Thought' }
  ]

  return (
    <div className="sidebar">
      <nav className="nav-menu">
        {navItems.map(item => (
          <div 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar