/**
 * @param {{screenX: number, width: number, height: number}} obstacle
 * @param {number} groundLineY The y coordinate of the ground surface.
 * @return {{x: number, y: number, width: number, height: number}} The
 *     bounding box of the obstacle, used for collision detection regardless
 *     of its visual type (spike or block).
 */
function getObstacleRect(obstacle, groundLineY) {
  return {
    x: obstacle.screenX,
    y: groundLineY - obstacle.height,
    width: obstacle.width,
    height: obstacle.height,
  };
}

if (typeof module !== 'undefined') {
  module.exports = {getObstacleRect};
}
