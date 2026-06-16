const {test} = require('node:test');
const assert = require('node:assert/strict');
const {getVisibleObstacles} = require('../src/level.js');

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
