const PLAYER_X = 80;
const GROUND_COLOR = '#4caf6e';
const GROUND_MARK_COLOR = '#3d8e59';
const GROUND_MARK_SPACING = 60;
const GROUND_MARK_WIDTH = 4;
const ROTATION_SPEED = 0.006;
const OBSTACLE_COLOR = '#1a1a1a';
const TEXT_COLOR = '#f4f4f4';
const SUN_COLOR = '#ffce54';
const HILL_FAR_COLOR = '#9b7fc4';
const HILL_NEAR_COLOR = '#6c54a3';
const LEVEL_CELL_COLOR = '#3a6ea5';
const LEVEL_CELL_TEXT_COLOR = '#f4f4f4';
const NUM_LEVELS = 5;
const PAUSE_BUTTON_COLOR = '#3a6ea5';
const PAUSE_BUTTON_WIDTH = 220;
const PAUSE_BUTTON_HEIGHT = 50;
const PAUSE_BUTTON_GAP = 20;
const PLATFORM_COLOR = '#8a5a3a';
const PLATFORM_THICKNESS = 16;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let state;
let player;
let worldOffset;
let playerRotation;
let jumpRequested = false;
let lastTimestamp = null;
let gameState = 'title';
let currentLevel = getLevel(1);

function resetGame() {
  state = {elapsedTime: 0};
  player = {y: GROUND_Y, velocityY: 0, onGround: true};
  worldOffset = 0;
  playerRotation = 0;
}

resetGame();

function getPlayerRect() {
  return {x: PLAYER_X, y: player.y, width: PLAYER_HEIGHT, height: PLAYER_HEIGHT};
}

function getLevelGridCells() {
  const layout = getLevelGridLayout(NUM_LEVELS, canvas.width);
  const gridY = canvas.height / 2 - CELL_SIZE / 2;
  return layout.map((cell) => ({...cell, y: gridY}));
}

function getPauseMenuButtons() {
  const totalHeight = 2 * PAUSE_BUTTON_HEIGHT + PAUSE_BUTTON_GAP;
  const startX = (canvas.width - PAUSE_BUTTON_WIDTH) / 2;
  const startY = canvas.height / 2 - totalHeight / 2;
  return [
    {
      id: 'resume',
      label: 'Reprendre',
      x: startX,
      y: startY,
      width: PAUSE_BUTTON_WIDTH,
      height: PAUSE_BUTTON_HEIGHT,
    },
    {
      id: 'select',
      label: 'Choix du niveau',
      x: startX,
      y: startY + PAUSE_BUTTON_HEIGHT + PAUSE_BUTTON_GAP,
      width: PAUSE_BUTTON_WIDTH,
      height: PAUSE_BUTTON_HEIGHT,
    },
  ];
}

function requestAction() {
  const previousState = gameState;
  const nextState = transitionGameState(previousState, 'ACTION_PRESSED');
  if (nextState === 'playing' && previousState === 'game_over') {
    resetGame();
  } else if (previousState === 'playing') {
    jumpRequested = true;
  }
  gameState = nextState;
}

function selectLevel(id) {
  if (gameState !== 'level_select') {
    return;
  }
  const level = getLevel(id);
  if (!level) {
    return;
  }
  currentLevel = level;
  gameState = transitionGameState(gameState, 'LEVEL_SELECTED');
  resetGame();
}

const LEVEL_SELECT_KEYS = {
  Digit1: 1,
  Digit2: 2,
  Digit3: 3,
  Digit4: 4,
  Digit5: 5,
};

function requestPauseToggle() {
  if (gameState === 'playing') {
    gameState = transitionGameState(gameState, 'PAUSE');
  } else if (gameState === 'paused') {
    gameState = transitionGameState(gameState, 'RESUME');
  }
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    requestAction();
  } else if (event.code === 'Escape') {
    requestPauseToggle();
  } else if (event.code in LEVEL_SELECT_KEYS) {
    selectLevel(LEVEL_SELECT_KEYS[event.code]);
  }
});

function getCanvasPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function isPointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width &&
      y >= rect.y && y <= rect.y + rect.height;
}

function handleLevelSelectClick(event) {
  const {x, y} = getCanvasPosition(event);
  for (const cell of getLevelGridCells()) {
    if (isPointInRect(x, y, cell)) {
      selectLevel(cell.id);
      return;
    }
  }
}

function handlePausedClick(event) {
  const {x, y} = getCanvasPosition(event);
  for (const button of getPauseMenuButtons()) {
    if (isPointInRect(x, y, button)) {
      if (button.id === 'resume') {
        gameState = transitionGameState(gameState, 'RESUME');
      } else if (button.id === 'select') {
        gameState = transitionGameState(gameState, 'QUIT_TO_SELECT');
      }
      return;
    }
  }
}

canvas.addEventListener('click', (event) => {
  if (gameState === 'level_select') {
    handleLevelSelectClick(event);
  } else if (gameState === 'paused') {
    handlePausedClick(event);
  } else {
    requestAction();
  }
});

