const {test} = require('node:test');
const assert = require('node:assert/strict');
const {getPlatformsUnderPlayer} = require('../src/platforms.js');

test('getPlatformsUnderPlayer returns the top of a platform overlapping the player', () => {
  const platforms = [{worldX: 400, width: 100, top: 200}];
  const result = getPlatformsUnderPlayer(platforms, 350, 80, 30);
  assert.deepEqual(result, [{top: 200}]);
});

test('getPlatformsUnderPlayer excludes platforms that do not overlap the player horizontally', () => {
  const platforms = [{worldX: 400, width: 100, top: 200}];
  const result = getPlatformsUnderPlayer(platforms, 0, 80, 30);
  assert.deepEqual(result, []);
});

test('getPlatformsUnderPlayer includes a platform only partially overlapping the player', () => {
  const platforms = [{worldX: 400, width: 100, top: 200}];
  const result = getPlatformsUnderPlayer(platforms, 295, 80, 30);
  assert.deepEqual(result, [{top: 200}]);
});

test('getPlatformsUnderPlayer returns multiple matching platforms', () => {
  const platforms = [
    {worldX: 400, width: 100, top: 200},
    {worldX: 420, width: 50, top: 150},
  ];
  const result = getPlatformsUnderPlayer(platforms, 350, 80, 30);
  assert.deepEqual(result, [{top: 200}, {top: 150}]);
});
