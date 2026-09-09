import { useState, useEffect, useRef } from "react";
import "./App.css";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;
const BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT;
const INITIAL_POSITION = 154;
const ONE_STEP = 1;
const MOVE_INTERVAL = 500;

const DIRECTIONS = {
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
  LEFT: "left",
};

const OPPOSITE_DIRECTION = {
  [DIRECTIONS.UP]: DIRECTIONS.DOWN,
  [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
  [DIRECTIONS.DOWN]: DIRECTIONS.UP,
  [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
};

const getNextPosition = (position, direction) => {
  if (direction === DIRECTIONS.UP) {
    return position - BOARD_WIDTH;
  }

  if (direction === DIRECTIONS.DOWN) {
    return position + BOARD_WIDTH;
  }

  if (direction === DIRECTIONS.LEFT) {
    return position - ONE_STEP;
  }

  return position + ONE_STEP;
};

function App() {
  const [snakePosition, setSnakePosition] = useState(INITIAL_POSITION);
  const [gameStarted, setGameStarted] = useState(false);

  const directionRef = useRef(DIRECTIONS.RIGHT);

  const handleKeyDown = (event) => {
    if (!gameStarted) return;

    let newDirection;

    if (event.key === "ArrowUp" || event.key === "w") {
      newDirection = DIRECTIONS.UP;
    } else if (event.key === "ArrowDown" || event.key === "s") {
      newDirection = DIRECTIONS.DOWN;
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      newDirection = DIRECTIONS.LEFT;
    } else if (event.key === "ArrowRight" || event.key === "d") {
      newDirection = DIRECTIONS.RIGHT;
    } else {
      return;
    }

    if (newDirection === OPPOSITE_DIRECTION[directionRef.current]) {
      return;
    }

    directionRef.current = newDirection;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setSnakePosition((position) =>
        getNextPosition(position, directionRef.current),
      );
    }, MOVE_INTERVAL);

    return () => clearInterval(interval);
  }, [gameStarted]);

  return (
    <>
      <h1 className="title">Snake Game</h1>

      <div className="board">
        {Array.from({ length: BOARD_SIZE }).map((_, index) => (
          <div
            className={index === snakePosition ? "cell snake" : "cell"}
            key={index}
          ></div>
        ))}
      </div>

      <button className="button" onClick={() => setGameStarted(true)}>
        Play
      </button>
    </>
  );
}

export default App;
