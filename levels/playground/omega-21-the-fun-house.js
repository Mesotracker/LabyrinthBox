// --------------------------------------------------------------------------
// Ω-21 - The Fun House  (id: pg21, Playground)
// Glass boxes, crooked rooms and corridors that are shorter on the way out. Distorting mirrors in every doorway.
//
// Scene: 19 generator settings, 3 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the fun house keys  [find ticket x2]
//    2. Take the stairwell out  [stairshaft - 5 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg21',
  name: 'Ω-21',
  subtitle: 'The Fun House',
  place: 'Walls that lean',
  cls: 'Class 4',
  seed: 9987,
  description: 'Glass boxes, crooked rooms and corridors that are shorter on the way out. Distorting mirrors in every doorway.',
  intro: 'Find the two fun house keys in the glass rooms, then climb the stairwell out. The glass is thinner than it looks.',
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
      height: 3.2,
      wallMat: 'party_wall',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 1],
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
      featureWeights: { pool: 0, glass: 3, collapse: 0, exit: 0.4, blackout: 0 },
      props: 'theater',
    },
  },
  stages: [
    {
      text: 'Find the fun house keys',
      item: 'ticket',
      count: 2,
      dist: [20, 44],
    },
    {
      text: 'Take the stairwell out',
      goal: 'stairshaft',
      flights: 5,
      rise: 2.8,
      dist: [36, 54],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_ringmaster', 1], ['jester', 1], ['partygoer', 2]],
  rare: [['faceling', 0.5]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
