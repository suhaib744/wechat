import React from "react";
import "./MessageBubble.css";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#6c63ff,#9f44d3)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
];

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getAvatarColor = (name = "User") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_ICONS = {
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
};

const MessageBubble = ({
  message,
  isMine = false,
  isGrouped = false,
}) => {
  const {
    username = "Anonymous",
    text = "",
    timestamp = "",
    status = "sent",
  } = message;

  return (
    <div
      className={[
        "bubble-row",
        isMine ? "bubble-row--mine" : "bubble-row--other",
        isGrouped ? "bubble-row--grouped" : "",
      ].join(" ")}
    >
      {!isMine && (
        <div className="bubble-avatar">
          {!isGrouped ? (
            <div
              className="bubble-avatar__img"
              style={{
                background: getAvatarColor(username),
              }}
            >
              {getInitials(username)}
            </div>
          ) : (
            <div className="bubble-avatar__spacer" />
          )}
        </div>
      )}

      <div className="bubble-content">
        {!isMine && !isGrouped && (
          <span className="bubble-username">
            {username}
          </span>
        )}

        <div
          className={`bubble ${
            isMine ? "bubble--mine" : "bubble--other"
          }`}
        >
          <p className="bubble__text">{text}</p>

          <div className="bubble__meta">
            <span className="bubble__time">
              {timestamp}
            </span>

            {isMine && (
              <span
                className={`bubble__status bubble__status--${status}`}
              >
                {STATUS_ICONS[status]}
              </span>
            )}
          </div>
        </div>
      </div>

      {isMine && (
        <div className="bubble-avatar bubble-avatar--mine">
          {!isGrouped ? (
            <div
              className="bubble-avatar__img"
              style={{
                background: "var(--accent-gradient)",
              }}
            >
              ME
            </div>
          ) : (
            <div className="bubble-avatar__spacer" />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;