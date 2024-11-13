import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [activePlayer, setActivePlayer] = useState('X');

  function handleSelectSquare(row, col) {
    setActivePlayer(currActivePlayer => currActivePlayer === 'X' ? 'O' : 'X');
    
    setGameTurns(prevTurns => {
      let currentPlayer = 'X';

      // Getting Current player from prev state 
      if (prevTurns.length > 0 && prevTurns[0].player === 'X') {
        currentPlayer = 'O';
      }

      const updatedTurns = [{ 
        player: currentPlayer,
        square: {row, col} 
      }, ...prevTurns];

      return updatedTurns;
    })
  }

  return (
    <main>
      <div id="game-container">
        {/* Players */}
        <ol id="players" className="highlight-player">
          <Player name='Player 1' symbol='X' isActive={activePlayer === 'X'} />
          <Player name='Player 2' symbol='O' isActive={activePlayer === 'O'}/>
        </ol>

        {/* Game Board */}
        <GameBoard turns={gameTurns} onSelectSquare={handleSelectSquare}/>
      </div>

      {/* Game Logs */}
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
