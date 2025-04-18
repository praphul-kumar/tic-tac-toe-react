const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // for generating room IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow frontend to connect (adjust for production)
  },
});

const PORT = process.env.PORT || 3000;

const rooms = {}; // { roomId: [socketId1, socketId2] }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new game room
  socket.on('createRoom', (callback) => {
    const roomId = uuidv4().slice(0, 6); // short random ID
    rooms[roomId] = [socket.id];
    socket.join(roomId);
    callback({ roomId });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomId }, callback) => {
    const room = rooms[roomId];

    if (!room || room.length >= 2) {
      callback({ error: 'Room not found or full' });
      return;
    }

    room.push(socket.id);
    socket.join(roomId);
    callback({ success: true });

    // Notify both players the game is starting
    io.to(roomId).emit('startGame', { roomId });
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle player moves
  socket.on('makeMove', ({ roomId, row, col, player }) => {
    socket.to(roomId).emit('opponentMove', { row, col, player });
  });

  // Handle Player Name Change
  socket.on('playerNameChange', ({ roomId, player, newName }) => {
    console.log(`Player Name changed(${roomId}): ${player}: ${newName}`);
    socket.to(roomId).emit('playerNameChanged', { player, newName });
  });

  socket.on('restart', ({ roomId }) => {
    console.log('Reset Game: ', roomId);
    socket.to(roomId).emit('restartGame');
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].indexOf(socket.id);
      if (playerIndex !== -1) {
        rooms[roomId].splice(playerIndex, 1);

        // Notify opponent
        socket.to(roomId).emit("opponentLeft");

        // Clean up room if empty
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }

        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
