
const gameContainer = document.getElementById('game-container');
const gameGrid = Array.apply(null, Array(42)).map( (y, yIndex) => { 
  let row = Array.apply(null, Array(56)).map( (x, xIndex) => {
    return `<div class="game-squares ${ yIndex }-${ xIndex }"></div>`;
  });
  row = `<div class ="row">${ row.join('') }</div>`
  return row;
});

gameContainer.insertAdjacentHTML('afterbegin', gameGrid.join(''));