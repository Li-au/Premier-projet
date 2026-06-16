const PLAYER_SIZE = 30;
const PLAYER_X = 80;
const GROUND_COLOR = '#1d1f27';
const GROUND_MARK_COLOR = '#34384a';
const GROUND_MARK_SPACING = 60;
const GROUND_MARK_WIDTH = 4;
const WORLD_SPEED = 0.4;
const ROTATION_SPEED = 0.006;
const OBSTACLE_COLOR = '#e44d4d';
const TEXT_COLOR = '#f4f4f4';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let state;
let player;
let worldOffset;
let playerRotation;
let jumpRequested = false;
let lastTimestamp = null;
let gameState = 'title';

function resetGame() {
  state = {elapsedTime: 0};
  player = {y: GROUND_Y, velocityY: 0, onGround: true};
  worldOffset = 0;
  playerRotation = 0;
}

resetGame();

function getPlayerRect() {
  return {x: PLAYER_X, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE};
}

function getObstacleRect(obstacle, groundLineY) {
  return {
    x: obstacle.screenX,
    y: groundLineY - obstacle.height,
    width: obstacle.width,
    height: obstacle.height,
  };
}

function requestAction() {
  const previousState = gameState;
  const nextState = transitionGameState(previousState, 'ACTION_PRESSED');
  if (nextState === 'playing' && previousState !== 'playing') {
    resetGame();
  } else if (previousState === 'playing') {
    jumpRequested = true;
  }
  gameState = nextState;
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    requestAction();
  }
});

canvas.addEventListener('click', requestAction);

function update(dt) {
  if (gameState !== 'playing') {
    jumpRequested = false;
    return;
  }

  state = updateGameTime(state, dt);
  player = updatePlayerPhysics(player, dt, {jumpPressed: jumpRequested});
  worldOffset = advanceWorld(worldOffset, dt, WORLD_SPEED);
  jumpRequested = false;

  if (player.onGround) {
    playerRotation = 0;
  } else {
    playerRotation += ROTATION_SPEED * dt;
  }

  const groundLineY = GROUND_Y + PLAYER_SIZE;
  const playerRect = getPlayerRect();
  const visibleObstacles = getVisibleObstacles(LEVEL, worldOffset, canvas.width);
  for (const obstacle of visibleObstacles) {
    if (checkCollision(playerRect, getObstacleRect(obstacle, groundLineY))) {
      gameState = transitionGameState(gameState, 'COLLISION');
      break;
    }
  }
}

function renderWorld() {
  const groundLineY = GROUND_Y + PLAYER_SIZE;
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, groundLineY, canvas.width, canvas.height - groundLineY);

  ctx.fillStyle = GROUND_MARK_COLOR;
  const scrolledOffset = worldOffset % GROUND_MARK_SPACING;
  for (let x = -scrolledOffset; x < canvas.width; x += GROUND_MARK_SPACING) {
    ctx.fillRect(x, groundLineY, GROUND_MARK_WIDTH, canvas.height - groundLineY);
  }

  ctx.fillStyle = OBSTACLE_COLOR;
  const visibleObstacles = getVisibleObstacles(LEVEL, worldOffset, canvas.width);
  for (const obstacle of visibleObstacles) {
    ctx.beginPath();
    ctx.moveTo(obstacle.screenX, groundLineY);
    ctx.lineTo(obstacle.screenX + obstacle.width, groundLineY);
    ctx.lineTo(obstacle.screenX + obstacle.width / 2, groundLineY - obstacle.height);
    ctx.closePath();
    ctx.fill();
  }

  const playerCenterX = PLAYER_X + PLAYER_SIZE / 2;
  const playerCenterY = player.y + PLAYER_SIZE / 2;
  ctx.save();
  ctx.translate(playerCenterX, playerCenterY);
  ctx.rotate(playerRotation);
  ctx.fillStyle = getPlayerColor(state.elapsedTime);
  ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
  ctx.restore();
}

function renderOverlayText(title, subtitle) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'center';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '18px sans-serif';
  ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderWorld();

  if (gameState === 'title') {
    renderOverlayText('CUBE DASH', 'Espace ou clic pour commencer');
  } else if (gameState === 'game_over') {
    renderOverlayText('Game Over', 'Espace ou clic pour recommencer');
  }
}

function tick(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }
  const dt = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  update(dt);
  render();

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
