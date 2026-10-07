// --------------------------------------------------------------------------
// Δ-20 - The Warehouse Floor, Cracked  (id: cor20, Corruption)
// The floor of the warehouse has opened into black shafts. The aisles that are left are narrow, and cracks run along all of them.
//
// Scene: 1 generator settings, 4 entity groups, 2 rare spawns, loot keys 9/water 5/batteries 5, file corruption 0.6
//    1. Light the aisle lanterns  [lantern x3]
//    2. Reach the lift door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor20',
  name: 'Δ-20',
  subtitle: 'The Warehouse Floor, Cracked',
  place: 'Level 20, the shafts',
  cls: 'Class 4',
  passive: false,
  seed: 7820,
  description: 'The floor of the warehouse has opened into black shafts. The aisles that are left are narrow, and cracks run along all of them.',
  intro: 'Shut down the generator, then reach the loading dock before the dark swallows the place. The floor is full of holes with no bottom. Keep to the aisles.',
  spawn: [16, 16],
  fall: true,
  hum: 0.08,
  ambientLight: [0.028, 0.02925, 0.03175],
  bounce: 0.26,
  lightRange: 20,
  fog: { color: 0x353a36, density: 0.03808 },
  sky: {
    top: 0x000000,
    horizon: 0x020202,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0,
  },
  tuning: { grimeScale: 1.95, wetScale: 0.81 },
  corrupt: 0.6,
  gen: { type: 'open', mode: 'heights', params: { style: 'pits' } },
  stages: [
    {
      text: 'Light the aisle lanterns',
      goal: 'lantern',
      count: 3,
      dist: [20, 48],
    },
    {
      text: 'Reach the lift door',
      goal: 'door_exit',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [
    ['hound', 2, null],
    ['mut_splice', 1, null],
    ['mut_chorus', 2, null],
    ['mut_sprawl', 1],
  ],
  rare: [['worm', 0.42], ['duller', 0.28]],
  loot: { keys: 9, water: 5, batteries: 5 },
});
