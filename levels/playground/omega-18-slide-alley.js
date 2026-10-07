// --------------------------------------------------------------------------
// Ω-18 - Slide Alley  (id: pg18, Playground)
// Three slide towers one after another, each with four chutes and a smiling sign. The sign is the only thing that tells the truth.
//
// Scene: 21 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the ride tickets  [find ticket x3]
//    2. Pick a slide: Tower 1  [slide x4]
//    3. Pick a slide: Tower 2  [slide x4]
//    4. Pick a slide: Tower 3  [slide x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg18',
  name: 'Ω-18',
  subtitle: 'Slide Alley',
  place: 'Three towers, twelve chutes',
  cls: 'Class 5',
  seed: 9846,
  description: 'Three slide towers one after another, each with four chutes and a smiling sign. The sign is the only thing that tells the truth.',
  intro: 'Climb each tower and choose a slide. Three picks, one in four each time. Nobody has ever done this on a first try.',
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
      text: 'Find the ride tickets',
      hint: 'Search drawers and boxes',
      item: 'ticket',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Pick a slide: Tower 1',
      hint: 'Only one in four lets you live',
      goal: 'slide',
      count: 4,
      pickSafe: true,
      dist: [20, 36],
      rideTime: 8,
      from: 'prev',
      effects: [['message', 'Tower 2 is next door.']],
    },
    {
      text: 'Pick a slide: Tower 2',
      hint: 'Only one in four lets you live',
      goal: 'slide',
      count: 4,
      pickSafe: true,
      dist: [20, 36],
      rideTime: 8,
      from: 'prev',
      effects: [['message', 'Tower 3.']],
    },
    {
      text: 'Pick a slide: Tower 3',
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
  rare: [],
  loot: { keys: 10, water: 5, batteries: 3 },
});
