import { useState, useEffect, useRef } from "react";
import "./App.css";
import Board from "./Board/Board";
import { DIRECTIONS, OPPOSITE_DIRECTION, DIRECTION_KEYS } from "./constants";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;
const BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT;
const INITIAL_POSITION = 154;
const ONE_STEP = 1;
const MOVE_INTERVAL = 500;
const INITIAL_FOOD_POSITION = 23;

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

const getNextFoodPosition = (snake) => {
  let position;

  do {
    position = Math.floor(Math.random() * BOARD_SIZE);
  } while (snake.includes(position));

  return position;
};

function App() {
  const [snake, setSnake] = useState([INITIAL_POSITION]);
  const [gameStarted, setGameStarted] = useState(false);
  const [foodPosition, setFoodPosition] = useState(INITIAL_FOOD_POSITION);

  const directionRef = useRef(DIRECTIONS.RIGHT);

  const handleKeyDown = (event) => {
    if (!gameStarted) return;

    const newDirection = DIRECTION_KEYS[event.key];

    if (!newDirection) {
      return;
    }

    if (newDirection === OPPOSITE_DIRECTION[directionRef.current]) {
      return;
    }

    directionRef.current = newDirection;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      setSnake((snake) => {
        const newHead = getNextPosition(snake[0], directionRef.current);
        const newSnake = [newHead, ...snake];

        if (newHead === foodPosition) {
          setFoodPosition(getNextFoodPosition(newSnake));
          return newSnake;
        }

        return newSnake.slice(0, -1);
      });
    }, MOVE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [gameStarted, foodPosition]);

  return (
    <>
      <h1 className="title">Snake Game</h1>

      <Board boardSize={BOARD_SIZE} snake={snake} foodPosition={foodPosition} />

      <button className="button" onClick={() => setGameStarted(true)}>
        Play
      </button>
    </>
  );
}

export default App;
