// --------------------------------------------------------------------------
// Ω-09 - Splash Plaza  (id: pg09, Playground)
// A flooded plaza of fountains, lazy rivers and plastic palm trees. The water is warm and moving a little.
//
// Scene: 21 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Open the fountain valves  [valve x3]
//    2. Pick a slide  [slide x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg09',
  name: 'Ω-09',
  subtitle: 'Splash Plaza',
  place: 'Knee-deep fun',
  cls: 'Class 3',
  seed: 9423,
  description: 'A flooded plaza of fountains, lazy rivers and plastic palm trees. The water is warm and moving a little.',
  intro: 'Open three fountain valves, then pick a slide. Only one in four slides lets you live. The lifeguard is not a lifeguard.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  puzzle: true,
  ambience: 'water',
  hum: 0.01,
  ambientLight: [0.1, 0.12, 0.13],
  bounce: 0.4,
  lightRange: 18,
  fog: { color: 0xbfe3ea, density: 0.02 },
  tuning: { grimeScale: 0.1, wetScale: 1.8 },
  current: { power: 1, rate: 0.3, dir: 0.5, swirl: 1.2 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'wall_tile_green',
      floorMat: 'pool_tile',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.9, 1, 1],
      fixtureIntensity: 3.8,
      density: [0.14, 0.4],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 2, glass: 0, collapse: 0, exit: 0.2, blackout: 0 },
      props: 'pool',
      flood: 0.34,
      waterMat: 'water',
    },
  },
  stages: [
    {
      text: 'Open the fountain valves',
      goal: 'valve',
      count: 3,
      dist: [20, 44],
    },
    {
      text: 'Pick a slide',
      hint: 'Only one in four lets you live',
      goal: 'slide',
      count: 4,
      pickSafe: true,
      dist: [20, 36],
      rideTime: 8,
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_lifeguard', 2]],
  rare: [['mut_drowned', 0.2]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
