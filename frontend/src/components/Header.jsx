import React from 'react'

const Header = ({ connectionStatus }) => {
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢'
      case 'error':
        return '🔴'
      case 'checking':
        return '🟡'
      default:
        return '⚪'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected'
      case 'error':
        return 'Disconnected'
      case 'checking':
        return 'Connecting...'
      default:
        return 'Unknown'
    }
  }

  return (
    <header className="header">
      <div className="logo">
        <h1>🧠 Smart Study Assistant</h1>
      </div>
      <div className="header-right">
        <div className={`connection-status ${connectionStatus}`}>
          <span>{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </div>
        <span className="powered-by">
          ⚡ Powered by Gemini AI
        </span>
      </div>
    </header>
  )
}

export default Header