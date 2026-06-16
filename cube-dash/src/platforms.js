/**
 * @param {Array<{worldX: number, width: number, top: number}>} platforms
 * @param {number} worldOffset Current horizontal scroll offset.
 * @param {number} playerX Player's left edge x position on screen.
 * @param {number} playerWidth Player's width in pixels.
 * @return {Array<{top: number}>} The top surface of each platform whose
 *     screen-space horizontal range overlaps the player.
 */
function getPlatformsUnderPlayer(platforms, worldOffset, playerX, playerWidth) {
  const playerRight = playerX + playerWidth;
  return platforms
      .filter((platform) => {
        const screenX = platform.worldX - worldOffset;
        return screenX < playerRight && screenX + platform.width > playerX;
      })
      .map((platform) => ({top: platform.top}));
}

if (typeof module !== 'undefined') {
  module.exports = {getPlatformsUnderPlayer};
}
