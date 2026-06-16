const {test} = require('node:test');
const assert = require('node:assert/strict');
const {LEVEL, getVisibleObstacles} = require('../src/level.js');

test('LEVEL is a non-empty fixed list of obstacles with a worldX position', () => {
  assert.ok(Array.isArray(LEVEL));
  assert.ok(LEVEL.length > 0);
  for (const obstacle of LEVEL) {
    assert.equal(typeof obstacle.worldX, 'number');
    assert.equal(typeof obstacle.width, 'number');
    assert.equal(typeof obstacle.height, 'number');
  }
});

test('getVisibleObstacles converts worldX to screenX using worldOffset', () => {
  const level = [{worldX: 500, width: 30, height: 30}];
  const result = getVisibleObstacles(level, 100, 800);
  assert.equal(result.length, 1);
  assert.equal(result[0].screenX, 400);
});

test('getVisibleObstacles excludes obstacles that are off-screen to the right', () => {
  const level = [{worldX: 2000, width: 30, height: 30}];
  const result = getVisibleObstacles(level, 0, 800);
  assert.equal(result.length, 0);
});

test('getVisibleObstacles excludes obstacles that have fully scrolled past on the left', () => {
  const level = [{worldX: 100, width: 30, height: 30}];
  const result = getVisibleObstacles(level, 500, 800);
  assert.equal(result.length, 0);
});

test('getVisibleObstacles keeps an obstacle partially visible at the screen edges', () => {
  const level = [{worldX: 0, width: 30, height: 30}];
  const result = getVisibleObstacles(level, 10, 800);
  assert.equal(result.length, 1);
  assert.equal(result[0].screenX, -10);
});
