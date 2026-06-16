const {test} = require('node:test');
const assert = require('node:assert/strict');
const {transitionGameState} = require('../src/stateMachine.js');

test('title state moves to level_select on action pressed', () => {
  assert.equal(transitionGameState('title', 'ACTION_PRESSED'), 'level_select');
});

test('level_select state moves to playing on level selected', () => {
  assert.equal(transitionGameState('level_select', 'LEVEL_SELECTED'), 'playing');
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

test('level_select state ignores action pressed', () => {
  assert.equal(transitionGameState('level_select', 'ACTION_PRESSED'), 'level_select');
});

test('title state ignores collision', () => {
  assert.equal(transitionGameState('title', 'COLLISION'), 'title');
});

test('game_over state ignores collision', () => {
  assert.equal(transitionGameState('game_over', 'COLLISION'), 'game_over');
});

test('playing state moves to paused on pause', () => {
  assert.equal(transitionGameState('playing', 'PAUSE'), 'paused');
});

test('title state ignores pause', () => {
  assert.equal(transitionGameState('title', 'PAUSE'), 'title');
});

test('game_over state ignores pause', () => {
  assert.equal(transitionGameState('game_over', 'PAUSE'), 'game_over');
});

test('paused state moves back to playing on resume', () => {
  assert.equal(transitionGameState('paused', 'RESUME'), 'playing');
});

test('paused state moves to level_select on quit to select', () => {
  assert.equal(transitionGameState('paused', 'QUIT_TO_SELECT'), 'level_select');
});

test('paused state ignores collision', () => {
  assert.equal(transitionGameState('paused', 'COLLISION'), 'paused');
});

test('playing state moves to level_complete on level complete', () => {
  assert.equal(transitionGameState('playing', 'LEVEL_COMPLETE'), 'level_complete');
});

test('level_complete state moves to level_select on action pressed', () => {
  assert.equal(transitionGameState('level_complete', 'ACTION_PRESSED'), 'level_select');
});

test('level_complete state ignores collision', () => {
  assert.equal(transitionGameState('level_complete', 'COLLISION'), 'level_complete');
});
