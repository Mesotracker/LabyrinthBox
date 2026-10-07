// --------------------------------------------------------------------------
// Ω-16 - The Great Staircase  (id: pg16, Playground)
// One great stairwell in candy-cane stripes: twelve flights in a single narrow shaft, turning back on itself all the way to the top. There is nothing else in the tower.
//
// Scene: 19 generator settings, 4 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Climb the great stairwell to the top  [stairshaft - 12 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg16',
  name: 'Ω-16',
  subtitle: 'The Great Staircase',
  place: 'Twelve flights',
  cls: 'Class 4',
  seed: 9752,
  description: 'One great stairwell in candy-cane stripes: twelve flights in a single narrow shaft, turning back on itself all the way to the top. There is nothing else in the tower.',
  intro: 'One narrow shaft, twelve flights, and things that join you partway up. Do not stop to count the floors.',
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
      height: 2.7,
      wallMat: 'metal_red',
      floorMat: 'rubber_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 0.8],
      fixtureIntensity: 3.8,
      density: [0.32, 0.6],
      roomChance: 0.18,
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
      text: 'Climb the great stairwell to the top',
      goal: 'stairshaft',
      flights: 12,
      rise: 2.8,
      dist: [30, 46],
      final: true,
    },
  ],
  entities: [['partygoer', 2], ['pg_attendant', 2], ['hound', 1], ['pg_mascot', 1]],
  rare: [['pg_mascot', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
