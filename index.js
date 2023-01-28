const BOX_WIDTH = 95.0;
const BOX_HEIGHT = 95.0;
const PADDING = 10.0;

const GRID_HEIGHT = 300.0;
const GRID_LENGTH = 300.0;
const GRID_COLOR = "#fbf1c7";

const LINE_HEIGHT = 90.0;
const LINE_WIDTH = 5.0;

const CROSS_COLOR = "#ff0000";
const CROSS_WIDTH = 5.0;

const CIRCLE_COLOR = "#00ff00";
const CIRCLE_WIDTH = 5.0;
const CIRCLE_RADIUS = 25.0;

let CLICKED_ON = null;
let CROSS_TURN = true;
let CIRCLE_TURN = false;

var MATRIX = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

function fillLine(context, x, y, w, h, color, orientation) {
  context.beginPath();
  context.strokeStyle = GRID_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.moveTo(x, y);
  if (orientation == "v") {
    context.lineTo(x, y + h);
  } else if (orientation == "h") {
    context.lineTo(x + w, y);
  }
  context.stroke();
}

class TouchBox {
  constructor(startX, startY, borders, identifier) {
    this.startX = startX;
    this.startY = startY;
    this.endX = this.startX + BOX_WIDTH;
    this.endY = this.startY + BOX_HEIGHT;
    this.borders = borders;
    this.identifier = identifier;
  }

  createBorders(context, color) {
    for (var i = 0; i < this.borders.length; i++) {
      switch(this.borders[i]) {
        case 't':
          this.drawTop(context, color);
          break;
        case 'b':
          this.drawBottom(context, color);
          break;
        case 'r':
          this.drawRight(context, color);
          break;
        case 'l':
          this.drawLeft(context, color);
          break;
        default:
          throw "Invalid border pattern"
          break;
      }
    }
  }

  drawTop(context, color) {
    fillLine(context, this.startX, this.startY, LINE_HEIGHT, LINE_WIDTH, color, "h");
  }

  drawBottom(context, color) {
    fillLine(context, this.startX, this.endY, LINE_HEIGHT, LINE_WIDTH, color, "h");
  }

  drawRight(context, color) {
    fillLine(context, this.endX, this.startY, LINE_WIDTH, LINE_HEIGHT, color, "v");
  }

  drawLeft(context, color) {
    fillLine(context, this.startX, this.startY, LINE_WIDTH, LINE_HEIGHT, color, "v");
  }

  drawCross(context) {
    let x = (this.startX + this.endX) / 2.0 - PADDING / 2;
    let y = (this.startY + this.endY) / 2.0 - PADDING / 2;

    context.clearRect(this.startX, this.startY, BOX_WIDTH, BOX_HEIGHT);
    context.strokeStyle = CROSS_COLOR;
    context.lineWidth = CROSS_WIDTH;
    context.moveTo(x - 20, y - 20);
    context.lineTo(x + 20, y + 20);

    context.moveTo(x + 20, y - 20);
    context.lineTo(x - 20, y + 20);
    context.stroke();

    CLICKED_ON = null;
  }

  drawCircle(context) {
    let x = (this.startX + this.endX) / 2.0 - PADDING / 2;
    let y = (this.startY + this.endY) / 2.0 - PADDING / 2;

    context.clearRect(this.startX, this.startY, BOX_WIDTH, BOX_HEIGHT);
    context.strokeStyle = CIRCLE_COLOR;
    context.lineWidth = CIRCLE_WIDTH;
    context.beginPath();
    context.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI);
    context.stroke();
  }

  handleClick() {
    let i = parseInt(this.identifier[0]);
    let j = parseInt(this.identifier[1]);
    if (CROSS_TURN == true && MATRIX[i][j] == 0) {
      MATRIX[i][j] = 1;
      CROSS_TURN = false;
      CIRCLE_TURN = true;
    } else if (CIRCLE_TURN = true && MATRIX[i][j] == 0) {
      MATRIX[i][j] = 2;
      CIRCLE_TURN = false;
      CROSS_TURN = true;
    }
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
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  update(dt) {
  }

  render(context) {
    this.createGrid(context, GRID_COLOR);
    if (CLICKED_ON != null) {
      let i = parseInt(CLICKED_ON[0]);
      let j = parseInt(CLICKED_ON[1]);
      if (CLICKED_ON !== null) {
        for (let box of this.boxes) {
          if (CLICKED_ON == box.identifier) {
            if (MATRIX[i][j] == 1) box.drawCross(context);
            else if (MATRIX[i][j] == 2) box.drawCircle(context);
          }
        }
        CLICKED_ON = null;
      }
    }
  }

  drawCross(identifier) {
    for(let box of this.boxes) {
      if (identifier == box.identifier) {
        console.log(`we draw a cross at ${identifier}.`);
      }
    }
  }

  createGrid(context, color) {
    this.boxes = new Set();
    const cwidth = context.canvas.width;
    const cheight = context.canvas.height;
    const startX = (cwidth - this.width) / 2.0;
    const startY = (cheight - this.height) / 2.0;

    // Top 3 boxes
    this.boxes.add(new TouchBox(startX, startY, "br", "00"));
    this.boxes.add(new TouchBox(startX + BOX_WIDTH + PADDING, startY, "br", "01"));
    this.boxes.add(new TouchBox(startX + 2 * (BOX_WIDTH + PADDING), startY, "b", "02"));

    // Middle 3 boxes
    this.boxes.add(new TouchBox(startX, startY + BOX_HEIGHT + PADDING, "br", "10"));
    this.boxes.add(new TouchBox(startX + BOX_WIDTH + PADDING, startY + BOX_HEIGHT + PADDING, "br", "11"));
    this.boxes.add(new TouchBox(startX + 2 * (BOX_WIDTH + PADDING), startY + BOX_HEIGHT + PADDING, "b", "12"));

    // Bottom 3 boxes
    this.boxes.add(new TouchBox(startX, startY + 2 * (BOX_HEIGHT + PADDING), "r", "20"));
    this.boxes.add(new TouchBox(startX + BOX_WIDTH + PADDING, startY + 2 * (BOX_HEIGHT + PADDING), "r", "21"));
    this.boxes.add(new TouchBox(startX + 2 * (BOX_WIDTH + PADDING), startY + 2 * (BOX_HEIGHT + PADDING), "", "22"));

    for(let box of this.boxes) {
      box.createBorders(context, color);
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
  let grid = new Grid(300, 300);
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
