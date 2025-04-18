import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateGametag } from "../utils/gametags";

const name = generateGametag();

export default function OMStartScreen() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  function handleCreate() {
    navigate("/online-multiplayer", { state: { action: "create", name } });
  }

  function handleJoin() {
    if (!roomId) return alert("Enter Room ID!");
    navigate("/online-multiplayer", {
      state: { action: "join", roomId, name },
    });
  }

  return (
    <div className="home-container">
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
        { name }
      </h1>

      <div className="input-row">
        <button onClick={handleCreate} className="btn-create">
          Create Game
        </button>

        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button onClick={handleJoin} className="btn-join">
          Join Game
        </button>
      </div>
    </div>
  );
}
