const GROUND_Y = 300;
const GRAVITY = 0.0025;
const JUMP_VELOCITY = -0.8;

/**
 * @param {{y: number, velocityY: number, onGround: boolean}} player
 * @param {number} dt Delta time in milliseconds since the last update.
 * @param {{jumpPressed: boolean}} input
 * @return {{y: number, velocityY: number, onGround: boolean}} A new player
 *     state advanced by dt.
 */
function updatePlayerPhysics(player, dt, input) {
  let velocityY = player.velocityY;
  let onGround = player.onGround;

  if (onGround && input.jumpPressed) {
    velocityY = JUMP_VELOCITY;
    onGround = false;
  } else {
    velocityY += GRAVITY * dt;
  }

  let y = player.y + velocityY * dt;

  if (y >= GROUND_Y) {
    y = GROUND_Y;
    velocityY = 0;
    onGround = true;
  }

  return {y, velocityY, onGround};
}

if (typeof module !== 'undefined') {
  module.exports = {updatePlayerPhysics, GROUND_Y};
}
