function buildObstacles(startX, spacing, count) {
  const obstacles = [];
  for (let i = 0; i < count; i++) {
    obstacles.push({worldX: startX + i * spacing, width: 30, height: 30});
  }
  return obstacles;
}

const LEVELS = [
  {
    id: 1,
    name: 'Niveau 1',
    speed: 0.3,
    obstacles: buildObstacles(500, 500, 6),
  },
  {
    id: 2,
    name: 'Niveau 2',
    speed: 0.35,
    obstacles: buildObstacles(500, 450, 7),
  },
  {
    id: 3,
    name: 'Niveau 3',
    speed: 0.4,
    obstacles: buildObstacles(500, 400, 8),
  },
  {
    id: 4,
    name: 'Niveau 4',
    speed: 0.45,
    obstacles: buildObstacles(500, 350, 9),
  },
  {
    id: 5,
    name: 'Niveau 5',
    speed: 0.5,
    obstacles: buildObstacles(500, 300, 10),
  },
];

/**
 * @param {number} id Level id (1 to 5).
 * @return {Object|undefined} The matching level, or undefined if no level
 *     has this id.
 */
function getLevel(id) {
  return LEVELS.find((level) => level.id === id);
}

if (typeof module !== 'undefined') {
  module.exports = {LEVELS, getLevel};
}
