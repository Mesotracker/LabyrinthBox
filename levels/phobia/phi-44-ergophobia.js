// --------------------------------------------------------------------------
// Φ-44 - Ergophobia  (id: phobia44, The Phobia Wing)
// Cubicles to the horizon, every in-tray full, every monitor waiting. You are expected to finish all of it before you leave.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Clear the terminals  [terminal x3]
//    2. File the breaker reports  [breaker x2]
//    3. Clock out  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia44',
  name: 'Φ-44',
  subtitle: 'Ergophobia',
  place: 'Overtime',
  cls: 'Class 4',
  seed: 6628,
  description: 'Cubicles to the horizon, every in-tray full, every monitor waiting. You are expected to finish all of it before you leave.',
  intro: 'Clear three terminals, file two breaker reports, then clock out. Keep working — the IDLE meter is how it finds you.',
  spawn: [16, 16],
  ambientLight: [0.026, 0.027, 0.03],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x1b1d21, density: 0.032 },
  tuning: { grimeScale: 0.9, wetScale: 0.3 },
  phobia: { meters: ['idle'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'drywall_grey',
      floorMat: 'carpet_office',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.96, 0.98, 1],
      fixtureIntensity: 3.5,
      density: [0.2, 0.5],
      roomChance: 0.45,
      pillarChance: 0.2,
      deadChance: 0.06,
      flickerChance: 0.06,
      darkZones: 0.2,
      featureWeights: { pool: 0, glass: 2.5, collapse: 0.4, exit: 0.6, blackout: 0.6 },
      props: 'office',
    },
  },
  stages: [
    { text: 'Clear the terminals', goal: 'terminal', count: 3, dist: [20, 50] },
    {
      text: 'File the breaker reports',
      goal: 'breaker',
      count: 2,
      dist: [25, 50],
    },
    { text: 'Clock out', goal: 'door_exit', dist: [40, 60], final: true },
  ],
  entities: [['supervisor', 2]],
  rare: [['faceling', 0.5]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
