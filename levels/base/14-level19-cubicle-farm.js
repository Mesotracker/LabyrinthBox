// --------------------------------------------------------------------------
// Level 9.1 - Cubicle Farm  (id: level19, Base campaign)
// Glass offices and cubicles to the horizon. Somebody left their data behind.
//
// Scene: 17 generator settings, 3 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the data disks  [find disk x3]
//    2. Upload them at the terminal  [terminal]
//    3. Take the stairwell  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level19',
  name: 'Level 9.1',
  subtitle: 'Cubicle Farm',
  cls: 'Class 2',
  seed: 2920,
  description: 'Glass offices and cubicles to the horizon. Somebody left their data behind.',
  intro: 'Find three data disks in the desks, upload them, then take the stairs.',
  spawn: [16, 16],
  puzzle: true,
  ambientLight: [0.026, 0.027, 0.03],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x1b1d21, density: 0.032 },
  tuning: { grimeScale: 0.9, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'drywall',
      floorMat: 'carpet_office',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.96, 0.98, 1],
      fixtureIntensity: 3.5,
      density: [0.25, 0.5],
      roomChance: 0.4,
      deadChance: 0.06,
      flickerChance: 0.06,
      strobeChance: 0.01,
      dyingChance: 0.02,
      darkZones: 0.25,
      featureWeights: { pool: 0, glass: 3, collapse: 0.4, exit: 0.6, blackout: 0.6 },
      props: 'office',
    },
  },
  stages: [
    {
      text: 'Find the data disks',
      hint: 'Search desk drawers and filing cabinets',
      item: 'disk',
      count: 3,
      dist: [25, 55],
    },
    { text: 'Upload them at the terminal', goal: 'terminal', dist: [40, 55] },
    {
      text: 'Take the stairwell',
      goal: 'door_stairs',
      dist: [35, 50],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['faceling', 4], ['skinstealer', 2], ['mannequin', 2]],
  rare: [['whisperer', 0.3], ['stature', 0.15]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
