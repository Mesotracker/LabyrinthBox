// --------------------------------------------------------------------------
// Ω-28 - The Grand Finale Slides  (id: pg28, Playground)
// The tallest tower in the park, with a single wide landing of eight chutes, as long as bridges, in every colour that exists.
//
// Scene: 21 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find four golden tickets  [find ticket x4]
//    2. Pick the first slide  [slide x4]
//    3. Pick the last slide  [slide x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg28',
  name: 'Ω-28',
  subtitle: 'The Grand Finale Slides',
  place: 'The big one',
  cls: 'Class 5',
  seed: 10316,
  description: 'The tallest tower in the park, with a single wide landing of eight chutes, as long as bridges, in every colour that exists.',
  intro: 'Two picks, four chutes each. Hold your breath. The park saved its best one for last.',
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
  current: { power: 1, rate: 0.3, dir: 2, swirl: 1.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'wall_tile',
      floorMat: 'pool_tile_blue',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.95, 0.9],
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
      flood: 0.3,
      waterMat: 'water',
    },
  },
  stages: [
    {
      text: 'Find four golden tickets',
      hint: 'Search drawers and boxes',
      item: 'ticket',
      count: 4,
      dist: [22, 50],
    },
    {
      text: 'Pick the first slide',
      hint: 'Only one in four lets you live',
      goal: 'slide',
      count: 4,
      pickSafe: true,
      dist: [20, 36],
      rideTime: 10,
      from: 'prev',
      effects: [['message', 'You survived the first. There is a second.']],
    },
    {
      text: 'Pick the last slide',
      hint: 'Only one in four lets you live',
      goal: 'slide',
      count: 4,
      pickSafe: true,
      dist: [20, 36],
      rideTime: 12,
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_lifeguard', 2], ['pg_mascot', 1]],
  rare: [['mut_drowned', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
