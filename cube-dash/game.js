const PLAYER_SIZE = 30;
const PLAYER_X = 80;
const PLAYER_COLOR = '#f5a623';
const GROUND_COLOR = '#1d1f27';
const GROUND_MARK_COLOR = '#34384a';
const GROUND_MARK_SPACING = 60;
const GROUND_MARK_WIDTH = 4;
const WORLD_SPEED = 0.25;
const ROTATION_SPEED = 0.006;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let state = {elapsedTime: 0};
let player = {y: GROUND_Y, velocityY: 0, onGround: true};
let worldOffset = 0;
let playerRotation = 0;
let jumpRequested = false;
let lastTimestamp = null;

function requestJump() {
  jumpRequested = true;
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    requestJump();
  }
});

canvas.addEventListener('click', requestJump);

function update(dt) {
  state = updateGameTime(state, dt);
  player = updatePlayerPhysics(player, dt, {jumpPressed: jumpRequested});
  worldOffset = advanceWorld(worldOffset, dt, WORLD_SPEED);
  jumpRequested = false;

  if (player.onGround) {
    playerRotation = 0;
  } else {
    playerRotation += ROTATION_SPEED * dt;
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const groundLineY = GROUND_Y + PLAYER_SIZE;
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, groundLineY, canvas.width, canvas.height - groundLineY);

  ctx.fillStyle = GROUND_MARK_COLOR;
  const scrolledOffset = worldOffset % GROUND_MARK_SPACING;
  for (let x = -scrolledOffset; x < canvas.width; x += GROUND_MARK_SPACING) {
    ctx.fillRect(x, groundLineY, GROUND_MARK_WIDTH, canvas.height - groundLineY);
  }

  const playerCenterX = PLAYER_X + PLAYER_SIZE / 2;
  const playerCenterY = player.y + PLAYER_SIZE / 2;
  ctx.save();
  ctx.translate(playerCenterX, playerCenterY);
  ctx.rotate(playerRotation);
  ctx.fillStyle = PLAYER_COLOR;
  ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
  ctx.restore();
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
