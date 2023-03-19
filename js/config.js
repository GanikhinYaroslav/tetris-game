export const MIN_LVL = 1, MAX_LVL = 10;
export const frameDelay = 50;
export const framesPerMove = 5;
export const delayToNextLevel = 120000;

// LVL 1 - 300ms, 5 scores
// LVL 2 - 272ms, 10 scores
// LVL 3 - 250ms, 15 scores
// LVL 4 - 230ms, 20 scores
// LVL 5 - 214ms, 25 scores
// LVL 6 - 200ms, 30 scores
// LVL 7 - 187ms, 35 scores
// LVL 8 - 176ms, 40 scores
// LVL 9 - 166ms, 45 scores
//LVL 10 - 157ms, 50 scores

export const Direction = {
  Up: 'Up',
  Down: 'Down',
  Left: 'Left',
  Right: 'Right'
};

export const Color = {
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  purple: 'purple',
  orange: 'orange',
  pink: 'pink',
  lightblue: 'lightblue',
};

export const FigureSprites = {
  'O': [
    [[0, 0], [0, 1], [1, 0], [1, 1]],
  ],
  'I': [
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[0, 1], [1, 1], [2, 1], [3, 1]],
  ],
  'T': [
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 0], [2, 1]],
    [[1, 0], [1, 1], [0, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 1]],
  ],
  'J': [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [1, 1], [1, 0]],
    [[0, 0], [1, 0], [2, 0], [2, 1]],
    [[1, 0], [0, 0], [0, 1], [0, 2]],
  ],
  'L': [
    [[0, 0], [0, 1], [0, 2], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 0]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [0, 0], [1, 0], [2, 0]],
  ],
  'S': [
    [[0, 1], [1, 1], [1, 0], [2, 0]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  'Z': [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[0, 2], [0, 1], [1, 1], [1, 0]],
  ],
};

export class Figure {
  constructor(type, color, spriteIndex, sprite) {
    this.type = type;
    this.color = color;
    this.spriteIndex = spriteIndex;
    this.sprite = sprite;
  }
  clone() {
    return new Figure(this.type, this.color, this.spriteIndex, this.sprite);
  }
  getNextSpriteFigure() {
    let next = this.clone();
    let offsets = FigureSprites[this.type][this.spriteIndex][0];
    let origin = [this.sprite[0][0] - offsets[0], this.sprite[0][1] - offsets[1]];
    next.spriteIndex = (this.spriteIndex + 1) % FigureSprites[this.type].length;
    next.sprite = FigureSprites[this.type][next.spriteIndex]
      .map(offset => [origin[0] + offset[0], origin[1] + offset[1]]);
    return next;
  }
  contains(x, y) {
    return this.sprite.some(pos => pos[0] === x && pos[1] === y);
  }
  getMovedFigure(direction){
    let next = this.clone();
    next.sprite = next.sprite.map(cell => this.getMovedCell(direction, cell));
    return next;
  }
  getMovedCell(direction, cell) {
    if (direction === Direction.Down) return [cell[0], cell[1] + 1];
    if (direction === Direction.Left) return [cell[0] - 1, cell[1]];
    if (direction === Direction.Right) return [cell[0] + 1, cell[1]];
  }
}

export function getRandomKey(obj) {
  const keysArr = Object.keys(obj);
  return keysArr[Math.floor(Math.random() * keysArr.length)];
}