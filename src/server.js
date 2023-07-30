import express from "express";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

/* 서버 생성 */
const app = express();
const PORT = 4040;

/* Settings */
// Pug
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
// JavaScript
app.use("/public", express.static(__dirname + "/public"));

/* Routes */
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

/* WebSocket server settings */
const httpServer = http.createServer(app); // HTTP Server
// Socket.io Server
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
  mode: "development",
});

/* Socket.io Events */
wsServer.on("connection", (socket) => {
  // Join room
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  // Connect RTC: Offer
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  // Connect RTC: Answer
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  // Connect RTC: Candidate
  socket.on("ice", (candidate, roomName) => {
    socket.to(roomName).emit("ice", candidate);
  });
});

/* 서버 실행 */
httpServer.listen(PORT, () =>
  console.log(`✅ Server Connected: http://localhost:${PORT}`)
);
