import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import GameBoard from "../components/GameBoard";
import Player from "../components/Player";
import Log from "../components/Log";
import GameOver from "../components/GameOver";
import { deriveActivePlayer, deriveGameBoard, deriveWinner } from '../utils/gameLogic';

import { LOCAL_PLAYERS } from "../config/constants";

// TODO: Update Socket.io Path if deployed
const socket = io("http://localhost:3000");

export default function OnlineMultiplayer() {
  const [players, setPlayers] = useState(LOCAL_PLAYERS);
  const [symbol, setSymbol] = useState("");
  const [gameTurns, setGameTurns] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(players, gameBoard);
  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    // Create or join room
    const id = prompt("Enter room ID (or leave empty to create new):");

    if (id) {
      socket.emit("joinRoom", { roomId: id }, (response) => {
        if (response.error) {
          alert(response.error);
        } else {
          setRoomId(id);
          setSymbol("O");
          setJoined(true);
        }
      });
    } else {
      socket.emit("createRoom", ({ roomId }) => {
        setRoomId(roomId);
        setSymbol("X");
        setMessage("Waiting for opponent to join...");
      });
    }

    // Opponent joined
    socket.on("startGame", () => {
      setJoined(true);
      setMessage("Game started!");
    });

    // Opponent move
    socket.on("opponentMove", ({ row, col, player }) => {
      setGameTurns((prevTurns) => [
        { player, square: { row, col } },
        ...prevTurns,
      ]);
    });

    // Opponent move
    socket.on("playerNameChanged", ({ player, newName }) => {
      console.log(`Updating Player Name: ${player}: ${newName}`);
      setPlayers((prev) => ({
        ...prev,
        [player]: newName,
      }));
    });

    // Restart Game
    socket.on("restartGame", () => {
      setGameTurns([]);
    });

    return () => {
      socket.off("startGame");
      socket.off("opponentMove");
      socket.off("playerNameChanged");
      socket.off("restartGame");
    };
  }, []);

  function handleSelectSquare(row, col) {
    if (symbol !== activePlayer || gameBoard[row][col] || winner || hasDraw) return;

    const turn = { player: symbol, square: { row, col } };

    // Update local board
    setGameTurns((prev) => [turn, ...prev]);

    // Notify opponent
    socket.emit("makeMove", {
      roomId,
      row,
      col,
      player: symbol,
    });
  }

  function handleRestart() {
    // alert("Restart not supported in this demo yet!");
    // You could emit a restart event and reset state.

    setGameTurns([]);

    // Notify opponent
    socket.emit("restart", { roomId });
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prev) => ({
      ...prev,
      [symbol]: newName,
    }));

    console.log(`Updating Player Name: ${symbol}: ${newName}`);

    // Notify Opponent
    socket.emit("playerNameChange", { roomId, player: symbol, newName });
  }

  return (
    <div id="game-container">
      <h2>Room ID: {roomId}</h2>
      <p>You are: {symbol}</p>
      <p>{message}</p>

      <ol id="players" className="highlight-player">
        <Player
          name={players.X}
          symbol="X"
          isActive={activePlayer === "X"}
          onNameChange={handlePlayerNameChange}
        />
        <Player
          name={players.O}
          symbol="O"
          isActive={activePlayer === "O"}
          onNameChange={handlePlayerNameChange}
        />
      </ol>

      {(winner || hasDraw) && (
        <GameOver winner={winner} handleRestart={handleRestart} />
      )}

      <GameBoard board={gameBoard} onSelectSquare={handleSelectSquare} />
      <Log turns={gameTurns} />
    </div>
  );
}
