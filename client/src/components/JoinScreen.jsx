import React, { useState, useEffect } from "react";
import "./JoinScreen.css";
import useChatSocket from "../hooks/useChatSocket";

const JoinScreen = ({ onJoin }) => {
  const { socket } = useChatSocket();
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [focused, setFocused] = useState(null);
  const [isUserExist, setIsUserExist] = useState("");

  useEffect(() => {
    const handleRoomsUpdate = (updatedRooms) => {
      setRooms(updatedRooms);
    };
    socket.on("rooms-update", handleRoomsUpdate);
    socket.emit("request-rooms");
    return () => {
      socket.off("rooms-update", handleRoomsUpdate);
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !room) return;

    socket.emit(
      "join-room",
      {
        username: username.trim(),
        room,
      },
      (res) => {
        if (res.status === "error") {
          console.error(res.message);
          setIsUserExist(res.message);
          return;
        }

        onJoin({
          username: username.trim(),
          room,
        });
      },
    );
  };
  return (
    <div className="join-screen">
      <div className="join-bg" aria-hidden="true">
        <div className="join-bg__grid" />
      </div>

      <div className="join-card">
        <div className="join-card__header">
          <div className="join-card__logo">
          </div>
          <h1 className="join-card__title">weChat</h1>
        </div>

        <form className="join-card__form" onSubmit={handleSubmit}>
          <div
            className={`join-field ${focused === "username" ? "join-field--focused" : ""}`}
          >
            <label className="join-field__label" htmlFor="username-input">
              Your Name
            </label>

            <div className="join-field__wrapper">
              <input
                id="username-input"
                type="text"
                className="join-field__input"
                placeholder="Enter your display name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                maxLength={20}
                autoComplete="off"
              />
              {isUserExist && <p className="user-exist-error">{isUserExist}</p>}
              {username && (
                <span className="join-field__char-count">
                  {username.length}/20
                </span>
              )}
            </div>
          </div>

          <div className="join-field">
            <label className="join-field__label" htmlFor="room-select">
              Choose a Room
            </label>
            <div className="join-field__wrapper">
              <select
                id="room-select"
                className="join-field__input"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="" disabled>Select a room...</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    # {r.name} 
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={`join-btn ${username.trim() && room ? "join-btn--active" : "join-btn--disabled"}`}
            disabled={!username.trim() || !room}
          >
            <span className="join-btn__text">Start Chatting</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinScreen;
