// --------------------------------------------------------------------------
// Φ-07 - Pediophobia  (id: phobia07, The Phobia Wing)
// Rose wallpaper, little beds, a hundred tea parties nobody finished. The dolls are always facing you.
//
// Scene: 16 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 4
//    1. Wind the music boxes  [musicbox x3]
//    2. Take the stairs down  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia07',
  name: 'Φ-07',
  subtitle: 'Pediophobia',
  place: 'The Nursery',
  cls: 'Class 4',
  seed: 5259,
  description: 'Rose wallpaper, little beds, a hundred tea parties nobody finished. The dolls are always facing you.',
  intro: 'Wind the three music boxes to put the nursery to sleep, then take the stairs. Do not look away. You will have to blink.',
  spawn: [16, 16],
  ambientLight: [0.026, 0.02, 0.022],
  bounce: 0.34,
  lightRange: 16,
  fog: { color: 0x1c1418, density: 0.036 },
  tuning: { grimeScale: 0.8, wetScale: 0.2 },
  phobia: { hazards: ['blink'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'wallpaper_rose',
      floorMat: 'carpet_hotel_blue',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_bulb',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.86, 0.74],
      fixtureIntensity: 2.8,
      density: [0.3, 0.6],
      roomChance: 0.75,
      doorwayChance: 0.22,
      deadChance: 0.08,
      flickerChance: 0.08,
      darkZones: 0.25,
      featureWeights: { pool: 0, glass: 0.3, collapse: 0.3, exit: 0.6, blackout: 0.8 },
      props: 'nursery',
    },
  },
  stages: [
    { text: 'Wind the music boxes', goal: 'musicbox', count: 3, dist: [22, 50] },
    {
      text: 'Take the stairs down',
      goal: 'door_stairs',
      dist: [40, 60],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['porcelain', 8]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 4 },
});
