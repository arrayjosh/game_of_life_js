/* global CHUNK */
function draw(snakeToDraw, apple) {
  let drawableSnake = {color: "green", pixels: snakeToDraw};
  let drawableApple = {color: "red", pixels: [apple]};
  let drawableObjects = [drawableSnake, drawableApple];
  CHUNK.draw(drawableObjects);
}

function segmentFurtherForwardThan(index, snake) {
  if(snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1];
  }
}

function moveSnake(snake) {
  let newSnake = [];

  snake.forEach((oldSegment, segmentIndex) => {
    let newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    newSnake.push(newSegment);
  });

  return newSnake;
}

function moveSegment(segment) {
  switch (segment.direction) {
    case "down":
      return {top: segment.top + 1, left: segment.left};
    case "up":
      return {top: segment.top - 1, left: segment.left};
    case "right":
      return {top: segment.top, left: segment.left + 1};
    case "left":
      return {top: segment.top, left: segment.left - 1};
    default:
      return segment;
  }
}

function changeDirection(direction) {
  snake[0].direction = direction;
}

function growSnake(snake) {
  let indexOfLastSegment = snake.length - 1;
  let lastSegment = snake[indexOfLastSegment];
  snake.push({top: lastSegment.top, left: lastSegment.left});
  return snake;
}

function ate(snake, otherThing) {
  let head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

function advanceGame() {
  let newSnake = moveSnake(snake);

  if(ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
    blehsnake.pause();
    ahsnake.play();
  }

  if(ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
    blehsnake.pause();
    blehsnake.currentTime = 0;
    blehsnake.play();
  }

  if(ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You hit a wall :(");
    blehsnake.pause();
    ahsnake.play();
  } else {
    snake = newSnake;
    draw(snake, apple);
  }
}

let snake = [{top: 1, left: 0, direction: "down"}, {top: 0, left: 0, direction: "down"}];
let apple = {top: 8, left: 10};


let imasnake = new Audio('imasnake.mp3');
let blehsnake = new Audio('blehsnake.mp3');
let ahsnake = new Audio('ahsnake.mp3')

imasnake.play();
CHUNK.executeNTimesPerSecond(advanceGame, 10);
CHUNK.onArrowKey(changeDirection);
