// Import the Socket.IO library
import io from "socket.io-client";

// Connect to the Socket.IO server
const socket = io("http://localhost:3000");

// Listen for the "connect" event
socket.on("connect", () => {
  console.log("Connected to Socket.IO server!");
});

// Listen for the "message" event
socket.on("message", (data) => {
  console.log("Received message from server:", data);
});

// Send a message to the server
socket.emit("message", "Hello from the client!");
