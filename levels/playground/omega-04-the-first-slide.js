// --------------------------------------------------------------------------
// Ω-04 - The First Slide  (id: pg04, Playground)
// A tiled landing at the top of a tower, four slides side by side, each painted a different colour. They all look equally fun.
//
// Scene: 21 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find two ride tickets for the tower  [find ticket x2]
//    2. Pick a slide  [slide x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg04',
  name: 'Ω-04',
  subtitle: 'The First Slide',
  place: 'Four chutes, one splash',
  cls: 'Class 3',
  seed: 9188,
  description: 'A tiled landing at the top of a tower, four slides side by side, each painted a different colour. They all look equally fun.',
  intro: 'Get the tower lift key, then choose a slide. Only one of the four ends in water. The others end where slides should not.',
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
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'wall_tile',
      floorMat: 'pool_tile_blue',
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
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'pool',
      flood: 0.2,
      waterMat: 'water',
    },
  },
  stages: [
    {
      text: 'Find two ride tickets for the tower',
      hint: 'Search drawers and boxes',
      item: 'ticket',
      count: 2,
      dist: [22, 50],
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
  entities: [['pg_lifeguard', 1]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 3 },
});
