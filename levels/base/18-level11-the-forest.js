// --------------------------------------------------------------------------
// Level 13.1 - The Forest  (id: level11, Base campaign)
// A moonless forest that goes on forever. Hounds hunt between the trunks.
//
// Scene: 1 generator settings, 3 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 3
//    1. Light the lanterns  [lantern x3]
//    2. Find the cabin  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level11',
  name: 'Level 13.1',
  subtitle: 'The Forest',
  cls: 'Class 4',
  seed: 2112,
  description: 'A moonless forest that goes on forever. Hounds hunt between the trunks.',
  intro: 'Light three lanterns to mark the trail, then find the cabin.',
  spawn: [16, 16],
  ambience: 'forest',
  hum: 0,
  ambientLight: [0.045, 0.055, 0.075],
  bounce: 0.2,
  lightRange: 16,
  fog: { color: 0x18222c, density: 0.05 },
  tuning: { grimeScale: 0.2, wetScale: 0.5 },
  gen: { type: 'forest', params: { treeChance: 0.14 } },
  stages: [
    { text: 'Light the lanterns', goal: 'lantern', count: 3, dist: [25, 60] },
    { text: 'Find the cabin', goal: 'cabin', dist: [60, 80], final: true },
  ],
  entities: [['hound', 3], ['howler', 1], ['deathmoth', 2]],
  rare: [['worm', 0.35], ['stature', 0.3]],
  loot: { keys: 8, water: 5, batteries: 3 },
});
