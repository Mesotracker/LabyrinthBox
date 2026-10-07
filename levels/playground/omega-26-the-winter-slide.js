// --------------------------------------------------------------------------
// Ω-26 - The Winter Slide  (id: pg26, Playground)
// An ice-slide park under artificial snow, with a lodge at the bottom that is lit and warm and has never had a single guest.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Restart the heaters  [generator x2]
//    2. Pick a slide  [slide x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg26',
  name: 'Ω-26',
  subtitle: 'The Winter Slide',
  place: 'Snow and sprinkles',
  cls: 'Class 4',
  seed: 10222,
  description: 'An ice-slide park under artificial snow, with a lodge at the bottom that is lit and warm and has never had a single guest.',
  intro: 'Restart two heaters, then choose a slide. One in four ends in a snowbank. The others end.',
  spawn: [16, 16],
  puzzle: true,
  hum: 0.02,
  ambientLight: [0.1, 0.12, 0.15],
  bounce: 0.4,
  lightRange: 18,
  fog: { color: 0xd0dcec, density: 0.03 },
  tuning: { grimeScale: 0.1, wetScale: 0.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'ice_wall',
      floorMat: 'snow',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.85, 0.92, 1],
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
      props: 'industrial',
    },
  },
  stages: [
    { text: 'Restart the heaters', goal: 'generator', count: 2, dist: [22, 46] },
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
  entities: [['pg_mascot', 1], ['hound', 2]],
  rare: [['frostbitten', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
