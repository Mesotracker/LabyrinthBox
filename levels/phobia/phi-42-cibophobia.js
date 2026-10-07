// --------------------------------------------------------------------------
// Φ-42 - Cibophobia  (id: phobia42, The Phobia Wing)
// Counters heaped with food that has been sitting out for years. The smell. Something is still eating.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 10/batteries 3
//    1. Use the vending machines  [vending x3]
//    2. Raise the delivery shutter  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia42',
  name: 'Φ-42',
  subtitle: 'Cibophobia',
  place: 'The Food Court',
  cls: 'Class 3',
  seed: 6554,
  description: 'Counters heaped with food that has been sitting out for years. The smell. Something is still eating.',
  intro: 'Get three things from the vending machines and raise the shutter. It can smell the almond water on you — drink it, do not hoard it.',
  spawn: [16, 16],
  hum: 0.06,
  ambientLight: [0.032, 0.026, 0.018],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x221a0e, density: 0.034 },
  tuning: { grimeScale: 1.6, wetScale: 0.8 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.4,
      wallMat: 'snack_wall',
      floorMat: 'terrazzo',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.92, 0.76],
      fixtureIntensity: 3.4,
      density: [0.15, 0.4],
      roomChance: 0.4,
      pillarChance: 0.5,
      deadChance: 0.08,
      flickerChance: 0.08,
      darkZones: 0.2,
      featureWeights: { pool: 0.3, glass: 0.6, collapse: 0.4, exit: 0.8, blackout: 0.6 },
      props: 'kitchen',
    },
  },
  stages: [
    {
      text: 'Use the vending machines',
      goal: 'vending',
      count: 3,
      dist: [22, 52],
    },
    {
      text: 'Raise the delivery shutter',
      goal: 'door_shutter',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['glutton', 3]],
  rare: [['partygoer', 0.2]],
  loot: { keys: 10, water: 10, batteries: 3 },
});
