// --------------------------------------------------------------------------
// Φ-26 - Atelophobia  (id: phobia26, The Phobia Wing)
// Perfect white halls, perfect marble floors, perfect statues — and broken glass scattered everywhere you need to walk.
//
// Scene: 16 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 7/batteries 2
//    1. Recover the flawless pieces  [artifact x3]
//    2. Leave without a scratch  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia26',
  name: 'Φ-26',
  subtitle: 'Atelophobia',
  place: 'The White Gallery',
  cls: 'Class 3',
  seed: 5962,
  description: 'Perfect white halls, perfect marble floors, perfect statues — and broken glass scattered everywhere you need to walk.',
  intro: 'Recover three flawless pieces, then leave. While you are unhurt, it will not see you. Stay perfect.',
  spawn: [16, 16],
  ambientLight: [0.04, 0.04, 0.04],
  bounce: 0.46,
  lightRange: 20,
  fog: { color: 0x2a2a2a, density: 0.024 },
  tuning: { grimeScale: 0.2, wetScale: 0.2 },
  phobia: { hazards: ['glass'] },
  gen: {
    type: 'lobby',
    params: {
      height: 3.6,
      wallMat: 'statue_marble',
      floorMat: 'marble_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 1, 1],
      fixtureIntensity: 3.8,
      density: [0.15, 0.4],
      roomChance: 0.8,
      doorwayChance: 0.25,
      deadChance: 0.02,
      flickerChance: 0.02,
      darkZones: 0.05,
      featureWeights: { pool: 0, glass: 1.4, collapse: 0.1, exit: 0.5, blackout: 0.2 },
      props: 'museum',
    },
  },
  stages: [
    {
      text: 'Recover the flawless pieces',
      goal: 'artifact',
      count: 3,
      dist: [25, 55],
    },
    {
      text: 'Leave without a scratch',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['flawless', 3]],
  rare: [],
  loot: { keys: 10, water: 7, batteries: 2 },
});
