'use strict';
const gameContainer = document.getElementById('game-container');
let row;
let snake = {
  position: [28,21],
  direction: "right",
  //this is the co-ordinates, goes tail --> head
  current: [[26, 21], [27,21], [28,21], [29,21]],
};

const coordinatesToClass = function coordinatesToClass(position) {
  let gridCoordinates = `${ position[0] }-${ position[1] }`;
  //return the div element with the class
  return document.getElementsByClassName(gridCoordinates);
};

const drawSnake = function drawSnake() {
  snake.current.forEach( (cordinates) => {
    let snakeDiv = coordinatesToClass(cordinates);
    //each grid co-ordinate is unique. snakeDiv.length == 1 so we want to change the class on element[0]
    snakeDiv[0].classList.toggle('snake');
  });
};

Array.prototype.SumArray = function (arr) {
    let sum = this.map(function (num, index) {
      return num + arr[index];
    });
    return sum;
  }

const moveHead = function moveHead(coordinates, shift) {
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