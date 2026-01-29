class Player {
  constructor(gameBox) {
    this.gameBox = gameBox;

    //node ceation
    this.node = document.createElement("img");
    this.node.src = "./Star-Surfer-/images/Elements/player_cropped.png"; 
    this.node.id = "player";
    this.node.className = "player";
    this.gameBox.appendChild(this.node);

    //size
    this.width = 70;
    this.height = 100;

    // position
    this.bottomOffset = 43;
    this.x = this.gameBox.clientWidth / 2 - this.width / 2;
    this.y = this.gameBox.clientHeight - this.bottomOffset - this.height;

    // speed
    this.speed = 20;

    //  styles
    this.node.style.position = "absolute";
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.draw();
  }
// methods

  draw() {
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }

  keepInside() {
    const minX = 0;
    const maxX = this.gameBox.clientWidth - this.width;
    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;
  }

  moveLeft() {
    this.x -= this.speed;
    this.keepInside();
    this.draw();
  }

  moveRight() {
    this.x += this.speed;
    this.keepInside();
    this.draw();
  }

  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  remove() {
    this.node.remove();
  }
}






