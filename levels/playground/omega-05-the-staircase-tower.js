// --------------------------------------------------------------------------
// Ω-05 - The Staircase Tower  (id: pg05, Playground)
// A narrow stairwell the colour of boiled sweets, climbing eight floors in a single shaft. Every flight turns back on itself, and the door at the top is the only way out.
//
// Scene: 19 generator settings, 2 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 3
//    1. Climb the shaft to the top  [stairshaft - 8 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg05',
  name: 'Ω-05',
  subtitle: 'The Staircase Tower',
  place: 'Eight floors, no lift',
  cls: 'Class 3',
  seed: 9235,
  description: 'A narrow stairwell the colour of boiled sweets, climbing eight floors in a single shaft. Every flight turns back on itself, and the door at the top is the only way out.',
  intro: 'One narrow stairwell between you and the top, eight flights of it. It turns back on itself on every landing. Keep moving.',
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
      height: 3,
      wallMat: 'metal_yellow',
      floorMat: 'rubber_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.95, 0.7],
      fixtureIntensity: 3.8,
      density: [0.34, 0.62],
      roomChance: 0.2,
      doorwayChance: 0.16,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'industrial',
    },
  },
  stages: [
    {
      text: 'Climb the shaft to the top',
      goal: 'stairshaft',
      flights: 8,
      rise: 2.8,
      dist: [30, 46],
      final: true,
    },
  ],
  entities: [['partygoer', 2], ['pg_attendant', 1]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 3 },
});
