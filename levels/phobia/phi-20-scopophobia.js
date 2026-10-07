// --------------------------------------------------------------------------
// Φ-20 - Scopophobia  (id: phobia20, The Phobia Wing)
// A portrait gallery where every painted face follows you. The paintings are the least of it.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Take the artefacts  [artifact x3]
//    2. Leave through the gallery doors  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia20',
  name: 'Φ-20',
  subtitle: 'Scopophobia',
  place: 'The Gallery of Eyes',
  cls: 'Class 4',
  seed: 5740,
  description: 'A portrait gallery where every painted face follows you. The paintings are the least of it.',
  intro: 'Take three artefacts from their cases, then leave. Break line of sight before the WATCHED meter fills.',
  spawn: [16, 16],
  ambientLight: [0.026, 0.022, 0.018],
  bounce: 0.34,
  lightRange: 17,
  fog: { color: 0x18140f, density: 0.032 },
  tuning: { grimeScale: 0.6, wetScale: 0.2 },
  phobia: { meters: ['watched'] },
  gen: {
    type: 'lobby',
    params: {
      height: 3.4,
      wallMat: 'gallery_green',
      floorMat: 'wood_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 0.76],
      fixtureIntensity: 3.4,
      density: [0.25, 0.5],
      roomChance: 0.85,
      doorwayChance: 0.25,
      pillarChance: 0.1,
      deadChance: 0.06,
      flickerChance: 0.05,
      darkZones: 0.2,
      featureWeights: { pool: 0, glass: 1.4, collapse: 0.2, exit: 0.6, blackout: 0.5 },
      props: 'museum',
    },
  },
  stages: [
    { text: 'Take the artefacts', goal: 'artifact', count: 3, dist: [25, 55] },
    {
      text: 'Leave through the gallery doors',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['onlooker', 3]],
  rare: [['peripheral', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
