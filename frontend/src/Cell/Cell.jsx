import Snake from "../Snake/Snake";
import Food from "../Food/Food";
import "./Cell.css";

function Cell({ isSnake, isFood }) {
  return (
    <div className="cell">
      {isSnake && <Snake />}
      {isFood && <Food />}
    </div>
  );
}

export default Cell;
