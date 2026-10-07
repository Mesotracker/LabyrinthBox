// --------------------------------------------------------------------------
// Level 11.5 - Parking Garage  (id: level12, Base campaign)
// Sodium light, oil stains and rows of cars with nobody to drive them.
//
// Scene: 19 generator settings, 2 entity groups, 2 rare spawns, loot keys 9/water 5/batteries 3
//    1. Find the gate key  [find gatekey]
//    2. Open the exit gate  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level12',
  name: 'Level 11.5',
  subtitle: 'Parking Garage',
  cls: 'Class 2',
  seed: 2213,
  description: 'Sodium light, oil stains and rows of cars with nobody to drive them.',
  intro: 'The exit gate is locked. The key is in a locker or toolbox somewhere.',
  spawn: [16, 16],
  hum: 0.06,
  ambientLight: [0.014, 0.011, 0.007],
  bounce: 0.25,
  lightRange: 18,
  fog: { color: 0x120d06, density: 0.04 },
  tuning: { grimeScale: 1.4, wetScale: 1 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.9,
      wallMat: 'concrete',
      floorMat: 'asphalt',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_sodium',
      frameMat: 'metal_dark',
      fixtureColor: [1, 0.64, 0.32],
      fixtureIntensity: 3.2,
      density: [0.05, 0.18],
      roomChance: 0.1,
      pillarChance: 1,
      fixtureEvery: 3,
      deadChance: 0.12,
      flickerChance: 0.08,
      strobeChance: 0.02,
      dyingChance: 0.04,
      darkZones: 0.3,
      featureWeights: { pool: 0.2, glass: 0, collapse: 0.6, exit: 0.8, blackout: 1 },
      props: 'garage',
    },
  },
  stages: [
    {
      text: 'Find the gate key',
      hint: 'Search lockers, cabinets and toolboxes',
      item: 'gatekey',
      dist: [40, 60],
    },
    {
      text: 'Open the exit gate',
      goal: 'door_shutter',
      dist: [50, 75],
      final: true,
    },
  ],
  entities: [['skinstealer', 2], ['hound', 2]],
  rare: [['crawler', 0.35], ['duller', 0.2]],
  loot: { keys: 9, water: 5, batteries: 3 },
});
