import * as g from './graphics.js'
import {
  MIN_LVL, MAX_LVL, frameDelay, framesPerMove, delayToNextLevel,
  Direction, Color, Figure, FigureSprites, getRandomKey
} from './config.js'
let score = 0;
let LVL = MIN_LVL;
let field;
let playTimer, lvlTimer;
let first = true;
let paused = true;

const keyDownHander = (e) => {
  e = e || window.event;
  e.preventDefault();
  if (e.key === 'r') {
    start();
  }
  else if (e.key === 'p') {
    if (paused) play(LVL);
    else pause();
  }
  else if (e.key === '=') {
    if (paused) incLVL(true);
  }
  else if (e.key === '-') {
    if (paused) decLVL(true);
  }
  else {
    if (paused) return;
    if (e.key === 'ArrowUp') {
      currentDirection = Direction.Up;
    } else if (e.key === 'ArrowDown') {
      currentDirection = Direction.Down;
    } else if (e.key === 'ArrowLeft') {
      currentDirection = Direction.Left;
    } else if (e.key === 'ArrowRight') {
      currentDirection = Direction.Right;
    }
    else return;
    processMove();
  }
};

function processMove() {
  if (moveFigure(currentDirection) === 1) {
    gameOver();
  }
  else {
    draw();
    // drawMovement(currentDirection);
  }
}

const c = new g.Canvas(g.WIDTH, g.HEIGHT);
document.getElementById('canvas-container').insertAdjacentElement('afterbegin', c.canvas);

const mini = new g.Canvas(4, 4);
document.getElementById('mini').insertAdjacentElement('beforeend', mini.canvas);


const centerX = Math.floor(g.WIDTH / 2) - 1;
const topY = 0;
let currentFigure, nextFigure, currentDirection = Direction.Down;

document.getElementById('start').onclick = () => { start(); };
document.getElementById('play').onclick = () => { pause(); };
document.getElementById('incLVL').onclick = () => { incLVL(true); };
document.getElementById('decLVL').onclick = () => { decLVL(true); };
drawStartScreen();


document.getElementById('left').onclick = () => { 
  currentDirection = Direction.Left;
  processMove(); 
};
document.getElementById('up').onclick = () => { 
  currentDirection = Direction.Up;
  processMove(); 
};
document.getElementById('down').onclick = () => { 
  currentDirection = Direction.Down;
  processMove(); 
};
document.getElementById('right').onclick = () => { 
  currentDirection = Direction.Right;
  processMove(); 
};

function setFigure(sprite, color) {
  sprite.forEach(pos => {
    if (isInside(pos)) {
      if (color === g.BackgroundColor) field[pos[1]][pos[0]] = '';
      else field[pos[1]][pos[0]] = color;
    }
  });
}
function clearFigure(sprite) {
  setFigure(sprite, g.BackgroundColor);
}
function processField() {
  for (let i = 0; i < field.length; i++) {
    let row = field[i];
    if (row.every(cell => cell !== '')) {
      field.splice(i, 1);
      field.unshift(Array(g.WIDTH).fill(''));
      score += LVL * 5; //10*LVL
      updateScore();
    }
  }
}
function generateFigure() {
  let randFigType = getRandomKey(FigureSprites);
  let randFig = FigureSprites[randFigType];
  let randSpriteIndex = Math.floor(Math.random() * randFig.length);
  let randSprite = randFig[randSpriteIndex];
  let randCol = Color[getRandomKey(Color)];
  if (!first) drawMini(randSprite, randCol);
  else first = false;
  randSprite = randSprite.map(offset => [centerX + offset[0], topY + offset[1]]);
  return new Figure(randFigType, randCol, randSpriteIndex, randSprite);
}


function isInside(pos) {
  return pos[0] >= 0 && pos[0] < g.WIDTH
    && pos[1] >= 0 && pos[1] < g.HEIGHT;
}


function drawMini(sprite, color) {
  mini.fillBackground();
  sprite.forEach(pos => {
    mini.drawCell(pos, color);
  }
  );
}
function draw() {
  c.fillBackground();
  for (let i = 0; i < g.HEIGHT; i++) {
    for (let j = 0; j < g.WIDTH; j++) {
      if (field[i][j] != '')
        c.drawCell([j, i], field[i][j]);
    }
  }
}


// function drawFrame(direction, offset) {
//   c.fillBackground();
//   for (let i = 0; i < g.HEIGHT; i++) {
//     for (let j = 0; j < g.WIDTH; j++) {
//       if (field[i][j] != '')
//         if (currentFigure.contains(j, i)) {
//           if (direction === Direction.Down) c.drawCell([j, i - offset], field[i][j]);
//           else if (direction === Direction.Left) c.drawCell([j + offset, i], field[i][j]);
//           else if (direction === Direction.Right) c.drawCell([j - offset, i], field[i][j]);
//         }
//         else c.drawCell([j, i], field[i][j]);
//     }
//   }
// }

