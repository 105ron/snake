'use strict';
//add rows and columns to allow game board to change size
const gameContainer = document.getElementById('game-container');
const scoreDiv = document.getElementById('score-number');
const playerDiv = document.getElementById('player-name');
let fps = 10;
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;
// variables about for setting frame rate of requestAnimationFrame
let playerName = '';
let score = 0
let row;
let food;
let growSnake = 0
let snake = {
  position: [28,21],
  direction: "right",
  //this is the co-ordinates, goes tail --> head
  current: [[26, 21], [27,21], [28,21], [29,21]],
};

const getDiv = function getDiv(position) {
  let gridCoordinates = `${ position[0] }-${ position[1] }`;
  //return the div element with the class
  return document.getElementsByClassName(gridCoordinates);
};

Array.prototype.SumArray = function (arr) {
  let sum = this.map(function (num, index) {
    return num + arr[index];
  });
  return sum;
}

const toggleClass = function toggleClass(coordinates, toggleClass) {
  let changeClassDiv = getDiv(coordinates);
  //each grid co-ordinate is unique. changeClassDiv.length == 1 so we want to change the class on element[0]
  changeClassDiv[0].classList.toggle(toggleClass);
};

const drawSnake = function drawSnake() {
  //draw snake at beginning of game and remove the snake at end of game
  snake.current.forEach( (coordinates) => {
    toggleClass(coordinates, 'snake')
  });
};

const isSameCoordinates = function isSameCoordinates(position, snakeArray) {
  return snakeArray.some( xAndY => 
    xAndY.every( (x, i) => x === position[i])
  );
};

function getRandomNumber(max) {
  return Math.floor(Math.random() * max +1);
}

const generateFoodCoordinates = function generateFoodCoordinates(snakeArray) { //maybe should pass params
  do {
    let x = getRandomNumber(55);
    let y = getRandomNumber(42);
    food = [x, y]
    console.log(food);
  } while (isSameCoordinates(food, snakeArray)); //generate new numbers if food is where the snake is positioned
  return food;
};

const generateFood = function generateFood() {
  let food = generateFoodCoordinates(snake.current);

  toggleClass(food, 'food')
};


const moveHead = function moveHead(coordinates, shift) {
  //we input the head co-ordinate and direction then add the arrays together to move the snake
  const direction = {
    right: [1, 0],
    left: [-1, 0],
    down: [0, 1],
    up: [0,-1],
  };
  return coordinates.SumArray(direction[shift]);
};

(function render() { //Immediately invoked function
  const gameGrid = Array.apply(null, Array(43)).map( (y, yIndex) => { 
    row = Array.apply(null, Array(56)).map( (x, xIndex) => {
      return `<div class="game-squares ${ xIndex }-${ yIndex }"></div>`;
    });
    return `<div class ="row">${ row.join('') }</div>`;
  });
  gameContainer.insertAdjacentHTML('afterbegin', gameGrid.join(''));
  drawSnake();
  generateFood();
})();

document.onkeydown = function(evt) {
  const keys = {
    37: 'left', //arrow keys
    38: 'up',
    39: 'right',
    40: 'down',
    65: 'left', //wasd keys
    87: 'up',
    68: 'right',
    83: 'down'
  };
  const illegalMoves = {
    left: 'right', //don't allow 180 degree turns for the snake
    right: 'left',
    up: 'down',
    down: 'up',
  }
  evt = evt || window.event;
  if (keys[evt.keyCode]) {
    if ((illegalMoves[snake.direction]) != (keys[evt.keyCode])) {
      snake.direction = keys[evt.keyCode];
    }
  }
};

const moveSnake = function moveSnake(current, movedCordinates) {
  let newCordinates = [...current, [...movedCordinates]];
  if (!growSnake) { newCordinates.splice(0,1) };
  toggleClass(movedCordinates, 'snake'); //draw the head
  if (growSnake) {
    growSnake -= 1
    fps += 0.1;
    interval = 1000/fps;
  } else {
    toggleClass(current[0], 'snake')
  };
  return newCordinates;
};

const isEatingFood = function isEatingFood(headCoordinates) {
  if (isSameCoordinates(food, [headCoordinates])) { //we wrap headCoordinates because the function expects an array of arrays as a param
    return true;
  }
};

const updateScore = function updateScore() {
  score += 100
  scoreDiv.innerHTML = ''
  let scoreDisplay = score < 1000 ? `0${ score }` : score; //add leading zero to scores < 1000
  scoreDiv.insertAdjacentHTML('afterbegin', scoreDisplay);
};

const updateFood = function updateFood() {
  toggleClass(food, 'food') //remove the old food
  generateFood(); //make new food
  updateScore();
};

const addToTail = function addToTail() {
  growSnake = 4;
  let foodDiv = getDiv(food);
  updateFood();
};

const isValidPosition = function isValidPosition(position, snakeArray) {
  if (getDiv(position).length < 1) { return false }; //snake is off the board
  let body = [...snakeArray]
  body.pop(); //remove head before we search for it's coordinates in it's positions
  if (isSameCoordinates(position, body)) { return false };
  return true;
};

const restartGame =  function restartGame() {
  alert ('Game over, try again.')
  drawSnake(snake.current) //undraw snake
  score = 0;
  updateFood();
  scoreDiv.innerHTML = '';
  scoreDiv.insertAdjacentHTML('afterbegin', '0000');
  snake.current = [[26, 21], [27,21], [28,21], [29,21]];
  drawSnake(snake.current) //redraw snake
  snake.direction = 'right';
  let fps = 10;
  let interval = 1000/fps;
};
  
function move() { 
    requestAnimationFrame(move);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
      then = now - (delta % interval);
      let headCoordinates = snake.current[snake.current.length -1];
      headCoordinates = moveHead(headCoordinates, snake.direction);
      if (!isValidPosition(headCoordinates, snake.current)) {
        restartGame();
      };
      if (isEatingFood(headCoordinates)) { addToTail() };
      snake.current = moveSnake(snake.current, headCoordinates);
    }
}
(function startNewGame() {
  let person = prompt('Please enter your name', 'Player1');
  person = person || 'Player1';
  playerDiv.innerHTML = ''
  playerDiv.insertAdjacentHTML('afterbegin', person);
  move();
}());
 