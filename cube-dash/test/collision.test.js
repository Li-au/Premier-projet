const {test} = require('node:test');
const assert = require('node:assert/strict');
const {checkCollision} = require('../src/collision.js');

test('checkCollision returns true when two rectangles overlap', () => {
  const player = {x: 80, y: 280, width: 30, height: 30};
  const obstacle = {x: 90, y: 290, width: 30, height: 30};
  assert.equal(checkCollision(player, obstacle), true);
});

test('checkCollision returns false when rectangles are far apart', () => {
  const player = {x: 80, y: 280, width: 30, height: 30};
  const obstacle = {x: 500, y: 280, width: 30, height: 30};
  assert.equal(checkCollision(player, obstacle), false);
});

test('checkCollision returns false when rectangles only touch at the edge', () => {
  const player = {x: 80, y: 280, width: 30, height: 30};
  const obstacle = {x: 110, y: 280, width: 30, height: 30};
  assert.equal(checkCollision(player, obstacle), false);
});

test('checkCollision returns true when one rectangle is fully inside another', () => {
  const player = {x: 80, y: 280, width: 30, height: 30};
  const obstacle = {x: 85, y: 285, width: 5, height: 5};
  assert.equal(checkCollision(player, obstacle), true);
});
