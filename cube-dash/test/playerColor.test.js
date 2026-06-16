const {test} = require('node:test');
const assert = require('node:assert/strict');
const {getPlayerColor} = require('../src/playerColor.js');

test('getPlayerColor returns an hsl color string', () => {
  const color = getPlayerColor(0);
  assert.match(color, /^hsl\(\d+(\.\d+)?, \d+%, \d+%\)$/);
});

test('getPlayerColor at elapsedTime 0 starts at hue 0', () => {
  assert.equal(getPlayerColor(0), 'hsl(0, 70%, 55%)');
});

test('getPlayerColor changes hue as elapsedTime increases', () => {
  const colorA = getPlayerColor(0);
  const colorB = getPlayerColor(2000);
  assert.notEqual(colorA, colorB);
});

test('getPlayerColor wraps the hue around 360 degrees', () => {
  const hueAt0 = getPlayerColor(0);
  const period = 36000;
  const hueAfterFullCycle = getPlayerColor(period);
  assert.equal(hueAt0, hueAfterFullCycle);
});
