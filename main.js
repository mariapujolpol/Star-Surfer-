/*DOM ELEMENTS*/

const gameScreen = document.querySelector("#game-screen");
const gameOverScreen = document.querySelector("#game-over-screen");
const victoryScreen = document.querySelector("#victory-screen");

const startBtn = document.querySelector("#start-btn");

const gameBox = document.querySelector("#game-box");
const player = document.querySelector("#player");

const scoreValue = document.querySelector("#score-value");
const timerValue = document.querySelector("#time-value");

/*GLOBAL VARIABLES*/

// HUD
let score = 0;
let timer = 200;

// Intervals
let gameIntervalId = null;
let timerIntervalId = null;
let meteorSpawnIntervalId = null;

// Player data
const playerA = {
  x: 80,
  w: 140,
  h: 50,
  speed: 10,
};

// Meteors
let meteorArr = [];

/*styles*/
player.style.position = "absolute";
player.style.width = `${playerA.w}px`;
player.style.bottom = "30px";

/*screen functions*/

function showScreen(screenToShow) {
  gameScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  victoryScreen.style.display = "none";

  screenToShow.style.display = "flex";
}

/* hud functions */
function resetHud() {
  score = 0;
  timer = 200;

  scoreValue.textContent = score;
  timerValue.textContent = timer;
}

function startTimer() {
  clearInterval(timerIntervalId);

  timerIntervalId = setInterval(() => {
    timer--;
    timerValue.textContent = timer;

    if (timer <= 0) {
      winGame();
    }
  }, 1000);
}

/*Player functions*/

function centerPlayer() {
  playerA.x = gameBox.clientWidth / 2 - playerA.w / 2;
  player.style.left = `${playerA.x}px`;
}

function keepPlayerInside() {
  const minX = 0;
  const maxX = gameBox.clientWidth - playerA.w;

  if (playerA.x < minX) playerA.x = minX;
  if (playerA.x > maxX) playerA.x = maxX;
}

function getPlayerY() {
  const bottom = 30;
  return gameBox.clientHeight - bottom - playerA.h;
}

/* Meteor functions */

function spawnMeteor() {
  const meteor = new Meteor(gameBox);
  meteorArr.push(meteor);
}

function moveMeteors() {
  meteorArr.forEach((meteor) => meteor.move());
}

function cleanMeteors() {
  while (meteorArr.length > 0 && meteorArr[0].y > gameBox.clientHeight) {
    meteorArr[0].node.remove();
    meteorArr.shift();
  }
}

function checkMeteorCollisions() {
  const playerY = getPlayerY();

  meteorArr.forEach((meteor) => {
    const isColliding =
      playerA.x < meteor.x + meteor.width &&
      playerA.x + playerA.w > meteor.x &&
      playerY < meteor.y + meteor.height &&
      playerY + playerA.h > meteor.y;

    if (isColliding) {
      gameOver();
    }
  });
}

/*Game functions*/

function startGame() {
  resetHud();
  centerPlayer();

  // clear old intervals
  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
  clearInterval(meteorSpawnIntervalId);

  // clear old meteors
  meteorArr.forEach((m) => m.node.remove());
  meteorArr = [];

  // start loops
  gameIntervalId = setInterval(gameLoop, Math.round(1000 / 60));
  startTimer();
  meteorSpawnIntervalId = setInterval(spawnMeteor, 900);
}

function stopGame() {
  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
  clearInterval(meteorSpawnIntervalId);
}

function winGame() {
  stopGame();
  showScreen(victoryScreen);
}

function gameOver() {
  stopGame();
  showScreen(gameOverScreen);
}

/* Game loop */

function gameLoop() {
  moveMeteors();
  cleanMeteors();
  checkMeteorCollisions();
}

/* EVENTS LISTENERS*/
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") playerA.x -= playerA.speed;
  if (event.key === "ArrowRight") playerA.x += playerA.speed;

  keepPlayerInside();
  player.style.left = `${playerA.x}px`;
});

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  showScreen(gameScreen);
  startGame();
});
