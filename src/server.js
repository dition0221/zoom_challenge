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

// Get public rooms
function publicRooms() {
  const { sids, rooms } = wsServer.sockets.adapter;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// Count users in room
function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

/* WebSocket events */
wsServer.on("connection", (socket) => {
  // Init
  socket.nickname = "Anonymous";
  wsServer.sockets.emit("room_change", publicRooms());
  // Middleware - logger
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  // Enter room
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done(countRoom(roomName));
    // info
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  // Before exit room
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });
  // Exit room
  socket.on("disconnect", () => {
    socket.rooms.forEach((room) => {
      wsServer.sockets.emit("room_change", publicRooms());
    });
  });
  // Chatting
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  // Nickname setting
  socket.on("nickname", (nickname) => (socket.nickname = nickname));
});

/*
// WebSocket events
const sockets = []; // fake DB for online chatting
wss.on("connection", (backSocket) => {
  sockets.push(backSocket);
  backSocket.nickname = "Anonymous"; // Nickname default
  // Connect / Disconnect
  console.log("connected to Browser ✅");
  backSocket.on("close", () => {
    console.log("Disconnected from browser ❌");
  });
  // Message
  backSocket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(
            `${backSocket.nickname}: ${message.payload.toString("utf8")}`
          )
        );
        break;
      case "nickname":
        backSocket.nickname = message.payload;
        break;
    }
  });
});
*/

/* 서버 실행 */
httpServer.listen(PORT, () =>
  console.log(`✅ Server Connected: http://localhost:${PORT}`)
);