//With Async/await
// const sleep = delay => new Promise(r => setTimeout(r, delay));
// async function drawMovement(direction) {
//   for (let frame = framesPerMove; frame >= 0; frame--) {
//     let offset = frame / framesPerMove;
//     // console.log(frame, offset);
//     drawFrame(direction, offset);
//     await sleep(frameDelay);
//   }
//   // draw();
// }

//With SetTimeout
// function drawMovement(direction) {
//   let frameDrawerID = 0;
//   for (let frame = framesPerMove; frame >= 0; frame--) {
//     clearTimeout(frameDrawerID);
//     let offset = frame / framesPerMove;
//     // console.log(frame, offset);
//     setTimeout( () => {
//       drawFrame(direction, offset);
//     }, (framesPerMove-frame)*frameDelay); 
//   }
// }


// function getCellsOnEdge(sprite, direction) {
//   let edge = [];
//   const groupBy = (x, f) => x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});
//   if (direction === Direction.Down) {
//     let figureColumns = Object.values(groupBy(sprite, pos => pos[0]));
//     for (const column of figureColumns) {
//       let sortedColumn = column.sort((a, b) => b[1] - a[1]);
//       edge.push(sortedColumn[0]);
//     }
//   }
//   else {
//     let figureRows = Object.values(groupBy(sprite, pos => pos[1]));
//     for (const row of figureRows) {
//       let sortedRow;
//       if (direction === Direction.Left) {
//         sortedRow = row.sort((a, b) => a[0] - b[0]);
//       } else if (direction === Direction.Right) {
//         sortedRow = row.sort((a, b) => b[0] - a[0]);
//       }
//       edge.push(sortedRow[0]);
//     }
//   }
//   return edge;
// }
// function rotate() {
//   let expectedFigure = currentFigure.getNextSpriteFigure();
//   clearFigure(currentFigure.sprite);
//   if (expectedFigure.sprite.every(pos => isInside(pos)
//     && field[pos[1]][pos[0]] === '')) {
//     currentFigure = expectedFigure;
//   }
//   setFigure(currentFigure.sprite, currentFigure.color);
// }

// function moveFigure(direction) {
//   if (direction === Direction.Up) {
//     rotate();
//   }
//   else if (!getCellsOnEdge(currentFigure.sprite, direction)
//     .some(pos => hasCollision(direction, pos))) {
//     clearFigure(currentFigure.sprite);
//     currentFigure.sprite = currentFigure.sprite.map(cell => getMovedCell(direction, cell));
//     setFigure(currentFigure.sprite, currentFigure.color);
//   }
//   else if (direction === Direction.Down) {
//     processField();
//     currentFigure = nextFigure;
//     setFigure(currentFigure.sprite, currentFigure.color);
//     nextFigure = generateFigure();
//     if (getCellsOnEdge(currentFigure.sprite, direction)
//       .some(pos => hasCollision(direction, pos))) {
//       stop();
//       return 1;
//     }
//   }
//   return 0;
// }
// function hasCollision(direction, pos) {
//   if (direction === Direction.Down) return (pos[1] >= g.HEIGHT - 1
//     || (pos[0] < g.HEIGHT - 1 && field[pos[1] + 1][pos[0]] != ''));
//   if (direction === Direction.Left) return (pos[0] <= 0
//     || (pos[0] > 0 && field[pos[1]][pos[0] - 1] != ''));
//   if (direction === Direction.Right) return (pos[0] >= g.WIDTH - 1
//     || (pos[0] < g.WIDTH - 1 && field[pos[1]][pos[0] + 1] != ''));
// }
// function getMovedCell(direction, cell) {
//   if (direction === Direction.Down) return [cell[0], cell[1] + 1];
//   if (direction === Direction.Left) return [cell[0] - 1, cell[1]];
//   if (direction === Direction.Right) return [cell[0] + 1, cell[1]];
// }
// function hasCollision(direction, pos) {
//   if (direction === Direction.Down) return (pos[1] >= g.HEIGHT - 1
//     || (pos[0] < g.HEIGHT - 1 && field[pos[1] + 1][pos[0]] != ''));
//   if (direction === Direction.Left) return (pos[0] <= 0
//     || (pos[0] > 0 && field[pos[1]][pos[0] - 1] != ''));
//   if (direction === Direction.Right) return (pos[0] >= g.WIDTH - 1
//     || (pos[0] < g.WIDTH - 1 && field[pos[1]][pos[0] + 1] != ''));
// }

