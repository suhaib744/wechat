import React, { useEffect } from "react";
import MessageBubble from "./MessageBubble";
import SystemMessage from "./SystemMessage";
import TypingIndicator from "./TypingIndicator";
import "./MessageList.css";
import { socket } from "../socket.js";

const MessageList = ({
  messages = [],
  typingUsers = [],
  currentUser,
}) => {

  return (
    <div
      className="msg-list"
      role="log"
      aria-live="polite"
      aria-label="Messages"
    >
      <div className="msg-list__date-divider">
        <div className="msg-list__date-line"></div>
        <span className="msg-list__date-label">Today</span>
        <div className="msg-list__date-line"></div>
      </div>
     

      <div className="msg-list__messages">
        {messages.map((msg, index) => {
          if (msg.type === "system") {
            return (
              <SystemMessage
                key={msg.id || index}
                text={msg.text}
                type={msg.eventType}
              />
            );
          }

          return (
            <MessageBubble
              key={msg.id || index}
              message={msg}
              isMine={msg.username === currentUser}
              isGrouped={
                index > 0 &&
                messages[index - 1].username === msg.username
              }
            />
          );
        })}

        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
      </div>
    </div>
  );
};

export default MessageList;
