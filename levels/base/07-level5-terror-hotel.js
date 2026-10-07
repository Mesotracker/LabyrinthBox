// --------------------------------------------------------------------------
// Level 5 - Terror Hotel  (id: level5, Base campaign)
// A 1930s hotel: velvet corridors, jazz from nowhere, whispers in the walls. The manager is not human.
//
// Scene: 19 generator settings, 4 entity groups, 3 rare spawns, loot keys 9/water 5/batteries 3
//    1. Find the room key  [find roomkey]
//    2. Reach the service elevator  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level5',
  name: 'Level 5',
  subtitle: 'Terror Hotel',
  cls: 'Class 4',
  seed: 1506,
  description: 'A 1930s hotel: velvet corridors, jazz from nowhere, whispers in the walls. The manager is not human.',
  intro: 'Find the room key, then take the service elevator down.',
  spawn: [16, 16],
  ambientLight: [0.02, 0.015, 0.01],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x1c120a, density: 0.04 },
  tuning: { grimeScale: 1.1, wetScale: 0.4 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.6,
      wallMat: 'damask_hotel',
      floorMat: 'carpet_hotel',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'wood_dark',
      fixtureColor: [1, 0.8, 0.56],
      fixtureIntensity: 2.8,
      density: [0.35, 0.7],
      roomChance: 0.75,
      pillarChance: 0.05,
      doorwayChance: 0.2,
      deadChance: 0.1,
      flickerChance: 0.1,
      strobeChance: 0.02,
      dyingChance: 0.05,
      darkZones: 0.3,
      featureWeights: { pool: 0.1, glass: 0, collapse: 0.4, exit: 0.6, blackout: 1 },
      props: 'hotel',
    },
  },
  stages: [
    {
      text: 'Find the room key',
      hint: 'Search nightstands and dressers',
      item: 'roomkey',
      dist: [35, 55],
    },
    {
      text: 'Reach the service elevator',
      goal: 'elevator',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['skinstealer', 2], ['wretch', 1], ['smiler', 2], ['faceling', 1]],
  rare: [['beast', 0.4], ['whisperer', 0.35], ['stature', 0.2]],
  loot: { keys: 9, water: 5, batteries: 3 },
});
