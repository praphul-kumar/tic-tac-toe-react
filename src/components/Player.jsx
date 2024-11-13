import { useState } from "react";

export default function Player({ name, symbol, isActive, onNameChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [playerName, setPlayerName] = useState(name);

  function handleChange(event) {
    setPlayerName(event.target.value);
  }

  function handleEditClick() {
    setIsEditing((prev) => !prev);

    if (isEditing) {
      onNameChange(symbol, playerName);
    }
  }

  let btnContent = "Edit";
  let editablePlayerName = <span className="player-name">{playerName}</span>;

  if (isEditing) {
    btnContent = "Save";
    editablePlayerName = (
      <input
        type="text"
        value={playerName}
        placeholder="Player Name"
        onChange={handleChange}
        required
      />
    );
  }

  return (
    <>
      <li className={isActive ? 'active' : ''}>
        <span className="player">
          {editablePlayerName}
          <span className="player-symbol">{symbol}</span>
        </span>

        <button onClick={handleEditClick}>{btnContent}</button>
      </li>
    </>
  );
}
