// --------------------------------------------------------------------------
// Ω-22 - The Candy Forest  (id: pg22, Playground)
// A forest of round trees in pink and mint and lemon, in a light the colour of cream soda. Every trunk has a face carved in it.
//
// Scene: 3 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Light the lanterns  [lantern x4]
//    2. Find the gingerbread cabin  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg22',
  name: 'Ω-22',
  subtitle: 'The Candy Forest',
  place: 'Sugar and sap',
  cls: 'Class 3',
  seed: 10034,
  description: 'A forest of round trees in pink and mint and lemon, in a light the colour of cream soda. Every trunk has a face carved in it.',
  intro: 'Light four lanterns and find the gingerbread cabin. Do not eat anything.',
  spawn: [16, 16],
  ambience: 'forest',
  hum: 0.01,
  ambientLight: [0.18, 0.15, 0.17],
  bounce: 0.3,
  lightRange: 17,
  fog: { color: 0xf0c0d8, density: 0.03 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'forest',
    params: { treeChance: 0.14, leaves: 'none', floorMat: 'forest_floor' },
  },
  stages: [
    { text: 'Light the lanterns', goal: 'lantern', count: 4, dist: [24, 56] },
    {
      text: 'Find the gingerbread cabin',
      goal: 'cabin',
      dist: [56, 76],
      final: true,
    },
  ],
  entities: [['partygoer', 2], ['pg_mascot', 1]],
  rare: [['rootwalker', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
