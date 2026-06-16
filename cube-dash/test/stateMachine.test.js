const {test} = require('node:test');
const assert = require('node:assert/strict');
const {transitionGameState} = require('../src/stateMachine.js');

test('title state moves to playing on action pressed', () => {
  assert.equal(transitionGameState('title', 'ACTION_PRESSED'), 'playing');
});

test('playing state moves to game_over on collision', () => {
  assert.equal(transitionGameState('playing', 'COLLISION'), 'game_over');
});

test('game_over state moves back to playing on action pressed', () => {
  assert.equal(transitionGameState('game_over', 'ACTION_PRESSED'), 'playing');
});

test('playing state ignores action pressed', () => {
  assert.equal(transitionGameState('playing', 'ACTION_PRESSED'), 'playing');
});

test('title state ignores collision', () => {
  assert.equal(transitionGameState('title', 'COLLISION'), 'title');
});

test('game_over state ignores collision', () => {
  assert.equal(transitionGameState('game_over', 'COLLISION'), 'game_over');
});
