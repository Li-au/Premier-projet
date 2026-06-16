// Full jump cycle duration (rise + fall) with the current physics constants
// (JUMP_VELOCITY=-0.6, GRAVITY=0.0025 in src/playerPhysics.js): 2 * (0.6 / 0.0025).
const JUMP_CYCLE_MS = 480;

// Multipliers (all >= 1.0) applied on top of each level's minimum safe gap,
// to vary the rhythm without ever creating an impossible jump.
const GAP_MULTIPLIERS = [
  1.0, 1.6, 1.15, 1.4, 1.05, 1.8, 1.2, 1.3, 1.0, 1.5, 1.1, 1.7, 1.05, 1.25, 1.0, 1.6, 1.15, 1.35,
];

// Time budget for the short hop between the two steps of a staircase: less
// than a full jump cycle (the player only needs to clear the small rise
// between the two block tops, not land from open air), but still scaled by
// the level's speed so faster levels get a proportionally wider gap.
const STAIRCASE_STEP_TIME_MS = 420;
const STAIRCASE_STEP_HEIGHT = 50;
const STAIRCASE_RISE = 30;

function buildSpike(worldX) {
  return {type: 'spike', worldX, width: 30, height: 30};
}

function buildBlock(worldX, height = STAIRCASE_STEP_HEIGHT) {
  return {type: 'block', worldX, width: 40, height};
}

/**
 * Builds a two-step staircase: a first block, then a second taller block a
 * short hop away, so the player climbs up by landing on the first and
 * jumping again to reach the second. The second block is flagged
 * `staircaseStep` so it is exempted from the strict jump-cycle fairness
 * check (a short hop between two raised surfaces needs far less time than
 * a full ground-to-ground jump).
 *
 * @param {number} worldX World x of the staircase's first block.
 * @param {number} speed Level scroll speed in pixels per millisecond, used
 *     to scale the step gap so it stays fair at any level speed.
 * @return {Array<Object>} The two blocks forming the staircase.
 */
function buildStaircase(worldX, speed) {
  const stepGap = speed * STAIRCASE_STEP_TIME_MS;
  const firstStep = buildBlock(worldX, STAIRCASE_STEP_HEIGHT);
  const secondStep = buildBlock(
      worldX + firstStep.width + stepGap,
      STAIRCASE_STEP_HEIGHT + STAIRCASE_RISE);
  secondStep.staircaseStep = true;
  return [firstStep, secondStep];
}

/**
 * Builds a sequence of obstacles with irregular but always-fair spacing:
 * every gap is at least `speed * JUMP_CYCLE_MS * marginFactor`, the
 * distance covered during one full jump cycle at this level's speed, so a
 * jump is always physically possible regardless of how tight the level
 * gets (staircase steps are the one exception, see buildStaircase).
 * `marginFactor` controls how much slack remains above that bare minimum
 * (1.0 = no slack, the hardest possible timing). Every 3rd block slot is a
 * staircase instead of a single block, for variety.
 *
 * @param {number} startX World x of the first obstacle.
 * @param {number} speed Level scroll speed in pixels per millisecond.
 * @param {number} marginFactor Multiplier (>=1.0) above the minimum safe
 *     gap; lower means less room for error.
 * @param {number} totalCount Total number of obstacles to generate.
 * @param {number} blockEvery Every Nth obstacle is a block instead of a spike.
 * @param {number} staircaseEvery Every Nth block slot is a staircase instead
 *     of a single block.
 * @param {number} multiplierOffset Starting index into GAP_MULTIPLIERS, so
 *     different levels don't repeat the exact same rhythm pattern.
 * @return {{obstacles: Array<Object>, finishX: number}}
 */
function buildVariedLevel(
    startX, speed, marginFactor, totalCount, blockEvery, staircaseEvery, multiplierOffset) {
  const baseGap = speed * JUMP_CYCLE_MS * marginFactor;
  const obstacles = [];
  let x = startX;
  let blockSlotCount = 0;
  for (let i = 0; i < totalCount; i++) {
    const isBlockSlot = (i + 1) % blockEvery === 0;
    if (isBlockSlot) {
      blockSlotCount++;
      if (blockSlotCount % staircaseEvery === 0) {
        const staircase = buildStaircase(x, speed);
        obstacles.push(...staircase);
        x = staircase[1].worldX;
      } else {
        obstacles.push(buildBlock(x));
      }
    } else {
      obstacles.push(buildSpike(x));
    }
    x += baseGap * GAP_MULTIPLIERS[(i + multiplierOffset) % GAP_MULTIPLIERS.length];
  }
  return {obstacles, finishX: x + baseGap};
}

const SPEED_1 = 0.3;
const SPEED_2 = 0.35;
const SPEED_3 = 0.4;
const SPEED_4 = 0.45;
const SPEED_5 = 0.46;

// Each level gets its own blockEvery/staircaseEvery/multiplierOffset
// combination so the rhythm and obstacle mix feel distinct, instead of the
// same pattern simply replayed faster.
const level1 = buildVariedLevel(500, SPEED_1, 1.5, 26, 5, 4, 0);
const level2 = buildVariedLevel(500, SPEED_2, 1.35, 30, 4, 3, 5);
const level3 = buildVariedLevel(500, SPEED_3, 1.2, 32, 3, 4, 11);
const level4 = buildVariedLevel(500, SPEED_4, 1.1, 36, 3, 2, 2);
const level5 = buildVariedLevel(500, SPEED_5, 1.02, 38, 2, 2, 8);

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
