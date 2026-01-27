/* DOM */

const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const gameOverScreen = document.querySelector("#game-over-screen");
const victoryScreen = document.querySelector("#victory-screen");

const startBtn = document.querySelector("#start-btn");
const restartBtn1 = document.querySelector("#restart-btn-1");
const restartBtn2 = document.querySelector("#restart-btn-2");

const gameBox = document.querySelector("#game-box");
const player = document.querySelector("#player");

const scoreValue = document.querySelector("#score-value");
const timeValue = document.querySelector("#time-value");

/* GAME VARIABLES */

let score = 0;
let timeLeft = 200;
let lives = 3;

let gameIntervalId = null;
let timerIntervalId = null;
let meteorSpawnIntervalId = null;
let starSpawnIntervalId = null;

const playerData = {
  x: 0,
  w: 140,
  h: 50,
  speed: 20,


};

let meteors = [];
let stars = [];

/* FUNCTIONS */

function showScreen(screenToShow) {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  victoryScreen.classList.add("hidden");

  screenToShow.classList.remove("hidden");

}

function updateHud() {
  scoreValue.textContent = score;
  timeValue.textContent = timeLeft;
}

function centerPlayer() {
  playerData.x = gameBox.clientWidth / 2 - playerData.w / 2;
  player.style.left = `${playerData.x}px`;

}

function keepPlayerInside() {
  const minX = 0;
  const maxX = gameBox.clientWidth - playerData.w;

  if (playerData.x < minX) playerData.x = minX;
  if (playerData.x > maxX) playerData.x = maxX;

}

function getPlayerY() {
  const bottom = 43;
  return gameBox.clientHeight - bottom - playerData.h;
}

/* LIVES */

function loseLife() {
  lives--;

  if (lives <= 0) {
    gameOver();

  }
}

/* METEORITES */

function spawnMeteor() {
  const meteor = new Meteor(gameBox);
  meteors.push(meteor);
}

function moveMeteors() {
  meteors.forEach((m) => m.move());
}

function cleanMeteors() {
  while (meteors.length > 0 && meteors[0].y > gameBox.clientHeight) {
    meteors[0].node.remove();
    meteors.shift();
  }
}

function checkMeteorCollisions() {
  const playerY = getPlayerY();

  meteors.forEach((meteor) => {
    const isColliding =
      playerData.x < meteor.x + meteor.width &&
      playerData.x + playerData.w > meteor.x &&
      playerY < meteor.y + meteor.height &&
      playerY + playerData.h > meteor.y;

    if (isColliding) {
      meteor.node.remove();
      meteors = meteors.filter((m) => m !== meteor);
      loseLife();
    }
  });
}

/* STARS */

function spawnStar() {
  const star = new Star(gameBox);
  stars.push(star);
}

function moveStars() {
  stars.forEach((s) => s.move());
}

function cleanStars() {
  while (stars.length > 0 && stars[0].y > gameBox.clientHeight) {
    stars[0].node.remove();
    stars.shift();
  }
}

function checkStarCollisions() {
  const playerY = getPlayerY();

  stars.forEach((star) => {
    const isColliding =
      playerData.x < star.x + star.width &&
      playerData.x + playerData.w > star.x &&
      playerY < star.y + star.height &&
      playerY + playerData.h > star.y;

    if (isColliding) {
      star.node.remove();
      stars = stars.filter((s) => s !== star);

      score += 10;
      updateHud();
    }

  });

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

/* GAME LOOP */

function gameLoop() {
  moveMeteors();
  cleanMeteors();
  checkMeteorCollisions();

  moveStars();
  cleanStars();
  checkStarCollisions();
}

/* START/STOP game */

function startGame() {
  // reset state
  score = 0;
  timeLeft = 200;
  lives = 3;

  updateHud();
  centerPlayer();

  // removing the old objects from previous games
  meteors.forEach((m) => m.node.remove());
  meteors = [];
  stars.forEach((s) => s.node.remove());
  stars = [];

  // stop loops

  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
  clearInterval(meteorSpawnIntervalId);
  clearInterval(starSpawnIntervalId);

  // start loops

  gameIntervalId = setInterval(gameLoop, Math.round(1000 / 60));
  meteorSpawnIntervalId = setInterval(spawnMeteor, 900);

  // stars the spawn

  starSpawnIntervalId = setInterval(spawnStar, 1200);

  startTimer();
}

function stopGame() { // stop loops
  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
  clearInterval(meteorSpawnIntervalId);
  clearInterval(starSpawnIntervalId);
}

function winGame() { // stop loops
  stopGame();
  showScreen(victoryScreen);
}

function gameOver() { // stop loops
  stopGame();
  showScreen(gameOverScreen);
}

/* EVENTS LISTENERS */

startBtn.addEventListener("click", () => {
  showScreen(gameScreen);
  startGame();
});

restartBtn1.addEventListener("click", () => {
  showScreen(gameScreen);
  startGame();
});

restartBtn2.addEventListener("click", () => {
  showScreen(gameScreen);
  startGame();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") playerData.x -= playerData.speed;
  if (event.key === "ArrowRight") playerData.x += playerData.speed;

  keepPlayerInside();
  player.style.left = `${playerData.x}px`;
});



/* STRUCTURE of the JS FILE:
1. DOM elements
2. Game variables
3. Functions
4. Event listeners
*/