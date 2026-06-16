function buildObstacles(startX, spacing, count) {
  const obstacles = [];
  for (let i = 0; i < count; i++) {
    obstacles.push({type: 'spike', worldX: startX + i * spacing, width: 30, height: 30});
  }
  return obstacles;
}

function buildSpike(worldX) {
  return {type: 'spike', worldX, width: 30, height: 30};
}

function buildBlock(worldX, width, height) {
  return {type: 'block', worldX, width, height};
}

const LEVELS = [
  {
    id: 1,
    name: 'Niveau 1',
    speed: 0.3,
    obstacles: [
      buildSpike(500),
      buildSpike(1000),
      buildSpike(1500),
      buildSpike(2000),
      buildSpike(2500),
      buildSpike(3000),
      buildBlock(3500, 40, 50),
      buildBlock(4000, 40, 50),
    ],
    platforms: [],
    finishX: 4300,
  },
  {
    id: 2,
    name: 'Niveau 2',
    speed: 0.35,
    obstacles: [...buildObstacles(500, 450, 7), buildBlock(3650, 40, 50)],
    platforms: [],
    finishX: 3950,
  },
  {
    id: 3,
    name: 'Niveau 3',
    speed: 0.4,
    obstacles: [...buildObstacles(500, 400, 8), buildBlock(3700, 40, 50)],
    platforms: [],
    finishX: 4000,
  },
  {
    id: 4,
    name: 'Niveau 4',
    speed: 0.45,
    obstacles: [...buildObstacles(500, 350, 9), buildBlock(3650, 40, 50)],
    platforms: [],
    finishX: 3950,
  },
  {
    id: 5,
    name: 'Niveau 5',
    speed: 0.5,
    obstacles: [...buildObstacles(500, 300, 10), buildBlock(3500, 40, 50)],
    platforms: [],
    finishX: 3800,
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
