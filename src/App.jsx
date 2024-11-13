import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";

function App() {
  const [activePlayer, setActivePlayer] = useState('X');

  function handleSelectSquare() {
    setActivePlayer(currActivePlayer => currActivePlayer === 'X' ? 'O' : 'X');
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
        <GameBoard activePlayerSymbol={activePlayer} onSelectSquare={handleSelectSquare}/>
      </div>

      {/* Game Logs */}
    </main>
  );
}

export default App;
