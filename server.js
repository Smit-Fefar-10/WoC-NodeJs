// const express = require('express');
// const { createServer } = require('node:http');
// const { join } = require('node:path');
// const { Server } = require('socket.io');

// const app = express();
// const server = createServer(app);
// const io = new Server(server);
const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io2 = require("socket.io")(server);
const users = {};

const PORT = 5500;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static(path.resolve(".")));
app.get("http://localhost:5500/", (req, res) => {
  res.sendFile("C:/Users/Smit/Desktop/WOC6.0/index.html");
});

io2.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle join room event
  socket.on("joinRoom", ({ username, roomId }) => {
    // Join the room
    socket.join(roomId);

    // Save the username and corresponding room ID
    users[socket.id] = { username, roomId };

    // Emit the updated user list to all clients in the room
    io2.to(roomId).emit("userList", getUserList(roomId));

    // Emit a response to the user who joined the room
    socket.emit(
      "joinRoomResponse",
      `Welcome, ${username}! You joined room ${roomId}`
    );
  });
  socket.on("createroom", ({ username }) => {
    // Join the room
    // Generate a random integer between 2 and 1000
    const roomId = Math.floor(Math.random() * (1000 - 2 + 1) + 2);
    socket.join(roomId);
    console.log(roomId);
    // Save the username and corresponding room ID
    users[socket.id] = { username, roomId };

    // Emit the updated user list to all clients in the room
    io2.to(roomId).emit("userList", getUserList(roomId));

    // Emit a response to the user who joined the room
    socket.emit(
      "joinRoomResponse",
      `Welcome, ${username}! You joined room ${roomId}`
    );
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the user from the users object
    const { username, roomId } = users[socket.id] || {};
    delete users[socket.id];

    // Emit the updated user list to all clients in the room
    if (username && roomId) {
      io2.to(roomId).emit("userList", getUserList(roomId));
    }
  });
});

// Function to get the list of usernames in a room
function getUserList(roomId) {
  return Object.values(users)
    .filter((user) => user.roomId === roomId)
    .map((user) => user.username);
}
