export default function GameOver({ winner, handleRestart }) {
    let content = <p>It's a Draw</p>
    if (winner) {
        content = <p>{winner} Won!</p>
    }

    return (
        <div id="game-over">
            <h2>Game Over!</h2>
            {content}

            <p>
                <button onClick={handleRestart}>Rematch!</button>
            </p>
        </div>
    )
}