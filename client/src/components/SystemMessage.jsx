import React from 'react'
import './SystemMessage.css'

const SystemMessage = ({ text = '', type = 'info' }) => {
  const icons = {
    join:  '',
    leave: '',
    info:  '',
    warn:  '',
  }
  const icon = icons[type] || icons.info

  return (
    <div className={`sys-msg sys-msg--${type}`}>
      <div className="sys-msg__line" />
      <span className="sys-msg__content">
        <span className="sys-msg__icon">{icon}</span>
        <span className="sys-msg__text">{text}</span>
      </span>
      <div className="sys-msg__line" />
    </div>
  )
}

export default SystemMessage
