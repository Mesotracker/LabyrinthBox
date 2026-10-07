// --------------------------------------------------------------------------
// Ω-27 - Stairs to the Moon  (id: pg27, Playground)
// A stairwell tower that goes on past any building: one narrow shaft, sixteen flights, and no doors but the one at the top.
//
// Scene: 19 generator settings, 3 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Climb the shaft to the top  [stairshaft - 16 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg27',
  name: 'Ω-27',
  subtitle: 'Stairs to the Moon',
  place: 'Sixteen flights',
  cls: 'Class 5',
  seed: 10269,
  description: 'A stairwell tower that goes on past any building: one narrow shaft, sixteen flights, and no doors but the one at the top.',
  intro: 'Sixteen flights in one narrow shaft, all the way to the top. Do not look down. Do not look up either.',
  spawn: [16, 16],
  hum: 0.01,
  ambientLight: [0.08, 0.08, 0.14],
  bounce: 0.4,
  lightRange: 20,
  fog: { color: 0x8a90c0, density: 0.022 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'metal_blue',
      floorMat: 'rubber_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.8, 0.85, 1],
      fixtureIntensity: 3.8,
      density: [0.32, 0.6],
      roomChance: 0.18,
      doorwayChance: 0.18,
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
      flights: 16,
      rise: 2.8,
      dist: [30, 48],
      final: true,
    },
  ],
  entities: [['partygoer', 2], ['pg_attendant', 1], ['pg_lifeguard', 1]],
  rare: [['pg_ringmaster', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
