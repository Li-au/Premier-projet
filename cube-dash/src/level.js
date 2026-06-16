/**
 * @param {Array<{worldX: number, width: number, height: number}>} level
 * @param {number} worldOffset Current horizontal scroll offset.
 * @param {number} screenWidth Width of the visible viewport in pixels.
 * @return {Array<{worldX: number, width: number, height: number,
 *     screenX: number}>} The obstacles currently visible on screen, each
 *     with a screenX position derived from worldX - worldOffset.
 */
function getVisibleObstacles(level, worldOffset, screenWidth) {
  return level
      .map((obstacle) => ({...obstacle, screenX: obstacle.worldX - worldOffset}))
      .filter((obstacle) => obstacle.screenX + obstacle.width > 0 &&
          obstacle.screenX < screenWidth);
}

if (typeof module !== 'undefined') {
  module.exports = {getVisibleObstacles};
}
