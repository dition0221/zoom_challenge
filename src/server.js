import { Socket } from "dgram";
import express from "express";
import http from "http";
import { parse } from "path";
import { WebSocketServer } from "ws";

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

/* WebSocket 서버 설정 */
const server = http.createServer(app); // HTTP Server
const wss = new WebSocketServer({ server }); // WebSocket Server

/* WebSocket Events */
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

/* 서버 실행 */
server.listen(PORT, () =>
  console.log(`✅ Server Connected: http://localhost:${PORT}`)
);
