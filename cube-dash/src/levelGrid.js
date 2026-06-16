const CELL_SIZE = 60;
const CELL_GAP = 20;

/**
 * @param {number} numLevels Number of level cells to lay out.
 * @param {number} screenWidth Width of the visible viewport in pixels.
 * @return {Array<{id: number, x: number, y: number, width: number,
 *     height: number}>} A row of evenly spaced, horizontally centered
 *     square cells, one per level id (1 to numLevels).
 */
function getLevelGridLayout(numLevels, screenWidth) {
  const totalWidth = numLevels * CELL_SIZE + (numLevels - 1) * CELL_GAP;
  const startX = (screenWidth - totalWidth) / 2;

  const layout = [];
  for (let i = 0; i < numLevels; i++) {
    layout.push({
      id: i + 1,
      x: startX + i * (CELL_SIZE + CELL_GAP),
      y: 0,
      width: CELL_SIZE,
      height: CELL_SIZE,
    });
  }
  return layout;
}

if (typeof module !== 'undefined') {
  module.exports = {getLevelGridLayout, CELL_SIZE};
}
