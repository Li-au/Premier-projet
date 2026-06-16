const GROUND_Y = 300;
const PLAYER_HEIGHT = 30;
const GROUND_SURFACE_TOP = GROUND_Y + PLAYER_HEIGHT;
const GRAVITY = 0.0025;
const JUMP_VELOCITY = -0.6;

/**
 * @param {{y: number, velocityY: number, onGround: boolean}} player
 * @param {number} dt Delta time in milliseconds since the last update.
 * @param {{jumpPressed: boolean}} input
 * @param {Array<{top: number}>} platforms Floating platforms currently
 *     overlapping the player horizontally, each described by the y
 *     coordinate of its top surface. The ground is always available as an
 *     implicit fallback surface in addition to these.
 * @return {{y: number, velocityY: number, onGround: boolean}} A new player
 *     state advanced by dt, landing on the highest surface (platform or
 *     ground) reached while falling this frame.
 */
function resolvePlayerPhysics(player, dt, input, platforms) {
  let velocityY = player.velocityY;
  let onGround = player.onGround;

  if (onGround && input.jumpPressed) {
    velocityY = JUMP_VELOCITY;
    onGround = false;
  } else {
    velocityY += GRAVITY * dt;
  }

  const previousBottom = player.y + PLAYER_HEIGHT;
  let y = player.y + velocityY * dt;
  const newBottom = y + PLAYER_HEIGHT;

  if (newBottom >= previousBottom) {
    const surfaceTops = [...platforms.map((platform) => platform.top), GROUND_SURFACE_TOP];
    const reachedSurfaceTops = surfaceTops.filter(
        (top) => top >= previousBottom && top <= newBottom);

    if (reachedSurfaceTops.length > 0) {
      const landingSurfaceTop = Math.min(...reachedSurfaceTops);
      y = landingSurfaceTop - PLAYER_HEIGHT;
      velocityY = 0;
      onGround = true;
      return {y, velocityY, onGround};
    }
  }

  onGround = false;
  return {y, velocityY, onGround};
}

if (typeof module !== 'undefined') {
  module.exports = {resolvePlayerPhysics, GROUND_Y, PLAYER_HEIGHT};
}
