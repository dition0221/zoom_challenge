const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
// Connection to server
const frontSocket = new WebSocket(`ws://${window.location.host}`);

/* Capsulize send message to Back-End */
function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

/* Socket connection events */
// Connect
frontSocket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
// Message
frontSocket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.appendChild(li);
});
// Disconnect
frontSocket.addEventListener("close", () => {
  console.log("Disconnected to Server ❌");
});

/* Send message */
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  frontSocket.send(makeMessage("new_message", input.value));
  input.value = "";
});

/* Nickname */
nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  frontSocket.send(makeMessage("nickname", input.value));
  // Display nickname
  const oldNickname = nicknameForm.querySelector("span");
  if (oldNickname) nicknameForm.removeChild(oldNickname);
  const newNickname = document.createElement("span");
  newNickname.innerText = ` ✅ ${input.value}`;
  nicknameForm.appendChild(newNickname);
});
