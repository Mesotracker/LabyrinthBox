// --------------------------------------------------------------------------
// Ω-10 - The Escalator Atrium  (id: pg10, Playground)
// Six storeys of mall atrium whose escalators all stop at the wrong floor. The only way up is the stairwell in the service core: one narrow shaft, six flights.
//
// Scene: 20 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Take the stairwell to the sixth floor  [stairshaft - 6 flights, rise 3 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg10',
  name: 'Ω-10',
  subtitle: 'The Escalator Atrium',
  place: 'Going up',
  cls: 'Class 3',
  seed: 9470,
  description: 'Six storeys of mall atrium whose escalators all stop at the wrong floor. The only way up is the stairwell in the service core: one narrow shaft, six flights.',
  intro: 'The escalators are stopping at the wrong floors. Take the stairwell: one shaft, six flights to the top of the atrium.',
  spawn: [16, 16],
  hum: 0.01,
  ambientLight: [0.1, 0.09, 0.1],
  bounce: 0.4,
  lightRange: 20,
  fog: { color: 0xf2dce8, density: 0.016 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 5.4,
      wallMat: 'stucco',
      floorMat: 'terrazzo',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.96, 0.88],
      fixtureIntensity: 3.8,
      density: [0.06, 0.2],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'mall',
      pillarChance: 0.7,
    },
  },
  stages: [
    {
      text: 'Take the stairwell to the sixth floor',
      goal: 'stairshaft',
      flights: 6,
      rise: 3,
      dist: [30, 48],
      final: true,
    },
  ],
  entities: [['mannequin', 3], ['partygoer', 1]],
  rare: [['pg_attendant', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
