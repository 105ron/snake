'use strict';
const gameContainer = document.getElementById('game-container');
let row;
let snake = {
  position: [28,21],
  direction: "right",
  //this is the co-ordinates, goes tail --> head
  current: [[26, 21], [27,21], [28,21], [29,21]],
};

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
  evt = evt || window.event;
  console.log(evt);
  if (keys[evt.keyCode]) {
      snake.direction = keys[evt.keyCode];
      console.log(snake.direction);
  }
};

const coordinatesToDiv = function coordinatesToDiv(position) {
  let gridCoordinates = `${ position[0] }-${ position[1] }`;
  //return the div element with the class
  return document.getElementsByClassName(gridCoordinates);
};

const toggleSnakeClass = function toggleSnakeClass(coordinates) {
  let changeClassDiv = coordinatesToDiv(coordinates);
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

const moveSnake = function moveSnake() {
  let headCordinates = snake.current[snake.current.length -1];
  headCordinates = moveHead(headCordinates, snake.direction);
  let current = snake.current;
  let newCordinates = [...current, [...headCordinates]];
  newCordinates.splice(0,1);
  toggleSnakeClass(headCordinates); //draw the head
  toggleSnakeClass(current[0]); //erase the tail
  snake.current = newCordinates;
  return newCordinates;
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

window.requestAnimationFrame(moveSnake);