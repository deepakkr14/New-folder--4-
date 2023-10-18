const express = require("express");
const http = require("http");
const socketIo = require("socket.io");


const app = express();
app.use(express.static(__dirname + '/public'));
const server = http.createServer(app);
const io = socketIo(server);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const chatRoute = require('./routes/chat');
const userRoute = require('./routes/user-routes');
app.use(chatRoute)
app.use(userRoute)

app.get("/", (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + "/public/signup.html");
});

io.on("connection", (socket) => {
  console.log(`A user connected with socket id-- ${socket.id}`);
  console.log(" %s sockets connected", io.engine.clientsCount);
  socket.on("private message", (msg) => {
    console.log(msg);
    // io.to(msg.room).emit("chat message", msg.message); // Broadcast the message to all connected clients
   socket.broadcast.to(`${msg.room}`).emit('chat message',{message:msg.message,name:msg.name});
  });
  socket.on("join room", (rid) => {
    console.log("Joining Room", rid, "with Socket Id:", socket.id);
    socket.join(rid);
  });
  socket.on("leave room", (rid) => {
    console.log(
      "Leaving Room",
      rid,
      "with Socket Id:",
      socket.id,
    );
    socket.leave(rid);
    // socket.leaveAll()
  });
socket.on("invite",(email)=>{
  console.log(email,"invited you")
  socket.to(email.username).emit('request',{email})
})
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server listening on *:3000");
});
