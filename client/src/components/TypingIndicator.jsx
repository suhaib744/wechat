import React from 'react'
import './TypingIndicator.css'

const TypingIndicator = ({ users = ['Sarah'] }) => {
  if (!users || users.length === 0) return null

  const text =
    users.length === 1 ? `${users[0]} is typing` :
    users.length === 2 ? `${users[0]} and ${users[1]} are typing` :
    'Several people are typing'

  return (
    <div className="typing-indicator" aria-live="polite" aria-label={text}>
      <div className="typing-indicator__avatar" aria-hidden="true">
        {users[0]?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="typing-indicator__bubble">
        <div className="typing-indicator__dots" aria-hidden="true">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
        <span className="typing-indicator__text">{text}</span>
      </div>
    </div>
  )
}

export default TypingIndicator
