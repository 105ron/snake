//'use strict';
let row;
let fps = 10;
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;
let snake = {
  position: [28,21],
  direction: "right",
  //this is the co-ordinates, goes tail --> head
  current: [[20, 21], [21,21], [22,21],[23, 21], [24,21], [25,21], [26, 21], [27,21], [28,21], [29,21]],
};
const gameContainer = document.getElementById('game-container');

const getDiv = function getDiv(position) {
  let gridCoordinates = `${ position[0] }-${ position[1] }`;
  //return the div element with the class
  return document.getElementsByClassName(gridCoordinates);
};

const toggleSnakeClass = function toggleSnakeClass(coordinates) {
  let changeClassDiv = getDiv(coordinates);
  //each grid co-ordinate is unique. snakeDiv.length == 1 so we want to change the class on element[0]
  changeClassDiv[0].classList.toggle('snake');
};

const drawSnake = function drawSnake() {
  snake.current.forEach( (coordinates) => {
    toggleSnakeClass(coordinates)
  });
};

Array.prototype.SumArray = function (arr) {
    let sum = this.map(function (num, index) {
      return num + arr[index];
    });
    return sum;
  }

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

(function render() {
  const gameGrid = Array.apply(null, Array(43)).map( (y, yIndex) => { 
    row = Array.apply(null, Array(56)).map( (x, xIndex) => {
      return `<div class="game-squares ${ xIndex }-${ yIndex }"></div>`;
    });
    return `<div class ="row">${ row.join('') }</div>`;
  });
  gameContainer.insertAdjacentHTML('afterbegin', gameGrid.join(''));
  drawSnake();
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
    left: 'right',
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
  newCordinates.splice(0,1);
  toggleSnakeClass(movedCordinates); //draw the head
  toggleSnakeClass(current[0]); //erase the tail
  return newCordinates;
};

const isSameCoordinates = function isSameCoordinates(position, snakeArray) {
  let body = [...snakeArray]
  body.pop(); //remove head before we search for it's coordinates in it's positions
  return body.some( xAndY => 
    xAndY.every( (x, i) => x === position[i])
  );
};


const isValidPosition = function isValidPosition(position, snakeArray) {
  if (getDiv(position).length < 1) { return false }; //snake is off the board
  if (isSameCoordinates(position, snakeArray)) {
    console.log("clashing");
  }
  return true;
};
  
function move() { 
    requestAnimationFrame(move);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
      then = now - (delta % interval);
      let headCoordinates = snake.current[snake.current.length -1];
      headCoordinates = moveHead(headCoordinates, snake.direction);
      if (isValidPosition(headCoordinates, snake.current)) {
        // console.log(`${ headCoordinates } off the board`);
      };
      snake.current = moveSnake(snake.current, headCoordinates);
    }
}
 
move();