const PIXI = require("pixi.js");
const img = require("./gem.png");

const fieldSize = 8;
const gameElSize = 80;
const gameFieldSize = 900;

const app = new PIXI.Application({
  height: gameFieldSize,
  width: gameFieldSize,
  backgroundColor: 0xf6f6f6,
});
document.getElementById("app").appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);

container.on("swipe", swipeElements);

function swipeElements(x1, y1, x2, y2) {
  const child1 = container.children.find((i) => i.x === x1 && i.y === y1);
  const child2 = container.children.find((i) => i.x === x2 && i.y === y2);
  if (child1 && child2) {
    child1.x = x2;
    child1.y = y2;
    child2.x = x1;
    child2.y = y1;
  }
}
class GameEl {
  constructor(x, y, color, container) {
    this.object = new PIXI.Sprite(texture);
    this.object.interactive = true;
    this.object.tint = color;
    this.object.anchor.set(0.5);
    this.object.x = x;
    this.object.y = y;

    this.container = container;

    this.object
      .on("pointerdown", this.onSwipeStart.bind(this))
      .on("pointerup", this.onSwipeEnd.bind(this))
      .on("pointerupoutside", this.onSwipeEnd.bind(this))
      .on("pointermove", this.onSwipeMove.bind(this));

    this.container.addChild(this.object);
  }

  onSwipeStart() {
    this.object.alpha = 0.5;
    this.isSwipping = true;
    this.movePositionX = this.object.x;
    this.movePositionY = this.object.y;
  }

  onSwipeMove(e) {
    if (this.isSwipping) {
      this.movePositionX += e.data.originalEvent.movementX;
      this.movePositionY += e.data.originalEvent.movementY;
    }
  }

  onSwipeEnd() {
    if (!this.isSwipping) return;
    const xAbs = Math.abs(this.object.x - this.movePositionX);
    const yAbs = Math.abs(this.object.y - this.movePositionY);
    if ((xAbs > 20 || yAbs > 20) && !(xAbs > 20 && yAbs > 20)) {
      const previousX = this.object.x;
      const previousY = this.object.y;

      let nextX = this.object.x;
      let nextY = this.object.y;

      if (xAbs > yAbs) {
        if (this.movePositionX < this.object.x) {
          nextX -= gameElSize;
        } else {
          nextX += gameElSize;
        }
      } else {
        if (this.movePositionY < this.object.y) {
          nextY -= gameElSize;
        } else {
          nextY += gameElSize;
        }
      }

      if (this.isInsideContainer(nextX, nextY)) {
        this.container.emit("swipe", previousX, previousY, nextX, nextY);
      }
    }

    this.object.alpha = 1;
    this.isSwipping = false;
    return;
  }

  isInsideContainer(x, y) {
    return (
      x <= this.container.width &&
      x >= 0 &&
      y <= this.container.height &&
      y >= 0
    );
  }
}

const texture = PIXI.Texture.from(img.default);

for (let col = 0; col < fieldSize; col++) {
  for (let row = 0; row < fieldSize; row++) {
    new GameEl(
      row * gameElSize,
      col * gameElSize,
      Math.random() * 0xffffff,
      container
    );
  }
}

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;