function moveFigure(direction) {
  let expectedFigure = currentFigure;
  if (direction === Direction.Up) {
    expectedFigure = currentFigure.getNextSpriteFigure();
  }
  else {
    expectedFigure = currentFigure.getMovedFigure(direction);
  }
  clearFigure(currentFigure.sprite);
  if (expectedFigure.sprite.every(pos => isInside(pos)
    && field[pos[1]][pos[0]] === '')) {
    currentFigure = expectedFigure;
    setFigure(currentFigure.sprite, currentFigure.color);
  }
  else {
    setFigure(currentFigure.sprite, currentFigure.color);
    if (direction === Direction.Down) {
      processField();
      currentFigure = nextFigure;
      nextFigure = generateFigure();
      if (currentFigure.sprite.every(pos => isInside(pos)
        && field[pos[1]][pos[0]] === '')) {
        setFigure(currentFigure.sprite, currentFigure.color);
      }
      else {
        stop();
        return 1;
      }
    }
  }
  return 0;
}

function drawStartScreen(){
  c.drawMessage("Start new game: ↻", 'red', 26, -60);
  c.drawMessage("Continue/pause: ⏯︎", 'yellow', 26, -30);
  c.drawMessage("Increase LVL: +", 'blue', 26, 30);
  c.drawMessage("Decrease LVL: -", 'green', 26, 60);
}

function updateScore() {
  document.getElementById("score").innerText = `${score}`;
}
function updateLevel() {
  document.getElementById("lvl").innerText = `${LVL}`;
}
function init() {
  score = 0;
  c.resetGraphics();
  mini.resetGraphics();
  document.addEventListener('keydown', keyDownHander);
  field = [];
  for (let i = 0; i < g.HEIGHT; i++) {
    let row = Array(g.WIDTH).fill('');
    field.push(row);
  }
  field.At = function (pos) {
    if (isInside(pos))
      return field[pos[1]][pos[0]];
    else return undefined;
  }
}
function start() {
  enableButtons('play');
  disableButtons('incLVL', 'decLVL');
  init();
  currentFigure = generateFigure();
  setFigure(currentFigure.sprite, currentFigure.color);
  nextFigure = generateFigure();
  play(LVL);
}

function play(lvl) {
  stop();
  paused = false;
  updateScore();
  updateLevel();
  draw();
  // drawMovement(currentDirection);
  playTimer = setInterval(() => {
    currentDirection = Direction.Down;
    processMove();
  }, Math.floor(frameDelay * (framesPerMove + 1)/ (1 + ((LVL-1)/MAX_LVL))));

  lvlTimer = setInterval(() => {
    if(LVL < MAX_LVL) incLVL(false);
  }, Math.floor(delayToNextLevel));
  document.getElementById('play').onclick = () => { pause(); };
  enableButtons('left', 'up', 'down', 'right');
  disableButtons('incLVL', 'decLVL');
}
function stop() {
  paused = true;
  disableButtons('left', 'up', 'down', 'right');
  clearInterval(playTimer);
  clearInterval(lvlTimer);
}
function pause() {
  stop();
  c.drawMessage("Game Paused", 'red', 36);
  document.getElementById('play').onclick = () => { play(LVL); };
  if (LVL < MAX_LVL) enableButtons('incLVL');
  if (LVL > MIN_LVL) enableButtons('decLVL');
}

function incLVL(manually) {
  LVL = LVL < MAX_LVL ? LVL + 1 : MAX_LVL;
  updateLevel();
  if (!manually) {
    stop();
    play(LVL);
  }
  else {
    if (LVL === MAX_LVL) disableButtons('incLVL');
    if (LVL > MIN_LVL) enableButtons('decLVL');
  }
}
function decLVL(manually) {
  LVL = LVL > MIN_LVL ? LVL - 1 : MIN_LVL;
  updateLevel();
  if (LVL === MIN_LVL) disableButtons('decLVL');
  if (LVL < MAX_LVL) enableButtons('incLVL');
}

function gameOver() {
  // draw();
  c.drawMessage("Game Over", 'blue', 38, -20);
  c.drawMessage("Score: " + score.toString(), 'green', 30, 20);
  document.removeEventListener('keydown', keyDownHander);
  stop();
  disableButtons('play');
  if (LVL < MAX_LVL) enableButtons('incLVL');
  if (LVL > MIN_LVL) enableButtons('decLVL');
}

function enableButtons(...buttons) {
  buttons.forEach(id => { document.getElementById(id).disabled = false; })
}
function disableButtons(...buttons) {
  buttons.forEach(id => { document.getElementById(id).disabled = true; })
}
