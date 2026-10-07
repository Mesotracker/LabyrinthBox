// --------------------------------------------------------------------------
// Level 4 - Abandoned Office  (id: level4, Base campaign)
// Endless empty offices, humming monitors, water coolers full of almond water. Quiet. Safe, mostly.
//
// Scene: 18 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 9/batteries 3
//    1. Find the security keycard  [find keycard]
//    2. Open the security door  [door_security (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level4',
  name: 'Level 4',
  subtitle: 'Abandoned Office',
  cls: 'Class 1',
  passive: true,
  seed: 1405,
  description: 'Endless empty offices, humming monitors, water coolers full of almond water. Quiet. Safe, mostly.',
  intro: 'The security door needs a keycard. Someone left it in a desk drawer.',
  spawn: [16, 16],
  ambientLight: [0.024, 0.025, 0.027],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x1a1c1f, density: 0.032 },
  tuning: { grimeScale: 0.9, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'drywall_grey',
      floorMat: 'carpet_office',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.95, 0.97, 1],
      fixtureIntensity: 3.4,
      density: [0.15, 0.45],
      roomChance: 0.6,
      pillarChance: 0.2,
      deadChance: 0.07,
      flickerChance: 0.06,
      strobeChance: 0.01,
      dyingChance: 0.02,
      darkZones: 0.2,
      featureWeights: { pool: 0, glass: 2.5, collapse: 0.6, exit: 0.6, blackout: 0.6 },
      props: 'office',
    },
  },
  stages: [
    {
      text: 'Find the security keycard',
      hint: 'Search desk drawers',
      item: 'keycard',
      dist: [35, 55],
    },
    {
      text: 'Open the security door',
      goal: 'door_security',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['faceling', 3]],
  rare: [['stature', 0.2]],
  loot: { keys: 10, water: 9, batteries: 3 },
});
