// --------------------------------------------------------------------------
// Φ-19 - Bathophobia  (id: phobia19, The Phobia Wing)
// An underground hall whose floor is broken by square shafts with no bottom. Something pale rests its fingers on the edges.
//
// Scene: 1 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 5/batteries 5
//    1. Light the aisle lanterns  [lantern x3]
//    2. Reach the lift door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia19',
  name: 'Φ-19',
  subtitle: 'Bathophobia',
  place: 'The Shafts',
  cls: 'Class 4',
  seed: 5703,
  description: 'An underground hall whose floor is broken by square shafts with no bottom. Something pale rests its fingers on the edges.',
  intro: 'Light three lanterns along the safe aisles, then reach the lift door in a hut. Stay away from the edges.',
  spawn: [16, 16],
  fall: true,
  ambience: 'water',
  hum: 0.05,
  ambientLight: [0.012, 0.01, 0.008],
  bounce: 0.28,
  lightRange: 16,
  fog: { color: 0x050403, density: 0.045 },
  sky: {
    top: 0x000000,
    horizon: 0x020202,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0,
  },
  tuning: { grimeScale: 1.2, wetScale: 0.6 },
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
  entities: [['deephand', 6]],
  rare: [['crawler', 0.25]],
  loot: { keys: 12, water: 5, batteries: 5 },
});
