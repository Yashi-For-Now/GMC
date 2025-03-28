import express from "express";
import http from "http";
// import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
// import Connection from "./database/db.js";
import cors from "cors";
import { Server } from "socket.io";

// const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 5000;
// dotenv.config();

app.use(cors());

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, peerId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);
  });
});
app.use(express.json());

// const USERNAME = process.env.db_USERNAME;
// const PASSWORD = process.env.db_PASSWORD;

// Connection(USERNAME, PASSWORD);
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB connection error", err));

app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
