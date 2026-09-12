import {
  DIRECTIONS,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BOARD_SIZE,
} from "../constants";

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

export { getNextPosition, getNextFoodPosition, hasSelfCollision };