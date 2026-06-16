const HUE_SPEED = 0.01;
const SATURATION = 70;
const LIGHTNESS = 55;

/**
 * @param {number} elapsedTime Elapsed time in milliseconds since the start
 *     of the run.
 * @return {string} An hsl() color string whose hue progresses with
 *     elapsedTime and wraps around every 360 degrees.
 */
function getPlayerColor(elapsedTime) {
  const hue = (elapsedTime * HUE_SPEED) % 360;
  return `hsl(${hue}, ${SATURATION}%, ${LIGHTNESS}%)`;
}

if (typeof module !== 'undefined') {
  module.exports = {getPlayerColor};
}
