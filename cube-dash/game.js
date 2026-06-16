const PLAYER_SIZE = 30;
const PLAYER_X = 80;
const PLAYER_COLOR = '#f5a623';
const GROUND_COLOR = '#1d1f27';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let state = {elapsedTime: 0};
let player = {y: GROUND_Y, velocityY: 0, onGround: true};
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
  jumpRequested = false;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const groundLineY = GROUND_Y + PLAYER_SIZE;
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, groundLineY, canvas.width, canvas.height - groundLineY);

  ctx.fillStyle = PLAYER_COLOR;
  ctx.fillRect(PLAYER_X, player.y, PLAYER_SIZE, PLAYER_SIZE);
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
