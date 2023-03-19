export const cellSize = 17;
export const HEIGHT = Math.floor(0.7 * window.innerHeight / cellSize);
export const WIDTH = Math.floor(0.67 * HEIGHT);
export const strokeSize = 1;
export const BackgroundColor = '#f6f6f6';

export class Canvas {
  constructor(w, h) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w * cellSize;
    this.canvas.height = h * cellSize;
    this.context = this.canvas.getContext('2d');
  }
  getGradientOnCell(pos, color) {
    const angle = 45 * Math.PI / 180;
    const x1 = pos[0] * cellSize;
    const y1 = pos[1] * cellSize;
    // const x2 = x1 + cellSize;
    // const y2 = y1 + cellSize;
    const x2 = x1 + cellSize * Math.cos(angle);
    const y2 = y1 + cellSize * Math.sin(angle);
    const grd = this.context.createLinearGradient(x1 + 2, y1 + 2, x2, y2);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, color);
    return grd;
  }
  drawCell(pos, color = BackgroundColor) {
    this.context.beginPath();
    if (color != BackgroundColor) this.context.fillStyle = this.getGradientOnCell(pos, color);
    else this.context.fillStyle = BackgroundColor;
    this.context.rect(pos[0] * cellSize, pos[1] * cellSize, cellSize, cellSize);
    this.context.fill();
    // if (color != BackgroundColor) 
    this.context.stroke();
    this.context.closePath();
  }
  drawGrid() {
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        this.drawCell([j, i]);
      }
    }
  }
  fillBackground(color = BackgroundColor) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // if (color === BackgroundColor){
    //   this.drawGrid();
    // }
  }
  drawMessage(msg, color, fz, offset = 0) {
    this.fillBackground("rgba(250,250,250,0.2)");
    this.context.fillStyle = color;
    this.context.font = fz.toString() + "px Kanit, sans-serif";
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';
    this.context.strokeStyle = 'black';
    this.context.fillText(msg, this.canvas.width / 2, this.canvas.height / 2 + offset);
    this.context.strokeText(msg, this.canvas.width / 2, this.canvas.height / 2 + offset);
    // this.context.fillText(text, someX * cellSize, centerY * cellSize);
    // this.context.strokeText(text, someX * cellSize, centerY * cellSize);
    this.resetGraphics();
  }
  resetGraphics() {
    this.context.fillStyle = BackgroundColor;
    this.context.lineWidth = strokeSize;
    this.context.strokeStyle = '#ccc';
  }
}