// --------------------------------------------------------------------------
// Φ-37 - Chionophobia  (id: phobia37, The Phobia Wing)
// Bare trees in snow, the air white and moving. Your fingers have stopped hurting, which is worse.
//
// Scene: 3 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 6/batteries 4
//    1. Start the heaters  [generator x3]
//    2. Find the cabin  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia37',
  name: 'Φ-37',
  subtitle: 'Chionophobia',
  place: 'Whiteout',
  cls: 'Class 4',
  seed: 6369,
  description: 'Bare trees in snow, the air white and moving. Your fingers have stopped hurting, which is worse.',
  intro: 'Start three heaters to stay alive, then find the cabin. Heaters warm you — and draw them in.',
  spawn: [16, 16],
  ambience: 'forest',
  hum: 0,
  ambientLight: [0.12, 0.13, 0.15],
  bounce: 0.45,
  lightRange: 16,
  fog: { color: 0xbcc6d2, density: 0.05 },
  tuning: { grimeScale: 0.2, wetScale: 0.3 },
  phobia: { meters: ['cold'], heaters: true },
  gen: {
    type: 'forest',
    params: { treeChance: 0.1, floorMat: 'snow', leaves: 'none' },
  },
  stages: [
    { text: 'Start the heaters', goal: 'generator', count: 3, dist: [22, 55] },
    { text: 'Find the cabin', goal: 'cabin', dist: [55, 75], final: true },
  ],
  entities: [['frostbitten', 4]],
  rare: [['haze', 0.3]],
  loot: { keys: 10, water: 6, batteries: 4 },
});
