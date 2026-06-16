const {test} = require('node:test');
const assert = require('node:assert/strict');
const {updatePlayerPhysics, GROUND_Y} = require('../src/playerPhysics.js');

test('player resting on the ground without jump input stays on the ground', () => {
  const player = {y: GROUND_Y, velocityY: 0, onGround: true};
  const result = updatePlayerPhysics(player, 16, {jumpPressed: false});
  assert.equal(result.y, GROUND_Y);
  assert.equal(result.velocityY, 0);
  assert.equal(result.onGround, true);
});

test('jump input while on the ground gives an upward (negative) velocity', () => {
  const player = {y: GROUND_Y, velocityY: 0, onGround: true};
  const result = updatePlayerPhysics(player, 16, {jumpPressed: true});
  assert.ok(result.velocityY < 0);
  assert.equal(result.onGround, false);
});

test('jump input while already in the air is ignored', () => {
  const player = {y: GROUND_Y - 50, velocityY: -0.3, onGround: false};
  const result = updatePlayerPhysics(player, 16, {jumpPressed: true});
  assert.ok(result.velocityY > -0.3);
});

test('gravity increases downward velocity while in the air', () => {
  const player = {y: GROUND_Y - 50, velocityY: 0, onGround: false};
  const result = updatePlayerPhysics(player, 16, {jumpPressed: false});
  assert.ok(result.velocityY > 0);
});

test('player position is clamped to the ground and velocity resets on landing', () => {
  const player = {y: GROUND_Y - 5, velocityY: 10, onGround: false};
  const result = updatePlayerPhysics(player, 16, {jumpPressed: false});
  assert.equal(result.y, GROUND_Y);
  assert.equal(result.velocityY, 0);
  assert.equal(result.onGround, true);
});

test('updatePlayerPhysics does not mutate the original player object', () => {
  const player = {y: GROUND_Y, velocityY: 0, onGround: true};
  updatePlayerPhysics(player, 16, {jumpPressed: true});
  assert.equal(player.velocityY, 0);
  assert.equal(player.onGround, true);
});
