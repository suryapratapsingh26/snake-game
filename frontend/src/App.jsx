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
  let row = Math.floor(position / BOARD_WIDTH);
  let col = position % BOARD_WIDTH;

  let nextRow = row;
  let nextColumn = col;

  // If the snake head is at the top row and user presses UP then
  // the snake head would come out of the bottom other wise it will move upward
  //Hear BOARD_HEIGHT-1 is used for denoting last row i.e max height
  if (direction === DIRECTIONS.UP) {
    nextRow = row == 0 ? BOARD_HEIGHT - 1 : row - 1;
  }
  // If the snake head is at the bottom of the board and player presses DOWN then
  // the snake head comes out of the top of the board otherwise it would move downward
  if (direction === DIRECTIONS.DOWN) {
    nextRow = row == BOARD_HEIGHT - 1 ? 0 : row + 1;
  }
  // If the snake head is at the last column and user presses RIGHT then
  // the snake head would come out of the 1st column
  // Here BOARD_WIDTH-1 is used for denoting last column
  if (direction === DIRECTIONS.RIGHT) {
    nextColumn = col == BOARD_WIDTH - 1 ? 0 : col + 1;
  }
  // If the snake head is at the 1st column and user presses LEFT then snake
  // head would come out of last column
  if (direction === DIRECTIONS.LEFT) {
    nextColumn = col == 0 ? BOARD_WIDTH - 1 : col - 1;
  }
  return nextRow * BOARD_WIDTH + nextColumn;
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
