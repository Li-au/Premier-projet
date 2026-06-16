/**
 * @param {{x: number, y: number, width: number, height: number}} rectA
 * @param {{x: number, y: number, width: number, height: number}} rectB
 * @return {boolean} True if the two axis-aligned rectangles overlap.
 */
function checkCollision(rectA, rectB) {
  return rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y;
}

if (typeof module !== 'undefined') {
  module.exports = {checkCollision};
}
