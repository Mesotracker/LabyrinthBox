// --------------------------------------------------------------------------
// Δ-07 - Terror Hotel, Collapsed  (id: cor07, Corruption)
// Damask hanging in strips, carpets sodden to the subfloor. A canyon has taken the east wing, and whole rooms have fallen out of the building and left open air.
//
// Scene: 24 generator settings, 6 entity groups, 3 rare spawns, loot keys 9/water 5/batteries 4, 4 cuts in the floor (canyon, block, block, block), file corruption 0.45
//    1. Find the room key  [find roomkey]
//    2. Reach the service elevator  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor07',
  name: 'Δ-07',
  subtitle: 'Terror Hotel, Collapsed',
  place: 'Level 5, the east wing',
  cls: 'Class 5',
  passive: false,
  seed: 7287,
  description: 'Damask hanging in strips, carpets sodden to the subfloor. A canyon has taken the east wing, and whole rooms have fallen out of the building and left open air.',
  intro: 'Find the room key, then take the service elevator down. The east wing has fallen off. Every route that looks short is not.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.052, 0.041, 0.03],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x92948f, density: 0.024 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.65, wetScale: 0.54 },
  corrupt: 0.45,
  gen: {
    type: 'lobby',
    params: {
      height: 2.6,
      wallMat: 'damask_hotel',
      floorMat: 'carpet_hotel',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'wood_dark',
      fixtureColor: [1, 0.8, 0.56],
      fixtureIntensity: 2.8,
      density: [0.35, 0.7],
      roomChance: 0.75,
      pillarChance: 0.05,
      doorwayChance: 0.2,
      deadChance: 0.22,
      flickerChance: 0.16,
      strobeChance: 0.02,
      dyingChance: 0.1,
      darkZones: 0.42,
      featureWeights: { pool: 0.1, glass: 0, collapse: 1.12, exit: 0.6, blackout: 1, leak: 1.5 },
      props: 'hotel',
      missingTileChance: 0.06,
      overgrown: 0.4,
      cracked: 1,
      damp: 0.55,
      cuts: [
        {
          kind: 'canyon',
          axis: 'z',
          mid: 8,
          length: 60,
          offset: 24,
          width: 5,
          wobble: 10,
          bridges: 2,
          bridgeSpan: 4,
          jag: 3,
        },
        { kind: 'block', x: -20, z: -14, w: 12, h: 14, shards: 0.2 },
        { kind: 'block', x: 20, z: -14, w: 10, h: 10, shards: 0.16 },
        { kind: 'block', x: 18, z: 16, w: 8, h: 12, shards: 0.14 },
      ],
    },
  },
  stages: [
    {
      text: 'Find the room key',
      hint: 'Search nightstands and dressers',
      item: 'roomkey',
      dist: [35, 55],
    },
    {
      text: 'Reach the service elevator',
      goal: 'elevator',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [
    ['mut_splice', 2, null],
    ['wretch', 1, null],
    ['mut_chorus', 2, null],
    ['faceling', 1, null],
    ['mut_splice', 1],
    ['mut_fractured', 1],
  ],
  rare: [['beast', 0.56], ['whisperer', 0.49], ['mut_thicket', 0.28]],
  loot: { keys: 9, water: 5, batteries: 4 },
});
