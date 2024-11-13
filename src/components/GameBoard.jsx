import { useState } from "react";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GameBoard({ onSelectSquare, turns }) {
  let gameBoard = initialGameBoard;

  for (const turn of turns) {
    const {square, player} = turn;
    const {row, col} = square;

    gameBoard[row][col] = player;
  }

  // const [gameBoard, setGameBoard] = useState(initialGameBoard);

  // function handleSelectedSquare(rowIndex, colIndex) {

  //   // States that depends on objects or arrays shound be updated in an immutable way
  //   setGameBoard((prevBoard) => {
  //     const updatedBoard = [...prevBoard.map(i => [...i])];

  //     updatedBoard[rowIndex][colIndex] = activePlayerSymbol;
  //     return updatedBoard;
  //   });

  //   // Updating player
  //   onSelectSquare();
  // }

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIndex) => (
        <li key={`row-${rowIndex}`}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={`col-${colIndex}`}>
                <button onClick={() => onSelectSquare(rowIndex, colIndex)} disabled={playerSymbol !== null}>{playerSymbol}</button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
