function App() {
  return (
    <main>
      <div id="game-container">
        {/* Players */}
        <ol id="players">
          <li>
            <span className="player">
              <span className="player-name">Player 1</span>
              <span className="player-icon">X</span>
            </span>

            <button>Edit</button>
          </li>
          <li>
            <span className="player">
              <span className="player-name">Player 2</span>
              <span className="player-icon">O</span>
            </span>
            <button>Edit</button>
          </li>
        </ol>

        {/* Game Board */}
      </div>

      {/* Game Logs */}
    </main>
  );
}

export default App;
