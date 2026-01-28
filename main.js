/* DOM */ // Save with variables to the elements from the HTML
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
const playerNode = document.querySelector("#player");

const scoreValueNode = document.querySelector("#score-value");
const timeValueNode = document.querySelector("#time-value");


//* GLOBAL GAME VARIABLES
// I save here all the variables
let score = 0;
let timeLeft = 60;
let lives = 3;


// I save here all the interval IDs
let gameIntervalId = null;
let timerIntervalId = null;
let meteorSpawnIntervalId = null;
let starSpawnIntervalId = null;

// player data object to store position, size, speed etc
const playerData = {
  x: 0,
  w: 140,
  h: 50,
  speed: 20,
};

// arrays to hold meteor and star objects
let meteorArr = [];
let starArr = [];


//* GLOBAL GAME FUNCTIONS

//hides all screens and shows only the selected one

function showScreen(screenToShow) {
  startScreenNode.classList.add("hidden");
  gameScreenNode.classList.add("hidden");
  gameOverScreenNode.classList.add("hidden");
  victoryScreenNode.classList.add("hidden");

  screenToShow.classList.remove("hidden");
}

//adds score and time to the hud 
function updateHud() {
  scoreValueNode.textContent = score;
  timeValueNode.textContent = timeLeft;
}


//centers the playyer at teh center of the game box
function centerPlayer() {
  playerData.x = gameBoxNode.clientWidth / 2 - playerData.w / 2;
  playerNode.style.left = `${playerData.x}px`;
}


//avoid de player to go outside the game box/screen
function keepPlayerInside() {
  const minX = 0;
  const maxX = gameBoxNode.clientWidth - playerData.w;

  if (playerData.x < minX) playerData.x = minX;
  if (playerData.x > maxX) playerData.x = maxX;
}

function getPlayerY() {
  const bottom = 43;
  return gameBoxNode.clientHeight - bottom - playerData.h;
}


/** EVENT LISTENERS */

function startGame() {
  // 1. change states of the screens
  showScreen(gameScreenNode);

  // 2. reset state
  score = 0;
  timeLeft = 60;
  lives = 3;

  // 3. update UI + position
  updateHud();
  centerPlayer();

  // 4. remove old objects from previous games
  meteorArr.forEach((m) => m.node.remove());
  starArr.forEach((s) => s.node.remove());
  meteorArr = [];
  starArr = [];

  // 5. stop ALL intervals (safety)
  stopGame();

  // 6. start the game loop
  gameIntervalId = setInterval(gameLoop, Math.round(1000 / 60)); // 60fps game loop

  // 7. start spawn intervals
  meteorSpawnIntervalId = setInterval(spawnMeteor, 900);
  starSpawnIntervalId = setInterval(spawnStar, 1200);

  // 8. start timer
  startTimer();
}

function gameLoop() {
  // all automated movements and all collision checks

  // meteors
  meteorArr.forEach((meteorObj) => meteorObj.move());
  meteorDespawnCheck();
  collisionPlayerMeteor();

  // stars
  starArr.forEach((starObj) => starObj.move());
  starDespawnCheck();
  collisionPlayerStar();
}

function stopGame() {
  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
  clearInterval(meteorSpawnIntervalId);
  clearInterval(starSpawnIntervalId);
}

/*Spawn Functions*/
function spawnMeteor() {
  const meteorObj = new Meteor(gameBoxNode);
  meteorArr.push(meteorObj);
}

function spawnStar() {
  const starObj = new Star(gameBoxNode);
  starArr.push(starObj);
}


/*Checks to despawn meteors and stars*/

function meteorDespawnCheck() {
  if (meteorArr.length === 0) return;

  // remove meteors that have left the game box
  while (meteorArr.length > 0 && meteorArr[0].y > gameBoxNode.clientHeight) {
    meteorArr[0].node.remove();
    meteorArr.shift();
  }
}

function starDespawnCheck() {
  if (starArr.length === 0) return;

  // remove stars that have left the game box
  while (starArr.length > 0 && starArr[0].y > gameBoxNode.clientHeight) {
    starArr[0].node.remove();
    starArr.shift();
  }
}


/*COLLISIONS*/

function checkCollision(obj1, obj2) { //AABB collision detection
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function collisionPlayerMeteor() {
  const playerObj = {
    x: playerData.x,
    y: getPlayerY(),
    width: playerData.w,
    height: playerData.h,
  };

  meteorArr.forEach((meteorObj) => {
    const meteorRect = {
      x: meteorObj.x,
      y: meteorObj.y,
      width: meteorObj.width,
      height: meteorObj.height,
    };

    const isColliding = checkCollision(playerObj, meteorRect);

    if (isColliding) {
      meteorObj.node.remove();
      meteorArr = meteorArr.filter((m) => m !== meteorObj);
      loseLife();
    }
  });
}

function collisionPlayerStar() {
  const playerObj = {
    x: playerData.x,
    y: getPlayerY(),
    width: playerData.w,
    height: playerData.h,
  };

  starArr.forEach((starObj) => {
    const starRect = {
      x: starObj.x,
      y: starObj.y,
      width: starObj.width,
      height: starObj.height,
    };

    const isColliding = checkCollision(playerObj, starRect);

    if (isColliding) {
      starObj.node.remove();
      starArr = starArr.filter((s) => s !== starObj);

      score += 10;
      updateHud();
    }
  });
}


/* Lives and Game Over/Win */
function loseLife() {
  lives--;

  if (lives <= 0) {
    gameOver();
  }
}

function gameOver() {
  // 1. stop all intervals
  stopGame();

  // 2. change states of the screens
  showScreen(gameOverScreenNode);
}

function winGame() {
  stopGame();
  showScreen(victoryScreenNode);
}


/*Timer*/

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


//* EVENT LISTENERS

startBtnNode.addEventListener("click", startGame);

restartBtn1Node.addEventListener("click", startGame);
restartBtn2Node.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") playerData.x -= playerData.speed;
  if (event.key === "ArrowRight") playerData.x += playerData.speed;

  keepPlayerInside();
  playerNode.style.left = `${playerData.x}px`;
});



/* STRUCTURE of the JS FILE:

// DOM
// buttons
// game box + hud
// start screen
// game screen
// game over screen
// victory screen

// GLOBAL GAME VARIABLES  

// functions
// spawn functions
// collision functions
// event listeners

// EVENT LISTENERS
// start button
// restart buttons
// player movement
// any other event listeners
*/  