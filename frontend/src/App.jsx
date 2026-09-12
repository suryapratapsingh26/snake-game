import { useState, useEffect, useRef } from "react";
import "./App.css";
import Board from "./Board/Board";
import { DIRECTIONS, OPPOSITE_DIRECTION, DIRECTION_KEYS } from "./constants";
import Score from "./Score/score";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;
const BOARD_SIZE = BOARD_WIDTH * BOARD_HEIGHT;
const INITIAL_POSITION = 154;
const ONE_STEP = 1;
const MOVE_INTERVAL = 500;
const INITIAL_FOOD_POSITION = 23;
const SCORE_PER_FOOD = 10;

const getNextPosition = (position, direction) => {
  if (direction === DIRECTIONS.UP) {
    /*
  If the snake is already at the top row and the user presses up,
  the snake comes out from the bottom at the same column.
  Otherwise, it moves one row upward.*/
    return position < BOARD_WIDTH
      ? position + BOARD_SIZE - BOARD_WIDTH
      : position - BOARD_WIDTH;
  }

  if (direction === DIRECTIONS.DOWN) {
    /* If the snake is already at the bottom row and the user presses down,
   the snake comes out from the top at the same column.
   Otherwise, it moves one row downward.*/

    return position >= BOARD_SIZE - BOARD_WIDTH
      ? position - BOARD_SIZE + BOARD_WIDTH
      : position + BOARD_WIDTH;
  }

  if (direction === DIRECTIONS.LEFT) {
    /* If the snake is already at the left edge and the user presses left,
   the snake comes out from the right edge of the same row.
   Otherwise, it moves one cell to the left.*/
    return position % BOARD_WIDTH === 0
      ? position + BOARD_WIDTH - ONE_STEP
      : position - ONE_STEP;
  }
  /* If the snake is already at the right edge and the user presses right,
   he snake comes out from the left edge of the same row.
   Otherwise, it moves one cell to the right.*/

  return position % BOARD_WIDTH === BOARD_WIDTH - 1
    ? position - BOARD_WIDTH + ONE_STEP
    : position + ONE_STEP;
};

const getNextFoodPosition = (snake) => {
  let position;

  do {
    position = Math.floor(Math.random() * BOARD_SIZE);
  } while (snake.includes(position));

  return position;
};

const hasSelfCollision = (newHead, snake) => {
  return snake.slice(1).includes(newHead);
};

function App() {
  const [snake, setSnake] = useState([INITIAL_POSITION]);
  const [gameStarted, setGameStarted] = useState(false);
  const [foodPosition, setFoodPosition] = useState(INITIAL_FOOD_POSITION);
  const [gameOver, setGameOver] = useState(false);
  const previousFoodPositionRef = useRef(foodPosition);
  const directionRef = useRef(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);

  const handleKeyDown = (event) => {
    if (!gameStarted) return;

    const newDirection = DIRECTION_KEYS[event.key];

    if (!newDirection) return;

    if (newDirection === OPPOSITE_DIRECTION[directionRef.current]) {
      return;
    }

    directionRef.current = newDirection;
  };
  useEffect(() => {
    if (previousFoodPositionRef.current !== foodPosition) {
      setScore((score) => score + SCORE_PER_FOOD);
      previousFoodPositionRef.current = foodPosition;
    }
  }, [foodPosition]);

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

        if (hasSelfCollision(newHead, snake)) {
          setGameStarted(false);
          setGameOver(true);
          return snake;
        }

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

      <Score score={score} />

      <Board boardSize={BOARD_SIZE} snake={snake} foodPosition={foodPosition} />

      {gameOver && <h2 className="game-over">Game Over</h2>}

      <button className="button" onClick={() => setGameStarted(true)}>
        Play
      </button>
    </>
  );
}

export default App;
