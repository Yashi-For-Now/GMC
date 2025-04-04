import express from "express";
import http from "http";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 5000;
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, peerId }) => {
    socket.peerId = peerId;
    socket.join(roomId);
    socket.roomId = roomId;
    socket.to(roomId).emit("user-connected", peerId);
  });
  //difference between socket.to and io.to
  socket.on("chat-message", (message) => {
    const roomId = socket.roomId;
    if (roomId) {
      io.to(roomId).emit("receive-message", { userId: socket.id, message });
    }
  });
  socket.on("disconnect", () => {
    socket.to(socket.roomId).emit("remove-user", socket.peerId);
  });
});

app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
