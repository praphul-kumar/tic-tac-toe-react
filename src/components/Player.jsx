import { useState } from "react";

export default function Player({ name, symbol }) {
  const [isEditing, setIsEditing] = useState(false);

  let btnContent = 'Edit';
  let playerName = <span className="player-name">{name}</span>;
  if (isEditing) {
    btnContent = "Save";
    playerName = <input type="text" value={name} placeholder="Player Name" required/>;
  }

  const handleEditClick = () => {
    setIsEditing(prev => !prev);
  }

  return (
    <>
      <li>
        <span className="player">
          {playerName}
          <span className="player-symbol">{symbol}</span>
        </span>

        <button onClick={handleEditClick}>{btnContent}</button>
      </li>
    </>
  );
}
