import React from "react";
import "./MessageInput.css";
import useChatSocket from "../hooks/useChatSocket";
import { useState, useRef } from "react";

const MessageInput = ({ room, disabled = false }) => {  
  const { socket } = useChatSocket();
  const [message, setMessage] = useState("");
  const typingTimeout = useRef(null);
const handleSubmitMessage = (e) => {
  e.preventDefault();

  if (message.trim() === "") return;

  const messageData = {
    id: Date.now(),
    text: message,
    room,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  socket.emit("send_message", messageData);
  socket.emit("typing", { room, isTyping: false });
  setMessage("");
  if (typingTimeout.current) clearTimeout(typingTimeout.current);
};

const handleTyping = (e) => {
  setMessage(e.target.value);
  socket.emit("typing", { room, isTyping: true });
  
  if (typingTimeout.current) clearTimeout(typingTimeout.current);
  typingTimeout.current = setTimeout(() => {
    socket.emit("typing", { room, isTyping: false });
  }, 2000);
};
  return (
    <div className="msg-input-container">
      <div className={`msg-input${disabled ? " msg-input--disabled" : ""}`}>
        <form onSubmit={handleSubmitMessage}>
          <input
            className="msg-input__textarea"
            placeholder={`Message #${room}...`}
            onChange={handleTyping}
            value={message}
            rows={1}
            aria-label={`Message ${room}`}
          />

          <button
            className="msg-input__send-btn"
            type="submit"
            title="Send (Enter)"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  );
};

export default MessageInput;
