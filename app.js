const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log("server on port " + PORT);
});
const io = require("socket.io")(server);

let socketsConnected = new Set();

app.use(express.static(path.join(__dirname, "ClientSide/pages")));
// app.use(express.static(path.join(__dirname, "ClientSide/style")));
// app.use(express.static(path.join(__dirname, "ClientSide/script")));

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("clients-total", socketsConnected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    socketsConnected.delete(socket.id);
    io.emit("clients-total", socketsConnected.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
