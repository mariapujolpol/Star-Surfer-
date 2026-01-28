/* DOM */ /*Guardo las referencias a elementos del HTML una sola vez y luego reutilizo*/
// screens
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const victoryScreenNode = document.querySelector("#victory-screen");

// buttons
const startBtnNode = document.querySelector("#start-btn");
const restartBtn1Node = document.querySelector("#restart-btn-1");
const restartBtn2Node = document.querySelector("#restart-btn-2");

// game box + hud
const gameBoxNode = document.querySelector("#game-box");
const scoreValueNode = document.querySelector("#score-value");
const timeValueNode = document.querySelector("#time-value");


// music
const hitSound = new Audio("Star-Surfer-/Music/Meteorite Hit.wav");
hitSound.volume = 0.4;
const starSound = new Audio("./Star-Surfer-/Music/starsound.mp3");

starSound.volume = 0.3;
const backgroundMusic = new Audio("Star-Surfer-/Music/backmusic.mp3"); //*
backgroundMusic.loop = true;
backgroundMusic.volume = 0.4; //volumen 0 a 1
/*Si un querySelector devuelve null (porque el elemento no existe en el HTML obviamente)

/* GLOBAL GAME VARIABLES */
/*Estas son v globales porque todo el juego necesita acceder y modificarlas*/

let score = 0;
let timeLeft = 60;
let lives = 3;

let playerObj = null;

/* interval IDs */
let gameIntervalId = null;
let timerIntervalId = null;
let meteorSpawnIntervalId = null;
let starSpawnIntervalId = null;

/* arrays */
let meteorArr = [];
let starArr = [];

/* FUNCTIONS */


/*En showScreen uso la clase hidden en vez de style.display porque separo la lógica (JS) del estilo/diseño (CSS)*, en JS pone y  o quita clases y CSS decide como se ve*/
/*Oculos todas las pantallas para que nunca queden dos pantallas visibles a la vez*/ 

function showScreen(screenToShow) {
  startScreenNode.classList.add("hidden");
  gameScreenNode.classList.add("hidden");
  gameOverScreenNode.classList.add("hidden");
  victoryScreenNode.classList.add("hidden");

  screenToShow.classList.remove("hidden");
}

function updateHud() {
  scoreValueNode.textContent = score;
  timeValueNode.textContent = timeLeft;
}

function startGame() {
  // 1) show game screen
  showScreen(gameScreenNode);

  showScreen(gameScreenNode);

  backgroundMusic.currentTime = 0;
  backgroundMusic.play();

  // 2) reset state
  score = 0;
  timeLeft = 60;
  lives = 3;

  // 3) UI
  updateHud();

  // 4) remove old objects
  meteorArr.forEach((m) => m.node.remove());
  starArr.forEach((s) => s.node.remove());
  meteorArr = [];
  starArr = [];

  // 5) stop intervals (safety)
  stopGame();

  // 6) reset player
  if (playerObj) playerObj.remove();
  playerObj = new Player(gameBoxNode);

  // 7) start loops
  gameIntervalId = setInterval(gameLoop, Math.round(1000 / 60)); // Necesito un loop para el juego para poder actualizar constantemente; mover obj, comprobar colisiones...Sin loop no hay juego.
                                                  //1000/60 es estandar para juegos (60fps)
  meteorSpawnIntervalId = setInterval(spawnMeteor, 900);
  starSpawnIntervalId = setInterval(spawnStar, 1200);

  // 8) timer
  startTimer();
}

function gameLoop() {


  // meteors
  meteorArr.forEach((m) => m.move());
  meteorDespawnCheck();
  collisionPlayerMeteor();
  
  

  // stars
  starArr.forEach((s) => s.move());
  starDespawnCheck();
  collisionPlayerStar();
}





function stopGame() {
  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
  clearInterval(meteorSpawnIntervalId);
  clearInterval(starSpawnIntervalId);
}

/* SPAWN */
function spawnMeteor() {
  const meteorObj = new Meteor(gameBoxNode);
  meteorArr.push(meteorObj);
}

function spawnStar() {
  const starObj = new Star(gameBoxNode);
  starArr.push(starObj);
}

/* DESPAWN */
function meteorDespawnCheck() {
  if (meteorArr.length === 0) return;

  while (meteorArr.length > 0 && meteorArr[0].y > gameBoxNode.clientHeight) {
    meteorArr[0].node.remove();
    meteorArr.shift();
  }
}

function starDespawnCheck() {
  if (starArr.length === 0) return;

  while (starArr.length > 0 && starArr[0].y > gameBoxNode.clientHeight) {
    starArr[0].node.remove();
    starArr.shift();
  }
}

/* COLLISIONS */
function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function collisionPlayerMeteor() {
  if (!playerObj) return;
  const playerRect = playerObj.getRect();

  meteorArr.forEach((meteorObj) => {
    const meteorRect = {
      x: meteorObj.x,
      y: meteorObj.y,
      width: meteorObj.width,
      height: meteorObj.height,
    };

    const isColliding = checkCollision(playerRect, meteorRect);

    if (isColliding) {
      hitSound.currentTime = 0;
      hitSound.play();

      meteorObj.node.remove();
      meteorArr = meteorArr.filter((m) => m !== meteorObj);
      loseLife();
    }
  });
}

function collisionPlayerStar() {
  if (!playerObj) return;
  const playerRect = playerObj.getRect();

  starArr.forEach((starObj) => {
    const starRect = {
      x: starObj.x,
      y: starObj.y,
      width: starObj.width,
      height: starObj.height,
    };

    const isColliding = checkCollision(playerRect, starRect);

    if (isColliding) {
      starSound.currentTime = 0;
      starSound.play();

      starObj.node.remove();
      starArr = starArr.filter((s) => s !== starObj);

      score += 10;
      updateHud();
    }
  });
}

/* LIVES + END SCREENS */
function loseLife() {
  lives--;

  if (lives <= 0) {
    gameOver();
  }
}

function gameOver() {
  stopGame();

  // limpiar objetos del juego (para que no se queden encima)
  meteorArr.forEach((m) => m.node.remove());
  starArr.forEach((s) => s.node.remove());
  meteorArr = [];
  starArr = [];

  // quitar player
  if (playerObj) {
    playerObj.remove();
    playerObj = null;
  }

  showScreen(gameOverScreenNode);
}

function winGame() {
  stopGame();

  meteorArr.forEach((m) => m.node.remove());
  starArr.forEach((s) => s.node.remove());
  meteorArr = [];
  starArr = [];

  if (playerObj) {
    playerObj.remove();
    playerObj = null;
  }

  showScreen(victoryScreenNode);
}


/* TIMER */
function startTimer() {
  clearInterval(timerIntervalId);

  timerIntervalId = setInterval(() => {
    timeLeft--;
    updateHud();

    if (timeLeft <= 0) {
      winGame();
    }
  }, 1000);
}

/* EVENT LISTENERS */
startBtnNode.addEventListener("click", startGame);

if (restartBtn1Node) restartBtn1Node.addEventListener("click", startGame);
if (restartBtn2Node) restartBtn2Node.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (!playerObj) return;

  if (event.key === "ArrowLeft") playerObj.moveLeft();
  if (event.key === "ArrowRight") playerObj.moveRight();
});
