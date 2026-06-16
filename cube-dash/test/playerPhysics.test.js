const {test} = require('node:test');
const assert = require('node:assert/strict');
const {
  resolvePlayerPhysics,
  GROUND_Y,
  PLAYER_HEIGHT,
} = require('../src/playerPhysics.js');

const GROUND_SURFACE_TOP = GROUND_Y + PLAYER_HEIGHT;

test('player resting on the ground without jump input stays on the ground', () => {
  const player = {y: GROUND_Y, velocityY: 0, onGround: true};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: false}, []);
  assert.equal(result.y, GROUND_Y);
  assert.equal(result.velocityY, 0);
  assert.equal(result.onGround, true);
});

test('jump input while on the ground gives an upward (negative) velocity', () => {
  const player = {y: GROUND_Y, velocityY: 0, onGround: true};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: true}, []);
  assert.ok(result.velocityY < 0);
  assert.equal(result.onGround, false);
});

test('jump input while already in the air is ignored', () => {
  const player = {y: GROUND_Y - 50, velocityY: -0.3, onGround: false};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: true}, []);
  assert.ok(result.velocityY > -0.3);
});

test('gravity increases downward velocity while in the air', () => {
  const player = {y: GROUND_Y - 50, velocityY: 0, onGround: false};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: false}, []);
  assert.ok(result.velocityY > 0);
});

test('falling player lands on the ground when no platform is below', () => {
  const player = {y: 50, velocityY: 50, onGround: false};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: false}, []);
  assert.equal(result.y, GROUND_Y);
  assert.equal(result.velocityY, 0);
  assert.equal(result.onGround, true);
});

test('falling player lands on a floating platform instead of the ground', () => {
  const player = {y: 50, velocityY: 50, onGround: false};
  const platforms = [{top: 200}];
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: false}, platforms);
  assert.equal(result.y, 200 - PLAYER_HEIGHT);
  assert.equal(result.velocityY, 0);
  assert.equal(result.onGround, true);
});

test('falling player lands on the highest of several overlapping platforms', () => {
  const player = {y: 50, velocityY: 50, onGround: false};
  const platforms = [{top: 300}, {top: 150}];
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: false}, platforms);
  assert.equal(result.y, 150 - PLAYER_HEIGHT);
  assert.equal(result.onGround, true);
});

test('player on a platform falls when the platform is no longer present', () => {
  const player = {y: 200 - PLAYER_HEIGHT, velocityY: 0, onGround: true};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: false}, []);
  assert.equal(result.onGround, false);
  assert.ok(result.y > 200 - PLAYER_HEIGHT);
});

test('jumping upward never triggers an accidental landing', () => {
  const player = {y: GROUND_SURFACE_TOP - PLAYER_HEIGHT, velocityY: 0, onGround: true};
  const result = resolvePlayerPhysics(player, 16, {jumpPressed: true}, []);
  assert.equal(result.onGround, false);
  assert.ok(result.y < player.y);
});

test('resolvePlayerPhysics does not mutate the original player object', () => {
  const player = {y: GROUND_Y, velocityY: 0, onGround: true};
  resolvePlayerPhysics(player, 16, {jumpPressed: true}, []);
  assert.equal(player.velocityY, 0);
  assert.equal(player.onGround, true);
});
