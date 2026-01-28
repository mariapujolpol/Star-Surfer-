class Meteor {

  constructor(gameBox) {
    this.gameBox = gameBox;

    this.node = document.createElement("img");
    this.node.src = "./Star-Surfer-/images/Elements/meteorite.png";
    this.node.className = "meteorite";
    this.gameBox.appendChild(this.node);

    this.width = 80;
    this.height = 80;

    this.x = Math.random() * (this.gameBox.clientWidth - this.width); /*es la posición horizontal aleatoria para los meteoritos*/
    this.y = -this.height;

    this.speed = Math.floor (Math.random() * 3) + 1;



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

