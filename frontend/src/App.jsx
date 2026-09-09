import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [snakePosition, setSnakePosition] = useState(154);
  const [gameStarted, setGameStarted] = useState(false);
  const [direction, setDirection] = useState("right");

  const directionRef = useRef("right");

  const handleKeyDown = (event) => {
    if (!gameStarted) return;

    if (
      (event.key === "ArrowUp" || event.key === "w") &&
      directionRef.current !== "down"
    ) {
      directionRef.current = "up";
      setDirection("up");
    } else if (
      (event.key === "ArrowDown" || event.key === "s") &&
      directionRef.current !== "up"
    ) {
      directionRef.current = "down";
      setDirection("down");
    } else if (
      (event.key === "ArrowLeft" || event.key === "a") &&
      directionRef.current !== "right"
    ) {
      directionRef.current = "left";
      setDirection("left");
    } else if (
      (event.key === "ArrowRight" || event.key === "d") &&
      directionRef.current !== "left"
    ) {
      directionRef.current = "right";
      setDirection("right");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setSnakePosition((position) => {
        if (directionRef.current === "up") return position - 20;
        if (directionRef.current === "down") return position + 20;
        if (directionRef.current === "left") return position - 1;
        return position + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gameStarted]);

  return (
    <>
      <h1 className="title">Snake Game</h1>

      <div className="board">
        {Array.from({ length: 20 * 15 }).map((_, index) => (
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
