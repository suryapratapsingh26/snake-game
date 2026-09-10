import "./Snake.css";

function Snake({ isHead }) {
  return <div className={isHead ? "snake snake-head" : "snake"}></div>;
}

export default Snake;
