/** @type {RTCPeerConnection} */

/* Connect Socket.io */
const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

let myStream;
let isAudio = true;
let isVideo = true;
let roomName;
let myPeerConnection;

/* Show camera list */
async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0].label;
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

/* Get video stream */
async function getMedia(deviceId) {
  const initialConstraint = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraint = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  // show
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraint : initialConstraint
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
}

/* Mute/Unmute */
muteBtn.addEventListener("click", () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  muteBtn.innerText = isAudio ? "Unmute" : "Mute";
  isAudio = isAudio ? false : true;
});

/* Camera on/off */
cameraBtn.addEventListener("click", () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  cameraBtn.innerText = isVideo ? "Turn Camera On" : "Turn Camera Off";
  isVideo = isVideo ? false : true;
});

/* Change camera */
camerasSelect.addEventListener("input", async () => {
  await getMedia(camerasSelect.value); // Create new stream
  // Update video call
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
});

// ============================================================
// [ Room: Welcome form ]

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

/* Start video call */
async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia(); // Show my media screen
  makeConnection(); // Set RTC connection
}

/* Join room */
welcomeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
});

/* Socket Events Code */
// RTC offer
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomName);
});
// RTC answer
socket.on("offer", async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
});
// RTC connect
socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});
// RTC IceCandidate
socket.on("ice", (candidate) => {
  myPeerConnection.addIceCandidate(candidate);
});

/* RTC: Set peer connection */
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  // IceCandidate Event
  myPeerConnection.addEventListener("icecandidate", (data) => {
    socket.emit("ice", data.candidate, roomName);
  });
  // Add stream Event
  if (myPeerConnection.ontrack) {
    myPeerConnection.addEventListener("track", (data) => {
      const peerFace = document.getElementById("peerFace");
      peerFace.srcObject = data.stream;
    });
  } else {
    myPeerConnection.addEventListener("addstream", (data) => {
      const peerFace = document.getElementById("peerFace");
      peerFace.srcObject = data.stream;
    });
  }
  // Add stream tracks on Peer connection
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
