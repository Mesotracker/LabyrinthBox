// --------------------------------------------------------------------------
// Φ-43 - Dendrophobia  (id: phobia43, The Phobia Wing)
// Grey daylight through bare grey trees, all dead, all alike. You are fairly sure that one was not there a minute ago.
//
// Scene: 3 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Light the marker lanterns  [lantern x3]
//    2. Find the cabin  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia43',
  name: 'Φ-43',
  subtitle: 'Dendrophobia',
  place: 'The Dead Wood',
  cls: 'Class 4',
  seed: 6591,
  description: 'Grey daylight through bare grey trees, all dead, all alike. You are fairly sure that one was not there a minute ago.',
  intro: 'Light three marker lanterns, then find the cabin. Never walk right beside a dead tree with amber in its knot.',
  spawn: [16, 16],
  ambience: 'forest',
  hum: 0,
  ambientLight: [0.1, 0.1, 0.1],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x5a5a58, density: 0.04 },
  tuning: { grimeScale: 0.3, wetScale: 0.4 },
  gen: {
    type: 'forest',
    params: { treeChance: 0.16, leaves: 'none', floorMat: 'forest_floor' },
  },
  stages: [
    {
      text: 'Light the marker lanterns',
      goal: 'lantern',
      count: 3,
      dist: [25, 60],
    },
    { text: 'Find the cabin', goal: 'cabin', dist: [60, 80], final: true },
  ],
  entities: [['rootwalker', 5]],
  rare: [['stature', 0.25]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
