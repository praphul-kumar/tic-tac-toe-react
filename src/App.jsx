import GameBoard from "./components/GameBoard";
import Player from "./components/Player";

function App() {
  return (
    <main>
      <div id="game-container">
        {/* Players */}
        <ol id="players">
          <Player name='Player 1' symbol='X' />
          <Player name='Player 2' symbol='O' />
        </ol>

        {/* Game Board */}
        <GameBoard />
      </div>

      {/* Game Logs */}
    </main>
  );
}

export default App;
