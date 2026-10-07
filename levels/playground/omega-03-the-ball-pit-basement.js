// --------------------------------------------------------------------------
// Ω-03 - The Ball Pit Basement  (id: pg03, Playground)
// Low ceilings, deep carpet, a hundred thousand plastic balls piled against the walls. Something is swimming in them.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the arcade tokens  [find token x3]
//    2. Feed the token machine  [terminal]
//    3. Crawl out through the slide hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg03',
  name: 'Ω-03',
  subtitle: 'The Ball Pit Basement',
  place: 'Under the soft play',
  cls: 'Class 3',
  seed: 9141,
  description: 'Low ceilings, deep carpet, a hundred thousand plastic balls piled against the walls. Something is swimming in them.',
  intro: 'Find three arcade tokens in the toy chests and feed the machine. The floor is soft. Everything that lives here knows that.',
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
      height: 2.4,
      wallMat: 'plastic_blue',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.9, 0.9, 1],
      fixtureIntensity: 3.8,
      density: [0.2, 0.5],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'nursery',
    },
  },
  stages: [
    {
      text: 'Find the arcade tokens',
      hint: 'Search toy chests',
      item: 'token',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Feed the token machine',
      goal: 'terminal',
      dist: [30, 46],
      from: 'prev',
    },
    {
      text: 'Crawl out through the slide hatch',
      goal: 'hatch',
      dist: [40, 58],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_bouncer', 1], ['partygoer', 2]],
  rare: [['smiler', 0.2]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
