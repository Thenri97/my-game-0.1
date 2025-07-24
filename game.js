const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mainMenu = document.getElementById('mainMenu');
const pauseMenu = document.getElementById('pauseMenu');
const startButton = document.getElementById('startButton');
const resumeButton = document.getElementById('resumeButton');
const quitButton = document.getElementById('quitButton');

let gameState = 'menu'; // 'menu', 'playing', 'paused'

const player = {
  x: 50,
  y: canvas.height - 70,
  width: 50,
  height: 50,
  color: 'blue',
  dy: 0,
  dx: 0,
  speed: 5,
  gravity: 1,
  jumpStrength: -20,
  isJumping: false
};

const platforms = [
  { x: 0, y: canvas.height - 20, width: canvas.width, height: 20, color: 'brown' },
  { x: 200, y: canvas.height - 100, width: 150, height: 20, color: 'brown' },
  { x: 400, y: canvas.height - 150, width: 150, height: 20, color: 'brown' },
  { x: 600, y: canvas.height - 200, width: 150, height: 20, color: 'brown' }
];

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  platforms.forEach(platform => {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function update() {
  if (gameState === 'playing') {
    // Apply gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Apply horizontal movement
    player.x += player.dx;

    // Collision detection with platforms
    platforms.forEach(platform => {
      if (player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y + player.height > platform.y &&
          player.y + player.height < platform.y + platform.height + player.dy) {
        player.y = platform.y - player.height;
        player.dy = 0;
        player.isJumping = false;
      }
    });

    // Prevent player from falling off the bottom
    if (player.y + player.height > canvas.height) {
      player.y = canvas.height - player.height;
      player.dy = 0;
      player.isJumping = false;
    }

    // Prevent player from moving off the sides
    if (player.x < 0) {
      player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameState === 'playing' || gameState === 'paused') {
    drawPlatforms();
    drawPlayer();
  }
}

function gameLoop() {
  update();
  draw();

  if (gameState === 'playing' || gameState === 'paused') {
    requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  gameState = 'playing';
  mainMenu.style.display = 'none';
  pauseMenu.style.display = 'none';
  gameLoop();
}

function pauseGame() {
  gameState = 'paused';
  pauseMenu.style.display = 'flex';
}

function resumeGame() {
  gameState = 'playing';
  pauseMenu.style.display = 'none';
  gameLoop();
}

function quitGame() {
  gameState = 'menu';
  mainMenu.style.display = 'flex';
  pauseMenu.style.display = 'none';
  // Reset player position or reload the page if needed
  player.x = 50;
  player.y = canvas.height - 70;
  player.dy = 0;
  player.dx = 0;
}

// Handle input
document.addEventListener('keydown', (event) => {
  if (gameState === 'playing') {
    if (event.code === 'Space' && !player.isJumping) {
      player.dy = player.jumpStrength;
      player.isJumping = true;
    }
    if (event.code === 'ArrowLeft') {
      player.dx = -player.speed;
    }
    if (event.code === 'ArrowRight') {
      player.dx = player.speed;
    }
    if (event.code === 'Escape') {
      pauseGame();
    }

    // Trigger midgame ad on 'L' key press
    if (event.code === 'KeyL') {
      if (window.CrazyGames && window.CrazyGames.SDK) {
        const callbacks = {
          adFinished: () => {
            console.log("Midgame ad finished.");
            // Resume game or un-mute audio here if needed
          },
          adError: (error) => {
            console.error("Midgame ad error: ", error);
            // Resume game or un-mute audio here if needed
          },
          adStarted: () => {
            console.log("Midgame ad started.");
            // Pause game or mute audio here if needed
          },
        };
        window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
      } else {
        console.warn("CrazyGames SDK not available.");
      }
    }

  } else if (gameState === 'paused') {
    if (event.code === 'Escape') {
      resumeGame();
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (gameState === 'playing') {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      player.dx = 0;
    }
  }
});

startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', resumeGame);
quitButton.addEventListener('click', quitGame);

// Initial state
mainMenu.style.display = 'flex';
pauseMenu.style.display = 'none';
