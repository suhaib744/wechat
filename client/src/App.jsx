import React, { useState } from 'react'
import JoinScreen from './components/JoinScreen'
import ChatRoom from './components/ChatRoom'

const App = () => {
  const [user, setUser] = useState(null)

  const handleJoin = (data) => setUser(data)
  const handleLeave = () => setUser(null)

  return (
    <div className="app-container">
      {user ? (
        <ChatRoom username={user.username} initialRoom={user.room} onLeave={handleLeave} />
      ) : (
        <JoinScreen onJoin={handleJoin} />
      )}
    </div>
  )
}

export default App