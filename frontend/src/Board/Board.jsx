import Cell from "../Cell/Cell";
import "./Board.css";

function Board({ boardSize, snake, foodPosition }) {
  return (
    <div className="board">
      {Array.from({ length: boardSize }).map((_, index) => (
        <Cell
          key={index}
          isSnake={snake.includes(index)}
          isHead={index === snake[0]}
          isFood={index === foodPosition}
        />
      ))}
    </div>
  );
}

export default Board;
