// --------------------------------------------------------------------------
// Φ-06 - Phasmophobia  (id: phobia06, The Phobia Wing)
// A funeral home after hours: velvet, lilies, rows of chairs facing an empty casket. The lights do not stay on long.
//
// Scene: 18 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 8
//    1. Light the memorial candles  [lantern x4]
//    2. Leave by the side door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia06',
  name: 'Φ-06',
  subtitle: 'Phasmophobia',
  place: 'The Wake',
  cls: 'Class 4',
  seed: 5222,
  description: 'A funeral home after hours: velvet, lilies, rows of chairs facing an empty casket. The lights do not stay on long.',
  intro: 'Light the four memorial candles and leave by the side door. When the lights flicker, find her with your torch.',
  spawn: [16, 16],
  hum: 0.02,
  flashes: [26, 44],
  ambientLight: [0.012, 0.01, 0.01],
  bounce: 0.3,
  lightRange: 14,
  fog: { color: 0x0e0a0a, density: 0.05 },
  tuning: { grimeScale: 1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.9,
      wallMat: 'damask_hotel',
      floorMat: 'carpet_red',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'wood_dark',
      fixtureColor: [1, 0.76, 0.52],
      fixtureIntensity: 2.2,
      density: [0.25, 0.55],
      roomChance: 0.7,
      doorwayChance: 0.25,
      deadChance: 0.3,
      flickerChance: 0.2,
      strobeChance: 0.03,
      dyingChance: 0.08,
      darkZones: 0.5,
      featureWeights: { pool: 0, glass: 0.2, collapse: 0.4, exit: 0.5, blackout: 1.5 },
      props: 'theater',
    },
  },
  stages: [
    {
      text: 'Light the memorial candles',
      goal: 'lantern',
      count: 4,
      dist: [20, 50],
    },
    {
      text: 'Leave by the side door',
      goal: 'door_exit',
      dist: [45, 60],
      final: true,
    },
  ],
  entities: [['revenant', 2]],
  rare: [['whisperer', 0.3]],
  loot: { keys: 10, water: 5, batteries: 8 },
});
