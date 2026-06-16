const {test} = require('node:test');
const assert = require('node:assert/strict');
const {getObstacleRect} = require('../src/obstacles.js');

test('getObstacleRect computes the bounding box of a spike obstacle', () => {
  const obstacle = {type: 'spike', screenX: 100, width: 30, height: 30};
  const rect = getObstacleRect(obstacle, 330);
  assert.deepEqual(rect, {x: 100, y: 300, width: 30, height: 30});
});

test('getObstacleRect computes the same bounding box for a block obstacle', () => {
  const obstacle = {type: 'block', screenX: 100, width: 30, height: 30};
  const rect = getObstacleRect(obstacle, 330);
  assert.deepEqual(rect, {x: 100, y: 300, width: 30, height: 30});
});

test('getObstacleRect accounts for a taller obstacle height', () => {
  const obstacle = {type: 'block', screenX: 50, width: 40, height: 60};
  const rect = getObstacleRect(obstacle, 330);
  assert.deepEqual(rect, {x: 50, y: 270, width: 40, height: 60});
});
