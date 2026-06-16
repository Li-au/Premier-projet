const {test} = require('node:test');
const assert = require('node:assert/strict');
const {getLevelGridLayout, CELL_SIZE} = require('../src/levelGrid.js');

test('getLevelGridLayout returns one cell per level with matching ids', () => {
  const layout = getLevelGridLayout(5, 800);
  assert.equal(layout.length, 5);
  assert.deepEqual(layout.map((cell) => cell.id), [1, 2, 3, 4, 5]);
});

test('getLevelGridLayout cells are centered horizontally on the screen', () => {
  const layout = getLevelGridLayout(5, 800);
  const firstCell = layout[0];
  const lastCell = layout[layout.length - 1];
  const groupLeft = firstCell.x;
  const groupRight = lastCell.x + lastCell.width;
  const groupCenter = (groupLeft + groupRight) / 2;
  assert.equal(groupCenter, 400);
});

test('getLevelGridLayout cells are evenly spaced with no overlap', () => {
  const layout = getLevelGridLayout(5, 800);
  for (let i = 1; i < layout.length; i++) {
    assert.ok(layout[i].x >= layout[i - 1].x + layout[i - 1].width);
  }
});

test('each cell has a square size equal to CELL_SIZE', () => {
  const layout = getLevelGridLayout(5, 800);
  for (const cell of layout) {
    assert.equal(cell.width, CELL_SIZE);
    assert.equal(cell.height, CELL_SIZE);
  }
});
