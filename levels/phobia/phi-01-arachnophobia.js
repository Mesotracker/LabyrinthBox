// --------------------------------------------------------------------------
// Φ-01 - Arachnophobia  (id: phobia01, The Phobia Wing)
// Low rafters, boxes nobody unpacked, and webs strung across every doorway.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 5
//    1. Find the fuses  [find fuse x3]
//    2. Replace the fuses  [breaker]
//    3. Get out through the attic hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia01',
  name: 'Φ-01',
  subtitle: 'Arachnophobia',
  place: 'The Attic That Never Ends',
  cls: 'Class 3',
  seed: 5037,
  description: 'Low rafters, boxes nobody unpacked, and webs strung across every doorway.',
  intro: 'Three fuses are hidden in the boxes. Put them in the fuse box and leave. Look up before you walk under anything.',
  spawn: [16, 16],
  ambientLight: [0.02, 0.017, 0.012],
  bounce: 0.3,
  lightRange: 14,
  fog: { color: 0x1a140c, density: 0.045 },
  tuning: { grimeScale: 1.6, wetScale: 0.3 },
  phobia: { hazards: ['webs'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.6,
      wallMat: 'plaster_old',
      floorMat: 'wood_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'wood_dark',
      fixtureColor: [1, 0.78, 0.5],
      fixtureIntensity: 2.4,
      density: [0.3, 0.65],
      roomChance: 0.55,
      doorwayChance: 0.2,
      deadChance: 0.18,
      flickerChance: 0.1,
      darkZones: 0.4,
      missingTileChance: 0.02,
      featureWeights: { pool: 0, glass: 0.2, collapse: 1.2, exit: 0.6, blackout: 1.2 },
      props: 'attic',
    },
  },
  stages: [
    {
      text: 'Find the fuses',
      hint: 'Search boxes and dressers',
      item: 'fuse',
      count: 3,
      dist: [22, 50],
    },
    { text: 'Replace the fuses', goal: 'breaker', dist: [35, 50] },
    {
      text: 'Get out through the attic hatch',
      goal: 'hatch',
      dist: [40, 60],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['weaver', 5]],
  rare: [['crawler', 0.2]],
  loot: { keys: 10, water: 5, batteries: 5 },
});
