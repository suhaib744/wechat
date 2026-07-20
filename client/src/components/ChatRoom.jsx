import React, { useState, useEffect } from "react";
import RoomSidebar from "./RoomSidebar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import OnlineUsers from "./OnlineUsers";
import TypingIndicator from "./TypingIndicator";
import useChatSocket from "../hooks/useChatSocket";
import "./ChatRoom.css";

const ChatRoom = ({ username = "You", initialRoom = "general", onLeave }) => {
  const { socket, isConnected } = useChatSocket();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  const [showUsers, setShowUsers] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [mobileUsers, setMobileUsers] = useState(false);
  const [messages, setMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const handleRecieveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleSystemMessage = (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${payload.time || Date.now()}-${prev.length}`,
          type: "system",
          eventType: payload.type || "info",
          text: payload.text,
          timestamp: payload.time || new Date().toLocaleTimeString(),
        },
      ]);
    };

    const handleRoomUsers = (users) => {
      setRoomUsers(users);
    };

    const handleRoomsUpdate = (updatedRooms) => {
      setRooms(updatedRooms);
    };

    const handleConnect = () => {
      socket.emit("join-room", { username, room: currentRoom }, () => {});
    };

    const handleTyping = (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.username));
      }
    };

    socket.on("recieve_message", handleRecieveMessage);
    socket.on("system-message", handleSystemMessage);
    socket.on("room-users", handleRoomUsers);
    socket.on("rooms-update", handleRoomsUpdate);
    socket.on("connect", handleConnect);
    socket.on("user_typing", handleTyping);

    socket.emit("request-rooms");

    return () => {
      socket.off("recieve_message", handleRecieveMessage);
      socket.off("system-message", handleSystemMessage);
      socket.off("room-users", handleRoomUsers);
      socket.off("rooms-update", handleRoomsUpdate);
      socket.off("connect", handleConnect);
      socket.off("user_typing", handleTyping);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      socket.emit("request-room-users", { room: currentRoom });
    }
  }, [currentRoom, isConnected, socket]);

  const room = rooms.find((r) => r.id === currentRoom) || { id: currentRoom, name: currentRoom, icon: "💬", topic: "" };

  const handleLeaveRoom = () => {
    socket.emit("leave-room", { room: currentRoom }, () => {
      onLeave?.();
    });
  };

  const handleRoomChange = (roomId) => {
    socket.emit("leave-room", { room: currentRoom }, () => {
      setMessages([]);
      setTypingUsers([]);
      setCurrentRoom(roomId);
      socket.emit("join-room", { username, room: roomId }, () => {});
    });
    setMobileSidebar(false);
  };

  return (
    <div className="chat-rooms">
      {!isConnected && (
        <div className="chat-reconnect-banner">
          Reconnecting...
        </div>
      )}
      <div className="chat-mobile-bar">
        <button
          className="chat-mobile-bar__menu-btn"
          aria-label="Open menu"
          onClick={() => setMobileSidebar(true)}
        >
          Menu
        </button>
        <div className="chat-mobile-bar__brand">
          <div className="chat-mobile-bar__logo">
          </div>
          <span>PulseChat</span>
        </div>
        <button
          className="chat-mobile-bar__users-btn"
          aria-label="Show members"
          onClick={() => setMobileUsers(!mobileUsers)}
        >
          Users
        </button>
      </div>

      <RoomSidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onRoomChange={handleRoomChange}
        username={username}
        mobileOpen={mobileSidebar}
        onMobileClose={() => setMobileSidebar(false)}
      />

      <div className="chat-main">
        <header className="chat-header">
          <div className="chat-header__left">
            <span className="chat-header__icon" aria-hidden="true">
              #
            </span>
            <div className="chat-header__info">
              <h2 className="chat-header__name"># {room.name}</h2>
            </div>
          </div>

          <div className="chat-header__actions">
            <button
              className={`chat-header__btn chat-header__btn--desktop ${showUsers ? "chat-header__btn--active" : ""}`}
              title="Toggle member list"
              aria-label="Members"
              onClick={() => setShowUsers(!showUsers)}
            >
              Members
            </button>

            <button
              className="chat-header__btn chat-header__btn--danger"
              title="Leave room"
              aria-label="Leave"
              onClick={handleLeaveRoom}
            >
              Leave
            </button>
          </div>
        </header>

        <div className="chat-body">
          <MessageList messages={messages} currentUser={username} />
          {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
          <MessageInput room={room.id} />
        </div>
      </div>

      {showUsers && <OnlineUsers users={roomUsers.map(u => ({ id: u.socketId, username: u.username, status: 'online' }))} currentUser={username} onClose={() => setShowUsers(false)} />}
      {mobileUsers && (
        <>
          <div
            className="chat-sidebar-overlay active"
            onClick={() => setMobileUsers(false)}
          />
          <OnlineUsers users={roomUsers.map(u => ({ id: u.socketId, username: u.username, status: 'online' }))} currentUser={username} isMobileOpen={true} onClose={() => setMobileUsers(false)} />
        </>
      )}

      {mobileSidebar && (
        <div
          className="chat-sidebar-overlay active"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      <nav className="chat-mobile-rooms" aria-label="Rooms">
        {rooms.map((r) => (
          <button
            key={r.id}
            className={`chat-mobile-rooms__btn ${currentRoom === r.id ? "chat-mobile-rooms__btn--active" : ""}`}
            onClick={() => setCurrentRoom(r.id)}
            aria-label={r.name}
          >
            <span className="chat-mobile-rooms__icon" aria-hidden="true">
              #
            </span>
            <span className="chat-mobile-rooms__label">{r.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ChatRoom;
