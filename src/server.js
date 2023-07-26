import express from "express";
import http from "http";
import { Server } from "socket.io";

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
const wsServer = new Server(httpServer); // Socket.io Server

/* WebSocket events */
wsServer.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 1000);
  });
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
