import React from "react";
import "./RoomSidebar.css";

const RoomSidebar = ({
  rooms,
  currentRoom,
  onRoomChange,
  username,
  mobileOpen,
  onMobileClose,
}) => {
  const initials = username
    ? username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleRoomClick = (roomId) => {
    onRoomChange?.(roomId);
  };

  return (
    <aside className={`sidebar ${mobileOpen ? "sidebar--mobile-open" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
        </div>
        <span className="sidebar__brand-name">PulseChat</span>
        <button
          className="sidebar__close-btn"
          onClick={onMobileClose}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <div className="sidebar__section-label">
        <span>ROOMS</span>
      </div>

      <nav className="sidebar__rooms" aria-label="Chat rooms">
        {rooms.map((room) => (
          <button
            key={room.id}
            className={`sidebar__room ${currentRoom === room.id ? "sidebar__room--active" : ""}`}
            onClick={() => handleRoomClick(room.id)}
            aria-label={`${room.name} room${room.unread ? `, ${room.unread} unread` : ""}`}
          >

            <div className="sidebar__room-info">
              <span className="sidebar__room-name">{room.name}</span>
              <span className="sidebar__room-members">
                {room.members} online
              </span>
            </div>
            {room.unread > 0 && (
              <span
                className="sidebar__room-badge"
                aria-label={`${room.unread} unread`}
              >
                {room.unread}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar__user">
        <div className="sidebar__avatar" aria-hidden="true">
          <span>{initials}</span>
          <span className="sidebar__avatar-status" />
        </div>
        <div className="sidebar__user-info">
          <span className="sidebar__username">{username || "Anonymous"}</span>
          <span className="sidebar__user-status">🟢 Online</span>
        </div>
      </div>
    </aside>
  );
};

export default RoomSidebar;
