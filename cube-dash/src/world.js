/**
 * @param {number} worldOffset Current horizontal scroll offset.
 * @param {number} dt Delta time in milliseconds since the last update.
 * @param {number} speed Scroll speed in pixels per millisecond.
 * @return {number} The new world offset advanced by speed * dt.
 */
function advanceWorld(worldOffset, dt, speed) {
  return worldOffset + speed * dt;
}

/**
 * @param {number} worldOffset Current horizontal scroll offset.
 * @param {number} finishX World x position of the level's finish line.
 * @param {number} playerX Player's fixed x position on screen.
 * @return {boolean} True once the finish line has scrolled up to or past
 *     the player.
 */
function hasReachedFinish(worldOffset, finishX, playerX) {
  return finishX - worldOffset <= playerX;
}

if (typeof module !== 'undefined') {
  module.exports = {advanceWorld, hasReachedFinish};
}
