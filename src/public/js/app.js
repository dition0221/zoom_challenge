/* Connect Socket.io */
const socket = io();

const welcome = document.querySelector("#welcome");
const homeForm = welcome.querySelector("form");
const room = document.querySelector("#room");

let roomName = "";

/* f: Add message element */
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

/* Chat message */
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`); // just writer's screen
    input.value = "";
  });
}

/* Set nickname */
function handleNameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

/* Count user in room */
function countUser(count) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${count})`;
}

/* Join room */
function showRoom(count) {
  welcome.hidden = true;
  room.hidden = false;
  countUser(count);
  // Message
  const messageForm = room.querySelector("#message");
  messageForm.addEventListener("submit", handleMessageSubmit);
  // Nickname
  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", handleNameSubmit);
}

/* Enter room */
homeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = homeForm.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room", input.value, (newCount) => {
    showRoom(newCount);
  });
  input.value = "";
});

/* Enter room */
socket.on("welcome", (user, count) => {
  countUser(count);
  addMessage(`${user} arrived :)`);
});

/* Exit room */
socket.on("bye", (user, count) => {
  countUser(count);
  addMessage(`${user} left :(`);
});

/* Chat message */
socket.on("new_message", addMessage); // Send message except writer

/* Room change */
socket.on("room_change", (rooms, count) => {
  // refresh
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  // show
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
