/**
 * @param {number} worldOffset Current horizontal scroll offset.
 * @param {number} dt Delta time in milliseconds since the last update.
 * @param {number} speed Scroll speed in pixels per millisecond.
 * @return {number} The new world offset advanced by speed * dt.
 */
function advanceWorld(worldOffset, dt, speed) {
  return worldOffset + speed * dt;
}

if (typeof module !== 'undefined') {
  module.exports = {advanceWorld};
}
