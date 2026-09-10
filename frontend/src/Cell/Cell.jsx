import Snake from "../Snake/Snake";
import Food from "../Food/Food";
import "./Cell.css";

function Cell({ isSnake, isHead, isFood }) {
  return (
    <div className="cell">
      {isSnake && <Snake isHead={isHead} />}
      {isFood && <Food />}
    </div>
  );
}

export default Cell;
