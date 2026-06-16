const GAP_MULTIPLIERS = [
  1.0, 1.6, 0.5, 1.3, 0.8, 1.7, 0.6, 1.1, 0.9, 1.4, 0.55, 1.5, 0.7, 1.2, 0.95, 1.65, 0.6, 1.05,
];

function buildSpike(worldX) {
  return {type: 'spike', worldX, width: 30, height: 30};
}

function buildBlock(worldX) {
  return {type: 'block', worldX, width: 40, height: 50};
}

/**
 * Builds a sequence of obstacles with irregular (non-uniform) spacing
 * derived from GAP_MULTIPLIERS scaled by baseGap, mixing spikes with
 * periodic climbable blocks (every `blockEvery`-th obstacle) spread
 * throughout the level rather than bunched at the end.
 *
 * @param {number} startX World x of the first obstacle.
 * @param {number} baseGap Average gap in pixels between obstacles.
 * @param {number} totalCount Total number of obstacles to generate.
 * @param {number} blockEvery Every Nth obstacle is a block instead of a spike.
 * @return {{obstacles: Array<Object>, finishX: number}}
 */
function buildVariedLevel(startX, baseGap, totalCount, blockEvery) {
  const obstacles = [];
  let x = startX;
  for (let i = 0; i < totalCount; i++) {
    const isBlock = (i + 1) % blockEvery === 0;
    obstacles.push(isBlock ? buildBlock(x) : buildSpike(x));
    x += baseGap * GAP_MULTIPLIERS[i % GAP_MULTIPLIERS.length];
  }
  return {obstacles, finishX: x + baseGap};
}

const level1 = buildVariedLevel(500, 320, 12, 4);
const level2 = buildVariedLevel(500, 290, 13, 4);
const level3 = buildVariedLevel(500, 260, 14, 4);
const level4 = buildVariedLevel(500, 230, 15, 4);
const level5 = buildVariedLevel(500, 200, 16, 4);

const LEVELS = [
  {id: 1, name: 'Niveau 1', speed: 0.3, ...level1, platforms: []},
  {id: 2, name: 'Niveau 2', speed: 0.35, ...level2, platforms: []},
  {id: 3, name: 'Niveau 3', speed: 0.4, ...level3, platforms: []},
  {id: 4, name: 'Niveau 4', speed: 0.45, ...level4, platforms: []},
  {id: 5, name: 'Niveau 5', speed: 0.5, ...level5, platforms: []},
];

/**
 * @param {number} id Level id (1 to 5).
 * @return {Object|undefined} The matching level, or undefined if no level
 *     has this id.
 */
function getLevel(id) {
  return LEVELS.find((level) => level.id === id);
}

if (typeof module !== 'undefined') {
  module.exports = {LEVELS, getLevel};
}
