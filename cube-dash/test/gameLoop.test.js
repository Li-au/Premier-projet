const {test} = require('node:test');
const assert = require('node:assert/strict');
const {updateGameTime} = require('../src/gameLoop.js');

test('updateGameTime adds dt to elapsedTime', () => {
  const state = {elapsedTime: 0};
  const result = updateGameTime(state, 16);
  assert.equal(result.elapsedTime, 16);
});

test('updateGameTime accumulates elapsedTime across calls', () => {
  let state = {elapsedTime: 0};
  state = updateGameTime(state, 16);
  state = updateGameTime(state, 20);
  assert.equal(state.elapsedTime, 36);
});

test('updateGameTime does not mutate the original state', () => {
  const state = {elapsedTime: 10};
  updateGameTime(state, 16);
  assert.equal(state.elapsedTime, 10);
});
