import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import Player from "../components/Player";
import Log from "../components/Log";
import GameOver from "../components/GameOver";
import {
  deriveActivePlayer,
  deriveGameBoard,
  deriveWinner,
} from "../utils/gameLogic";

import { LOCAL_PLAYERS } from "../config/constants";

// TODO: Update Socket.io Path if deployed
const socket = io("http://localhost:3000");

export default function OnlineMultiplayer() {
  const location = useLocation();
  const { action, roomId: passedRoomId, name } = location.state || {};

  const [players, setPlayers] = useState(LOCAL_PLAYERS);
  const [winner, setWinner] = useState(null);
  const [gametag, setGametag] = useState("");
  const [symbol, setSymbol] = useState("");
  const [gameTurns, setGameTurns] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const symbolRef = useRef(symbol);

  useEffect(() => {
    symbolRef.current = symbol;
  }, [symbol]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const derivedWinner = deriveWinner(players, gameBoard);
  const finalWinner = winner || derivedWinner;

  console.log(`Winner: ${finalWinner}`);
  const hasDraw = gameTurns.length === 9 && !finalWinner;

  useEffect(() => {
    if (action === "create") {
      socket.emit("createRoom", { name: name }, ({ roomId, symbol, gametag }) => {
        setRoomId(roomId);
        // setPlayers(players);
        setGametag(gametag);
        setSymbol(symbol);
        setMessage("Waiting for opponent to join...");
      });
    } else if (action === "join") {
      socket.emit("joinRoom", { roomId: passedRoomId, name: name }, (response) => {
        if (response.error) {
          alert(response.error);
        } else {
          setRoomId(response.roomId);
          setGametag(response.gametag);
          // setPlayers(response.players);
          setSymbol(response.symbol);
          setJoined(response.success);
        }
      });
    }

    // Opponent joined
    socket.on("startGame", ({ players }) => {
      setPlayers(players);
      setMessage("Game started!");
      setJoined(true);
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
      console.log("Setting winner to null");
      setWinner(null);
      setGameTurns([]);
    });

    socket.on("opponentLeft", () => {
      setMessage("Opponent left the game.");
      // Declare current player as winner
      // setGameTurns([]); // Optional: reset board
      console.log(`Player: ${players[symbolRef.current]}`);
      setWinner(players[symbolRef.current]);

      if (symbolRef.current == "O") {
        console.log("CHanging the Host Player...");
        setSymbol("X");
      }
    });

    return () => {
      socket.off("startGame");
      socket.off("opponentMove");
      socket.off("playerNameChanged");
      socket.off("restartGame");
    };
  }, []);

  function handleSelectSquare(row, col) {
    if (symbol !== activePlayer || gameBoard[row][col] || winner || hasDraw)
      return;

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
    setWinner(null);
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

  if (!joined) {
    return (
      <div className="home-container">
        <h1>Name: {gametag}</h1>
        <h2>Room ID: {roomId}</h2>
        <p className="waiting-message">{message || "Setting up the game..."}</p>
      </div>
    );
  }

  return (
    <div id="game-container">
      <h2>Room ID: {roomId}</h2>
      <p>You are: {gametag} ({symbol})</p>
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

      {(finalWinner || hasDraw) && (
        <GameOver winner={finalWinner} handleRestart={handleRestart} />
      )}

      <GameBoard board={gameBoard} onSelectSquare={handleSelectSquare} />
      <Log turns={gameTurns} />
    </div>
  );
}
