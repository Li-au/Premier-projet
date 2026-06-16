const {test} = require('node:test');
const assert = require('node:assert/strict');
const {advanceWorld, hasReachedFinish} = require('../src/world.js');

test('advanceWorld increases the offset by speed * dt', () => {
  const result = advanceWorld(0, 16, 0.3);
  assert.equal(result, 4.8);
});

test('advanceWorld accumulates across multiple calls', () => {
  let offset = 0;
  offset = advanceWorld(offset, 16, 0.3);
  offset = advanceWorld(offset, 10, 0.3);
  assert.equal(offset, 7.8);
});

test('advanceWorld with zero speed does not move the offset', () => {
  const result = advanceWorld(100, 16, 0);
  assert.equal(result, 100);
});

test('hasReachedFinish is false while the finish line is still ahead', () => {
  assert.equal(hasReachedFinish(0, 1000, 80), false);
});

test('hasReachedFinish becomes true once the finish line reaches the player', () => {
  assert.equal(hasReachedFinish(920, 1000, 80), true);
});

test('hasReachedFinish is true once the finish line has fully passed the player', () => {
  assert.equal(hasReachedFinish(2000, 1000, 80), true);
});

test('hasReachedFinish is false just before the finish line reaches the player', () => {
  assert.equal(hasReachedFinish(919, 1000, 80), false);
});
