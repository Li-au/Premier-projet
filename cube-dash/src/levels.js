// Full jump cycle duration (rise + fall) with the current physics constants
// (JUMP_VELOCITY=-0.6, GRAVITY=0.0025 in src/playerPhysics.js): 2 * (0.6 / 0.0025).
const JUMP_CYCLE_MS = 480;

// Multipliers (all >= 1.0) applied on top of each level's minimum safe gap,
// to vary the rhythm without ever creating an impossible jump.
const GAP_MULTIPLIERS = [
  1.0, 1.6, 1.15, 1.4, 1.05, 1.8, 1.2, 1.3, 1.0, 1.5, 1.1, 1.7, 1.05, 1.25, 1.0, 1.6, 1.15, 1.35,
];

function buildSpike(worldX) {
  return {type: 'spike', worldX, width: 30, height: 30};
}

function buildBlock(worldX) {
  return {type: 'block', worldX, width: 40, height: 50};
}

/**
 * Builds a sequence of obstacles with irregular but always-fair spacing:
 * every gap is at least `speed * JUMP_CYCLE_MS * marginFactor`, the
 * distance covered during one full jump cycle at this level's speed, so a
 * jump is always physically possible regardless of how tight the level
 * gets. `marginFactor` controls how much slack remains above that bare
 * minimum (1.0 = no slack, the hardest possible timing).
 *
 * @param {number} startX World x of the first obstacle.
 * @param {number} speed Level scroll speed in pixels per millisecond.
 * @param {number} marginFactor Multiplier (>=1.0) above the minimum safe
 *     gap; lower means less room for error.
 * @param {number} totalCount Total number of obstacles to generate.
 * @param {number} blockEvery Every Nth obstacle is a block instead of a spike.
 * @return {{obstacles: Array<Object>, finishX: number}}
 */
function buildVariedLevel(startX, speed, marginFactor, totalCount, blockEvery) {
  const baseGap = speed * JUMP_CYCLE_MS * marginFactor;
  const obstacles = [];
  let x = startX;
  for (let i = 0; i < totalCount; i++) {
    const isBlock = (i + 1) % blockEvery === 0;
    obstacles.push(isBlock ? buildBlock(x) : buildSpike(x));
    x += baseGap * GAP_MULTIPLIERS[i % GAP_MULTIPLIERS.length];
  }
  return {obstacles, finishX: x + baseGap};
}

const SPEED_1 = 0.3;
const SPEED_2 = 0.35;
const SPEED_3 = 0.4;
const SPEED_4 = 0.45;
const SPEED_5 = 0.46;

const level1 = buildVariedLevel(500, SPEED_1, 1.5, 12, 4);
const level2 = buildVariedLevel(500, SPEED_2, 1.35, 13, 4);
const level3 = buildVariedLevel(500, SPEED_3, 1.2, 14, 4);
const level4 = buildVariedLevel(500, SPEED_4, 1.1, 15, 4);
const level5 = buildVariedLevel(500, SPEED_5, 1.02, 16, 4);

const LEVELS = [
  {id: 1, name: 'Niveau 1', speed: SPEED_1, ...level1, platforms: []},
  {id: 2, name: 'Niveau 2', speed: SPEED_2, ...level2, platforms: []},
  {id: 3, name: 'Niveau 3', speed: SPEED_3, ...level3, platforms: []},
  {id: 4, name: 'Niveau 4', speed: SPEED_4, ...level4, platforms: []},
  {id: 5, name: 'Niveau 5', speed: SPEED_5, ...level5, platforms: []},
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
  module.exports = {LEVELS, getLevel, JUMP_CYCLE_MS};
}
