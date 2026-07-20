import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { handleSocketConnection } from "./socket/chatHandlers.js";

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  handleSocketConnection(io, socket);
});

server.listen(5000, () => {
  console.log("Server is Running");
});
