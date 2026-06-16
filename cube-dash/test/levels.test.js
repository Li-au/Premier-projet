const {test} = require('node:test');
const assert = require('node:assert/strict');
const {LEVELS, getLevel} = require('../src/levels.js');

function averageSpacing(level) {
  const positions = level.obstacles.map((obstacle) => obstacle.worldX);
  let totalGap = 0;
  for (let i = 1; i < positions.length; i++) {
    totalGap += positions[i] - positions[i - 1];
  }
  return totalGap / (positions.length - 1);
}

test('LEVELS contains exactly 5 levels with ids 1 to 5', () => {
  assert.equal(LEVELS.length, 5);
  assert.deepEqual(LEVELS.map((level) => level.id), [1, 2, 3, 4, 5]);
});

test('each level has a name, a speed and a non-empty obstacle list', () => {
  for (const level of LEVELS) {
    assert.equal(typeof level.name, 'string');
    assert.equal(typeof level.speed, 'number');
    assert.ok(Array.isArray(level.obstacles));
    assert.ok(level.obstacles.length > 0);
  }
});

test('speed increases progressively from level 1 to level 5', () => {
  for (let i = 1; i < LEVELS.length; i++) {
    assert.ok(LEVELS[i].speed > LEVELS[i - 1].speed);
  }
});

test('average obstacle spacing decreases progressively from level 1 to level 5', () => {
  for (let i = 1; i < LEVELS.length; i++) {
    assert.ok(averageSpacing(LEVELS[i]) < averageSpacing(LEVELS[i - 1]));
  }
});

test('getLevel returns the level matching the given id', () => {
  const level = getLevel(3);
  assert.equal(level.id, 3);
});

test('getLevel returns undefined for an unknown id', () => {
  assert.equal(getLevel(99), undefined);
});
