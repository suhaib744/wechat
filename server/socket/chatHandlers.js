const ROOMS = [
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
  },
  {
    id: "web-dev",
    name: "Web Development",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
  },
  {
    id: "cloud-devops",
    name: "DevOps & Cloud",
  },
];

const users = [];

export const handleSocketConnection = (io, socket) => {
  const emitRoomsUpdate = () => {
    const roomsWithCounts = ROOMS.map((r) => {
      const count = users.filter((u) => u.room === r.id).length;
      return { ...r, members: count };
    });
    io.emit("rooms-update", roomsWithCounts);
  };

  const emitRoomsToSocket = () => {
    const roomsWithCounts = ROOMS.map((r) => {
      const count = users.filter((u) => u.room === r.id).length;
      return { ...r, members: count };
    });
    socket.emit("rooms-update", roomsWithCounts);
  };

  emitRoomsToSocket();

  socket.on("request-rooms", () => {
    emitRoomsToSocket();
  });

  socket.on("request-room-users", ({ room }) => {
    const roomUsers = users.filter((u) => u.room === room);
    socket.emit("room-users", roomUsers);
  });

  socket.on("join-room", ({ username, room }, callback) => {
    const userExist = users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (userExist) {
      return callback({
        status: "error",
        message: "Username already exists",
      });
    }

    socket.join(room);

    users.push({
      socketId: socket.id,
      username,
      room,
    });
    
    const roomUsers = users.filter((user) => user.room === room);
    io.to(room).emit("room-users", roomUsers);
    emitRoomsUpdate();

    io.to(room).emit("system-message", {
      type: "join",
      text: `${username} joined the room`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    callback({
      status: "success",
      message: "Joined successfully",
    });
  });

  socket.on("leave-room", ({ room }, callback) => {
    const userIndex = users.findIndex(
      (u) => u.socketId === socket.id && u.room === room,
    );

    if (userIndex === -1) {
      callback?.({ status: "error", message: "User not found" });
      return;
    }

    const user = users[userIndex];
    users.splice(userIndex, 1);
    socket.leave(room);

    io.to(room).emit("system-message", {
      type: "leave",
      text: `${user.username} left the room`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const roomUsers = users.filter((u) => u.room === room);
    io.to(room).emit("room-users", roomUsers);
    emitRoomsUpdate();

    callback?.({ status: "success", message: "Left successfully" });
  });

  socket.on("send_message", (data) => {
    const user = users.find((u) => u.socketId === socket.id);

    if (!user) return;

    const message = {
      id: Date.now(),
      username: user.username,
      text: data.text,
      room: data.room,
      timestamp: data.timestamp,
    };

    io.to(data.room).emit("recieve_message", message);
  });

  socket.on("typing", (data) => {
    const user = users.find((u) => u.socketId === socket.id);
    if (user) {
      socket.to(user.room).emit("user_typing", {
        username: user.username,
        isTyping: data.isTyping
      });
    }
  });

  socket.on("disconnect", () => {
    const index = users.findIndex((u) => u.socketId === socket.id);

    if (index !== -1) {
      const user = users[index];
      users.splice(index, 1);

      if (user && user.room) {
        io.to(user.room).emit("system-message", {
          type: "leave",
          text: `${user.username} left the room`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        
        const roomUsers = users.filter((u) => u.room === user.room);
        io.to(user.room).emit("room-users", roomUsers);
        emitRoomsUpdate();
      }
    }
  });
};
