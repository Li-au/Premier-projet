const {test} = require('node:test');
const assert = require('node:assert/strict');
const {LEVELS, getLevel, JUMP_CYCLE_MS} = require('../src/levels.js');

function gapsWithFlag(level) {
  const obstacles = level.obstacles;
  const result = [];
  for (let i = 1; i < obstacles.length; i++) {
    result.push({
      value: obstacles[i].worldX - obstacles[i - 1].worldX,
      isStaircaseStep: Boolean(obstacles[i].staircaseStep),
    });
  }
  return result;
}

function gaps(level) {
  return gapsWithFlag(level).map((gap) => gap.value);
}

function averageTimeBetweenObstacles(level) {
  const levelGaps = gaps(level);
  const averageGap = levelGaps.reduce((sum, gap) => sum + gap, 0) / levelGaps.length;
  return averageGap / level.speed;
}

test('LEVELS contains exactly 5 levels with ids 1 to 5', () => {
  assert.equal(LEVELS.length, 5);
  assert.deepEqual(LEVELS.map((level) => level.id), [1, 2, 3, 4, 5]);
});

test('each level has a name, a speed, a non-empty obstacle list and a platform list', () => {
  for (const level of LEVELS) {
    assert.equal(typeof level.name, 'string');
    assert.equal(typeof level.speed, 'number');
    assert.ok(Array.isArray(level.obstacles));
    assert.ok(level.obstacles.length > 0);
    assert.ok(Array.isArray(level.platforms));
  }
});

test('each level has a finishX positioned after its last obstacle', () => {
  for (const level of LEVELS) {
    const lastObstacle = level.obstacles[level.obstacles.length - 1];
    assert.ok(level.finishX > lastObstacle.worldX + lastObstacle.width);
  }
});

test('speed increases progressively from level 1 to level 5', () => {
  for (let i = 1; i < LEVELS.length; i++) {
    assert.ok(LEVELS[i].speed > LEVELS[i - 1].speed);
  }
});

test('average time between obstacles decreases progressively from level 1 to level 5', () => {
  for (let i = 1; i < LEVELS.length; i++) {
    assert.ok(averageTimeBetweenObstacles(LEVELS[i]) < averageTimeBetweenObstacles(LEVELS[i - 1]));
  }
});

test('every gap is always long enough for a full jump cycle, except staircase steps', () => {
  for (const level of LEVELS) {
    const minSafeGap = level.speed * JUMP_CYCLE_MS;
    for (const gap of gapsWithFlag(level)) {
      if (!gap.isStaircaseStep) {
        assert.ok(gap.value >= minSafeGap);
      }
    }
  }
});

test('staircases have a second step taller than the first', () => {
  for (const level of LEVELS) {
    level.obstacles.forEach((obstacle, index) => {
      if (obstacle.staircaseStep) {
        const firstStep = level.obstacles[index - 1];
        assert.equal(firstStep.type, 'block');
        assert.ok(obstacle.height > firstStep.height);
      }
    });
  }
});

test('getLevel returns the level matching the given id', () => {
  const level = getLevel(3);
  assert.equal(level.id, 3);
});

test('getLevel returns undefined for an unknown id', () => {
  assert.equal(getLevel(99), undefined);
});
