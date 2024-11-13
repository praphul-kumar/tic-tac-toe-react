import React from "react";

export default function Log({ turns }) {
  return (
    <ol id="log">
      {turns.map(({ square, player }, index) => (
        <li key={`log-${index}`}>{player} selected {square.row}, {square.col}</li>
      ))}
    </ol>
  );
}
