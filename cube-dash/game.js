import {updateGameTime} from './src/gameLoop.js';
import {updatePlayerPhysics, GROUND_Y} from './src/playerPhysics.js';

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
