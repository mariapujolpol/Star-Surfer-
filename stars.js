class Star {

  constructor(gameBox) {
    this.gameBox = gameBox;

    this.node = document.createElement("img");
    this.node.src = "./Star-Surfer-/images/Elements/star.png";
    this.node.className = "star";
    this.gameBox.appendChild(this.node);

    this.width = 60;
    this.height = 60;

    this.x = Math.random() * (this.gameBox.clientWidth - this.width);
    this.y = -this.height;

    this.speed = 3;

    this.node.style.position = "absolute";
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }

  move() {
    this.y += this.speed;
    this.node.style.top = `${this.y}px`;
  }
  
}