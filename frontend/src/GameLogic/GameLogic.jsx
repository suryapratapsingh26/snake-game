import { useState, useEffect, useRef } from "react";
import Board from "../Board/Board";
import {
  DIRECTIONS,
  OPPOSITE_DIRECTION,
  DIRECTION_KEYS,
  BOARD_SIZE,
  INITIAL_POSITION,
  MOVE_INTERVAL,
  INITIAL_FOOD_POSITION,
  SCORE_PER_FOOD,
} from "../constants";
import {
  getNextFoodPosition,
  getNextPosition,
  hasSelfCollision,
} from "../utils/helpers";
import Score from "../Score/score";
import "./GameLogic.css";

function GameLogic() {
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

export default GameLogic;

