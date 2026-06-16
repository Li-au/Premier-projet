import {updateGameTime} from './src/gameLoop.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let state = {elapsedTime: 0};
let lastTimestamp = null;

function update(dt) {
  state = updateGameTime(state, dt);
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