function update(dt) {
  if (gameState !== 'playing') {
    jumpRequested = false;
    return;
  }

  state = updateGameTime(state, dt);

  const groundLineY = GROUND_Y + PLAYER_HEIGHT;
  const blockPlatforms = currentLevel.obstacles
      .filter((obstacle) => obstacle.type === 'block')
      .map((obstacle) => ({
        worldX: obstacle.worldX,
        width: obstacle.width,
        top: groundLineY - obstacle.height,
      }));
  const allPlatforms = [...currentLevel.platforms, ...blockPlatforms];
  const platformsUnderPlayer = getPlatformsUnderPlayer(
      allPlatforms, worldOffset, PLAYER_X, PLAYER_HEIGHT);
  player = resolvePlayerPhysics(
      player, dt, {jumpPressed: jumpRequested}, platformsUnderPlayer);
  worldOffset = advanceWorld(worldOffset, dt, currentLevel.speed);
  jumpRequested = false;

  if (player.onGround) {
    playerRotation = 0;
  } else {
    playerRotation += ROTATION_SPEED * dt;
  }

  const playerRect = getPlayerRect();
  const visibleObstacles = getVisibleObstacles(currentLevel.obstacles, worldOffset, canvas.width);
  for (const obstacle of visibleObstacles) {
    if (checkCollision(playerRect, getObstacleRect(obstacle, groundLineY))) {
      gameState = transitionGameState(gameState, 'COLLISION');
      break;
    }
  }
}

function renderHillRow(color, baseY, amplitude, spacing, parallaxOffset) {
  ctx.fillStyle = color;
  const scrolledOffset = parallaxOffset % spacing;
  for (let x = -scrolledOffset - spacing; x < canvas.width + spacing; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x + spacing / 2, baseY - amplitude);
    ctx.lineTo(x + spacing, baseY);
    ctx.closePath();
    ctx.fill();
  }
}

function renderBackground(groundLineY) {
  ctx.fillStyle = SUN_COLOR;
  ctx.beginPath();
  ctx.arc(canvas.width - 90, 70, 32, 0, Math.PI * 2);
  ctx.fill();

  renderHillRow(HILL_FAR_COLOR, groundLineY, 60, 140, worldOffset * 0.2);
  renderHillRow(HILL_NEAR_COLOR, groundLineY, 40, 100, worldOffset * 0.4);
}

function renderWorld() {
  const groundLineY = GROUND_Y + PLAYER_HEIGHT;
  renderBackground(groundLineY);

  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, groundLineY, canvas.width, canvas.height - groundLineY);

  ctx.fillStyle = GROUND_MARK_COLOR;
  const scrolledOffset = worldOffset % GROUND_MARK_SPACING;
  for (let x = -scrolledOffset; x < canvas.width; x += GROUND_MARK_SPACING) {
    ctx.fillRect(x, groundLineY, GROUND_MARK_WIDTH, canvas.height - groundLineY);
  }

  ctx.fillStyle = PLATFORM_COLOR;
  const visiblePlatforms = getVisibleObstacles(currentLevel.platforms, worldOffset, canvas.width);
  for (const platform of visiblePlatforms) {
    ctx.fillRect(platform.screenX, platform.top, platform.width, PLATFORM_THICKNESS);
  }

  ctx.fillStyle = OBSTACLE_COLOR;
  const visibleObstacles = getVisibleObstacles(currentLevel.obstacles, worldOffset, canvas.width);
  for (const obstacle of visibleObstacles) {
    if (obstacle.type === 'block') {
      ctx.fillRect(obstacle.screenX, groundLineY - obstacle.height, obstacle.width, obstacle.height);
    } else {
      ctx.beginPath();
      ctx.moveTo(obstacle.screenX, groundLineY);
      ctx.lineTo(obstacle.screenX + obstacle.width, groundLineY);
      ctx.lineTo(obstacle.screenX + obstacle.width / 2, groundLineY - obstacle.height);
      ctx.closePath();
      ctx.fill();
    }
  }

  const playerCenterX = PLAYER_X + PLAYER_HEIGHT / 2;
  const playerCenterY = player.y + PLAYER_HEIGHT / 2;
  ctx.save();
  ctx.translate(playerCenterX, playerCenterY);
  ctx.rotate(playerRotation);
  ctx.fillStyle = getPlayerColor(state.elapsedTime);
  ctx.fillRect(-PLAYER_HEIGHT / 2, -PLAYER_HEIGHT / 2, PLAYER_HEIGHT, PLAYER_HEIGHT);
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

function renderLevelGrid() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Choisis un niveau', canvas.width / 2, canvas.height / 2 - 70);

  for (const cell of getLevelGridCells()) {
    ctx.fillStyle = LEVEL_CELL_COLOR;
    ctx.fillRect(cell.x, cell.y, cell.width, cell.height);

    ctx.fillStyle = LEVEL_CELL_TEXT_COLOR;
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(String(cell.id), cell.x + cell.width / 2, cell.y + cell.height / 2 + 8);
  }
}

function renderPauseMenu() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px sans-serif';
  const firstButton = getPauseMenuButtons()[0];
  ctx.fillText('Pause', canvas.width / 2, firstButton.y - 30);

  for (const button of getPauseMenuButtons()) {
    ctx.fillStyle = PAUSE_BUTTON_COLOR;
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = TEXT_COLOR;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(button.label, button.x + button.width / 2, button.y + button.height / 2 + 6);
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderWorld();

  if (gameState === 'title') {
    renderOverlayText('CUBE DASH', 'Espace ou clic pour commencer');
  } else if (gameState === 'level_select') {
    renderLevelGrid();
  } else if (gameState === 'paused') {
    renderPauseMenu();
  } else if (gameState === 'game_over') {
    renderOverlayText('Game Over', 'Espace ou clic pour recommencer');
  } else if (gameState === 'playing') {
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = 'left';
    ctx.font = '14px sans-serif';
    ctx.fillText('Échap : pause', 10, 20);
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
