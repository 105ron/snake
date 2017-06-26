'use strict';
const gameContainer = document.getElementById('game-container');
let row;
let snake = {
  position: [28,21],
  direction: "right",
  current: [[26, 21], [27,21], [28,21], [29,21]],
};

const coordinatesToClass = function coordinatesToClass(position) {
  let gridCoordinates = `${ position[0] }-${ position[1] }`;
  return document.getElementsByClassName(gridCoordinates);
};


let drawSnake = function drawSnake() {
  snake.current.forEach( (cordinates) => {
    let snakeDiv = coordinatesToClass(cordinates);
    snakeDiv[0].classList.toggle('snake');
  });
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