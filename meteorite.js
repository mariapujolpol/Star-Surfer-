// meteorite.js

class Meteor {
  constructor(gameBox) {
    this.gameBox = gameBox;

    // 1) Create DOM node
    this.node = document.createElement("img");
    this.node.src = "./Star-Surfer-/images/Elements/meteorite.png";
    this.node.className = "meteorite";

    this.gameBox.appendChild(this.node);

    // 2) Size
    this.width = 80;
    this.height = 80;

    // 3) Position (random X, start above the screen)
    this.x = Math.random() * (this.gameBox.clientWidth - this.width);
    this.y = -this.height;

    // 4) Speed
    this.speed = 4;

    // 5) Styles
    this.node.style.position = "absolute";
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }

  // 6) Movement
  move() {
    this.y += this.speed;
    this.node.style.top = `${this.y}px`;
  }
}
