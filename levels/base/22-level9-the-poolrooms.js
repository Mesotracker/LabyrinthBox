// --------------------------------------------------------------------------
// Level 37 - The Poolrooms  (id: level9, Base campaign)
// Knee-deep warm water over white tile, deep pools with stairs down into them. Nothing here wants you. Calm.
//
// Scene: 19 generator settings, 0 entity groups, 0 rare spawns, loot keys 8/water 6/batteries 2
//    1. Shut the pool valves in order  [valve x3]
//    2. Find the stairwell door  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level9',
  name: 'Level 37',
  subtitle: 'The Poolrooms',
  cls: 'Class 1',
  passive: true,
  seed: 1910,
  description: 'Knee-deep warm water over white tile, deep pools with stairs down into them. Nothing here wants you. Calm.',
  intro: 'It is quiet. Read the maintenance log, shut the valves in order, then find the stairwell.',
  spawn: [16, 16],
  wade: true,
  puzzle: true,
  ambience: 'water',
  hum: 0.02,
  ambientLight: [0.045, 0.055, 0.06],
  bounce: 0.42,
  lightRange: 22,
  fog: { color: 0x9fb8bd, density: 0.022 },
  tuning: { grimeScale: 0.4, wetScale: 1.6 },
  gen: {
    type: 'lobby',
    params: {
      height: 4,
      wallMat: 'wall_tile',
      floorMat: 'pool_tile',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.92, 0.98, 1],
      fixtureIntensity: 4.2,
      density: [0.08, 0.3],
      roomChance: 0.2,
      pillarChance: 0.6,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0.01,
      darkZones: 0,
      featureWeights: { pool: 4, glass: 0, collapse: 0, exit: 0.3, blackout: 0 },
      props: 'pool',
      flood: 0.38,
    },
  },
  stages: [
    {
      text: 'Shut the pool valves in order',
      hint: 'Read the maintenance log',
      goal: 'valve',
      count: 3,
      order: ['blue', 'green', 'red'],
      dist: [22, 48],
      clueDist: [5, 14],
      clueTitle: 'Maintenance log',
    },
    {
      text: 'Find the stairwell door',
      goal: 'door_stairs',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [],
  rare: [],
  loot: { keys: 8, water: 6, batteries: 2 },
});
