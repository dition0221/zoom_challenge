/* Connect Socket.io */
const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

/* Enter room */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("done !");
  });
  input.value = "";
});
