// --------------------------------------------------------------------------
// Φ-21 - Monophobia  (id: phobia21, The Phobia Wing)
// A shopping centre with the music still playing and nobody in it. Nobody at all. Except, sometimes, at the far end of a hall.
//
// Scene: 16 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 6/batteries 3
//    1. Turn the lighting panels back on  [breaker x2]
//    2. Raise the exit shutter  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia21',
  name: 'Φ-21',
  subtitle: 'Monophobia',
  place: 'The Last Shopper',
  cls: 'Class 4',
  seed: 5777,
  description: 'A shopping centre with the music still playing and nobody in it. Nobody at all. Except, sometimes, at the far end of a hall.',
  intro: 'Turn the two lighting panels back on and raise the shutter. There is nobody else here. Remember that.',
  spawn: [16, 16],
  ambientLight: [0.032, 0.03, 0.028],
  bounce: 0.36,
  lightRange: 22,
  fog: { color: 0x1f1d19, density: 0.026 },
  tuning: { grimeScale: 0.8, wetScale: 0.5 },
  phobia: { meters: ['isolation'] },
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
      fixtureIntensity: 4,
      density: [0.08, 0.3],
      roomChance: 0.4,
      pillarChance: 0.6,
      deadChance: 0.12,
      flickerChance: 0.04,
      darkZones: 0.3,
      featureWeights: { pool: 0.6, glass: 1, collapse: 0.3, exit: 0.8, blackout: 0.8 },
      props: 'mall',
    },
  },
  stages: [
    {
      text: 'Turn the lighting panels back on',
      goal: 'breaker',
      count: 2,
      dist: [30, 55],
    },
    {
      text: 'Raise the exit shutter',
      goal: 'door_shutter',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['someone', 1]],
  rare: [],
  loot: { keys: 10, water: 6, batteries: 3 },
});
