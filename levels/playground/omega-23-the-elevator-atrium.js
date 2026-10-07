// --------------------------------------------------------------------------
// Ω-23 - The Elevator Atrium  (id: pg23, Playground)
// A tower lobby of glass lifts, each one stopping at the wrong place and each one with a bright little jingle.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Call the lifts  [elevator x3]
//    2. Take the freight elevator down  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg23',
  name: 'Ω-23',
  subtitle: 'The Elevator Atrium',
  place: 'Doors closing',
  cls: 'Class 3',
  seed: 10081,
  description: 'A tower lobby of glass lifts, each one stopping at the wrong place and each one with a bright little jingle.',
  intro: 'Call three lifts to unlock the shaft, then take the freight elevator down.',
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
      height: 4,
      wallMat: 'wallpaper_blue',
      floorMat: 'marble_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.96, 0.9],
      fixtureIntensity: 3.8,
      density: [0.1, 0.3],
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
    },
  },
  stages: [
    { text: 'Call the lifts', goal: 'elevator', count: 3, dist: [22, 48] },
    {
      text: 'Take the freight elevator down',
      goal: 'elevator',
      dist: [40, 58],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_attendant', 2], ['partygoer', 1]],
  rare: [['pg_mascot', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
