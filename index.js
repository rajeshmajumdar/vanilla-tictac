const BOX_WIDTH = 95.0;
const BOX_HEIGHT = 95.0;
const PADDING = 10.0;

const GRID_HEIGHT = 300.0;
const GRID_LENGTH = 300.0;
const GRID_COLOR = "#fbf1c7";

const LINE_HEIGHT = 90.0;
const LINE_WIDTH = 5.0;

let CLICKED_ON = null;

var MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

function fillLine(context, x, y, w, h, color) {
  context.beginPath();
  context.roundRect(x, y, w, h, [40]);
  context.fillStyle = color;
  context.fill();
}

class TouchBox {
  constructor(context, startX, startY, borders, identifier) {
    this.startX = startX;
    this.startY = startY;
    this.endX = this.startX + BOX_WIDTH;
    this.endY = this.startY + BOX_HEIGHT;
    this.borders = borders;
    this.identifier = identifier;
    this.context = context;
  }

  createBorders(color) {
    for (var i = 0; i < this.borders.length; i++) {
      switch(this.borders[i]) {
        case 't':
          this.drawTop(color);
          break;
        case 'b':
          this.drawBottom(color);
          break;
        case 'r':
          this.drawRight(color);
          break;
        case 'l':
          this.drawLeft(color);
          break;
        default:
          throw "Invalid border pattern"
          break;
      }
    }
  }

  drawTop(color) {
    fillLine(this.context, this.startX, this.startY, LINE_HEIGHT, LINE_WIDTH, color);
  }

  drawBottom(color) {
    fillLine(this.context, this.startX, this.endY, LINE_HEIGHT, LINE_WIDTH, color);
  }

  drawRight(color) {
    fillLine(this.context, this.endX, this.startY, LINE_WIDTH, LINE_HEIGHT, color);
  }

  drawLeft(color) {
    fillLine(this.context, this.startX, this.startY, LINE_WIDTH, LINE_HEIGHT, color);
  }

  drawCross() {
    // TODO: Draw a proper cross
    this.context.clearRect(this.startX, this.startY, BOX_WIDTH, BOX_HEIGHT);
    this.context.fillText("X", (this.startX + this.endX) / 2, (this.startY + this.endY) / 2);
  }

  drawCircle() {
    // TODO: Draw a proper circle
    this.context.clearRect(this.startX, this.startY, BOX_WIDTH, BOX_HEIGHT);
    this.context.fillText("O", (this.startX + this.endX) / 2, (this.startY + this.endY) / 2);
  }

  handleClick() {
    let i = parseInt(this.identifier[0]);
    let j = parseInt(this.identifier[1]);
    MATRIX[i][j] = 1;
    CLICKED_ON = `${i}${j}`;
  }

  touched(x, y) {
    if (x >= this.startX && x <= this.endX && y >= this.startY && y <= this.endY) {
      return true;
    }
    return false;
  }
}

class Grid {
  constructor(width, height, color) {
    this.width = width;
    this.height = height;
    this.color = color;
  }

  update(dt) {
    if (CLICKED_ON !== null) {
      for (let box of this.boxes) {
        if (CLICKED_ON == box.identifier) {
          box.drawCross();
        }
      }
      CLICKED_ON = null;
    }
  }

  render(context) {
    this.createGrid(context);
  }

  drawCross(identifier) {
    for(let box of this.boxes) {
      if (identifier == box.identifier) {
        console.log(`we draw a cross at ${identifier}.`);
      }
    }
  }

  createGrid(context) {
    this.boxes = new Set();
    const cwidth = context.canvas.width;
    const cheight = context.canvas.height;
    const startX = (cwidth - this.width) / 2.0;
    const startY = (cheight - this.height) / 2.0;

    // Top 3 boxes
    this.boxes.add(new TouchBox(context, startX, startY, "br", "00"));
    this.boxes.add(new TouchBox(context, startX + BOX_WIDTH + PADDING, startY, "br", "01"));
    this.boxes.add(new TouchBox(context, startX + 2 * (BOX_WIDTH + PADDING), startY, "b", "02"));

    // Middle 3 boxes
    this.boxes.add(new TouchBox(context, startX, startY + BOX_HEIGHT + PADDING, "br", "10"));
    this.boxes.add(new TouchBox(context, startX + BOX_WIDTH + PADDING, startY + BOX_HEIGHT + PADDING, "br", "11"));
    this.boxes.add(new TouchBox(context, startX + 2 * (BOX_WIDTH + PADDING), startY + BOX_HEIGHT + PADDING, "b", "12"));

    // Bottom 3 boxes
    this.boxes.add(new TouchBox(context, startX, startY + 2 * (BOX_HEIGHT + PADDING), "r", "20"));
    this.boxes.add(new TouchBox(context, startX + BOX_WIDTH + PADDING, startY + 2 * (BOX_HEIGHT + PADDING), "r", "21"));
    this.boxes.add(new TouchBox(context, startX + 2 * (BOX_WIDTH + PADDING), startY + 2 * (BOX_HEIGHT + PADDING), "", "22"));

    for(let box of this.boxes) {
      box.createBorders(this.color);
    }
  }

  onMouseDown(event) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    for(let box of this.boxes) {
      if (box.touched(mouseX, mouseY)) {
        box.handleClick();
      }
    }
  }
}

(() => {
  const canvas = document.getElementById("game");
  const context = canvas.getContext("2d");
  let grid = new Grid(300, 300, GRID_COLOR);
  var start = null;

  function animate(step) {
    if (!start) start = step;
    var dt = (step - start) / 1000.0;
    start = dt;

    grid.update(dt);
    grid.render(context);

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);

  document.addEventListener("mouseup", (event) => {
    return;
  })

  document.addEventListener("mousedown", (event) => {
    grid.onMouseDown(event, context);
  }, 50);
})();
