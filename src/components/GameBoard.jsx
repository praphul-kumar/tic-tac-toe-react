import { useState } from "react";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GameBoard() {
  const [gameBoard, setGameBoard] = useState(initialGameBoard);

  function handleSelectedSquare(rowIndex, colIndex) {

    // States that depends on objects or arrays shound be updated in an immutable way
    setGameBoard((prevBoard) => {
      const updatedBoard = [...prevBoard.map(i => [...i])];

      updatedBoard[rowIndex][colIndex] = "X";
      return updatedBoard;
    });
  }

  return (
    <ol id="game-board">
      {gameBoard.map((row, rowIndex) => (
        <li key={`row-${rowIndex}`}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={`col-${colIndex}`}>
                <button onClick={() => handleSelectedSquare(rowIndex, colIndex)}>{playerSymbol}</button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
