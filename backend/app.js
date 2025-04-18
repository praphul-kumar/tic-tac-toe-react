const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid"); // for generating room IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend to connect (adjust for production)
  },
});

const PORT = process.env.PORT || 3000;

// Maintain player names on server
const rooms = {}; // { roomId: { players: { X: name1, O: name2 }, sockets: {} } }

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create a new game room

  socket.on("createRoom", ({ name }, callback) => {
    const roomId = uuidv4().slice(0, 6);

    rooms[roomId] = {
      players: {},
      sockets: {},
    };

    // Assign host as 'X'
    rooms[roomId].players["X"] = name;
    rooms[roomId].sockets["X"] = socket.id;

    socket.symbol = "X";
    socket.roomId = roomId;

    socket.join(roomId);

    console.log(`Room created: ${roomId}, Host: ${socket.id}`);

    callback({ roomId, symbol: "X", gametag: name });
  });

  socket.on("joinRoom", ({ name, roomId }, callback) => {
    const room = rooms[roomId];

    if (!room) {
      return callback({ error: "Room does not exist." });
    }

    // Check if room is full
    const playerCount = Object.keys(room.players).length;
    if (playerCount >= 2) {
      return callback({ error: "Room is full." });
    }

    // Assign symbol 'O' (since 'X' is already taken)
    const symbol = room.players.X ? "O" : "X";

    // Save player and socket
    room.players[symbol] = name;
    room.sockets[symbol] = socket.id;

    socket.symbol = symbol;
    socket.roomId = roomId;

    socket.join(roomId);
    console.log(`Player ${symbol} joined room: ${roomId}`);

    // Notify the joining player
    callback({ success: true, roomId, symbol, gametag: name });

    // Notify existing player to start the game
    socket.to(roomId).emit("startGame", {
      players: room.players,
    });

    // Also notify joining player
    socket.emit("startGame", {
      players: room.players,
    });
  });

  socket.on("playerNameChange", ({ roomId, player, newName }) => {
    if (rooms[roomId]) {
      rooms[roomId].players[player] = newName;
      socket.to(roomId).emit("playerNameChanged", { player, newName });
    }
  });

  // Handle player moves
  socket.on("makeMove", ({ roomId, row, col, player }) => {
    socket.to(roomId).emit("opponentMove", { row, col, player });
  });

  socket.on("restart", ({ roomId }) => {
    console.log("Reset Game: ", roomId);
    socket.to(roomId).emit("restartGame");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const roomId = socket.roomId;
    const symbol = socket.symbol;

    if (roomId && rooms[roomId]) {
      const room = rooms[roomId];

      // Notify the other player
      socket.to(roomId).emit("opponentLeft");

      // Remove the disconnected player
      delete room.players[symbol];
      delete room.sockets[symbol];

      // If room is empty, delete it
      const isEmpty = Object.keys(room.sockets).length === 0;
      if (isEmpty) {
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted (empty)`);
      } else {
        // If host (X) left, promote O to X
        if (symbol === "X" && room.sockets.O) {
          room.sockets.X = room.sockets.O;
          room.players.X = room.players.O;
          delete room.sockets.O;
          delete room.players.O;

          // Notify new host (optional)
          const newHostSocket = io.sockets.sockets.get(room.sockets.X);
          if (newHostSocket) {
            newHostSocket.symbol = "X";
            newHostSocket.emit("promotedToHost");
          }
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
