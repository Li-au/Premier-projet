const {test} = require('node:test');
const assert = require('node:assert/strict');
const {advanceWorld} = require('../src/world.js');

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
