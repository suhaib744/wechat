import React from 'react'
import './OnlineUsers.css'

const AVATAR_COLORS = [
  '#333333',
  '#444444',
  '#555555',
  '#666666',
  '#777777',
]

const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const getAvatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

const UserRow = ({ user, currentUser }) => (
  <div className="ou-user" title={user.username}>
    <div className="ou-user__avatar" style={{ background: getAvatarColor(user.username) }}>
      {getInitials(user.username)}
      <span className={`ou-user__status ou-user__status--${user.status}`} aria-hidden="true" />
    </div>
    <div className="ou-user__info">
      <span className="ou-user__name">
        {user.username}
        {user.username === currentUser && (
          <span className="ou-user__you"> (you)</span>
        )}
      </span>
      {user.isBot && <span className="ou-user__tag">BOT</span>}
      <span className={`ou-user__status-text ou-user__status-text--${user.status}`}>
        {user.status === 'online' ? 'Active now' : 'Away'}
      </span>
    </div>
  </div>
)

const OnlineUsers = ({ users = [], currentUser, isMobileOpen, onClose }) => {
  const displayUsers = users;
  const online = displayUsers.filter(u => u.status === 'online')
  const away   = displayUsers.filter(u => u.status === 'away')

  return (
    <aside className={`online-users ${isMobileOpen ? 'online-users--mobile-open' : ''}`} aria-label="Online Users">
      <div className="ou-header">
        <h3 className="ou-header__title">Members <span className="ou-header__count">{displayUsers.length}</span></h3>
        {onClose && (
          <button className="ou-header__close" onClick={onClose} aria-label="Close members panel">
            ✕
          </button>
        )}
      </div>

      <div className="ou-list">
        {online.length > 0 && (
          <div className="ou-group">
            <div className="ou-group__label">
              <span className="ou-group__dot ou-group__dot--online" aria-hidden="true" />
              ONLINE — {online.length}
            </div>
            {online.map(u => <UserRow key={u.id} user={u} currentUser={currentUser} />)}
          </div>
        )}

        {away.length > 0 && (
          <div className="ou-group">
            <div className="ou-group__label">
              <span className="ou-group__dot ou-group__dot--away" aria-hidden="true" />
              AWAY — {away.length}
            </div>
            {away.map(u => <UserRow key={u.id} user={u} currentUser={currentUser} />)}
          </div>
        )}
      </div>
    </aside>
  )
}

export default OnlineUsers
