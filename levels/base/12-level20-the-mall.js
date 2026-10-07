// --------------------------------------------------------------------------
// Level 8.2 - The Mall  (id: level20, Base campaign)
// Shuttered storefronts, planters and a fountain that stopped long ago.
//
// Scene: 18 generator settings, 4 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 3
//    1. Shut off the alarm panels  [breaker x2]
//    2. Leave through the mall exit  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level20',
  name: 'Level 8.2',
  subtitle: 'The Mall',
  cls: 'Class 2',
  seed: 3021,
  description: 'Shuttered storefronts, planters and a fountain that stopped long ago.',
  intro: 'Shut off the alarm panels, then leave through the mall exit.',
  spawn: [16, 16],
  ambientLight: [0.03, 0.029, 0.026],
  bounce: 0.36,
  lightRange: 22,
  fog: { color: 0x1f1d19, density: 0.028 },
  tuning: { grimeScale: 0.9, wetScale: 0.6 },
  gen: {
    type: 'lobby',
    params: {
      height: 4.2,
      wallMat: 'stucco',
      floorMat: 'terrazzo',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.96, 0.88],
      fixtureIntensity: 4.2,
      density: [0.08, 0.3],
      roomChance: 0.4,
      pillarChance: 0.6,
      deadChance: 0.06,
      flickerChance: 0.04,
      strobeChance: 0.01,
      dyingChance: 0.02,
      darkZones: 0.2,
      featureWeights: { pool: 0.8, glass: 1, collapse: 0.4, exit: 0.8, blackout: 0.6 },
      props: 'mall',
    },
  },
  stages: [
    {
      text: 'Shut off the alarm panels',
      goal: 'breaker',
      count: 2,
      dist: [30, 55],
    },
    {
      text: 'Leave through the mall exit',
      goal: 'door_shutter',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['mannequin', 4], ['hound', 1], ['partygoer', 1], ['deathmoth', 1]],
  rare: [['stature', 0.35], ['crawler', 0.2]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
