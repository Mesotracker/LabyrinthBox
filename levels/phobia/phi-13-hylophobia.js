// --------------------------------------------------------------------------
// Φ-13 - Hylophobia  (id: phobia13, The Phobia Wing)
// A moonless pine forest so thick the trunks are walls. Someone is calling your name from between the trees.
//
// Scene: 1 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 10
//    1. Light the trail lanterns  [lantern x4]
//    2. Find the ranger's cabin  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia13',
  name: 'Φ-13',
  subtitle: 'Hylophobia',
  place: 'The Deep Woods',
  cls: 'Class 5',
  seed: 5481,
  description: 'A moonless pine forest so thick the trunks are walls. Someone is calling your name from between the trees.',
  intro: 'Light four trail lanterns, then find the ranger\'s cabin. Keep your flashlight on and charged. Do not follow the voices.',
  spawn: [16, 16],
  ambience: 'forest',
  hum: 0,
  ambientLight: [0.02, 0.026, 0.04],
  bounce: 0.2,
  lightRange: 15,
  fog: { color: 0x0a1018, density: 0.055 },
  tuning: { grimeScale: 0.2, wetScale: 0.6 },
  gen: { type: 'forest', params: { treeChance: 0.2 } },
  stages: [
    {
      text: 'Light the trail lanterns',
      goal: 'lantern',
      count: 4,
      dist: [25, 60],
    },
    {
      text: 'Find the ranger\'s cabin',
      goal: 'cabin',
      dist: [60, 80],
      final: true,
    },
  ],
  entities: [['palestag', 1], ['deathmoth', 1]],
  rare: [['howler', 0.2]],
  loot: { keys: 10, water: 5, batteries: 10 },
});
