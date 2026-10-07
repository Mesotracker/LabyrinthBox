// --------------------------------------------------------------------------
// Ω-07 - The Carousel Court  (id: pg07, Playground)
// A courtyard of painted horses, brass poles and the same song, over and over, a little out of tune.
//
// Scene: 0 generator settings, 3 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Wind the carousel music boxes  [musicbox x3]
//    2. Reach the park clock  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg07',
  name: 'Ω-07',
  subtitle: 'The Carousel Court',
  place: 'Round and round',
  cls: 'Class 3',
  seed: 9329,
  description: 'A courtyard of painted horses, brass poles and the same song, over and over, a little out of tune.',
  intro: 'Wind three music boxes to quiet the carousels, then reach the park clock. The horses are only decoration. The riders are not.',
  spawn: [16, 16],
  outdoor: true,
  ambience: 'field',
  hum: 0.01,
  surface: 'carpet',
  ambientLight: [0.4, 0.38, 0.4],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xf6d6e6, density: 0.011 },
  sky: {
    top: 0x7fb6f0,
    horizon: 0xf6d6e6,
    glow: 0xffd8a0,
    stars: 0,
    moon: false,
    clouds: 0.7,
  },
  tuning: { grimeScale: 0.1, wetScale: 0.2 },
  gen: { type: 'open', mode: 'courtyard', params: {} },
  stages: [
    {
      text: 'Wind the carousel music boxes',
      goal: 'musicbox',
      count: 3,
      dist: [20, 44],
    },
    {
      text: 'Reach the park clock',
      goal: 'cabin',
      dist: [40, 58],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_ringmaster', 1], ['partygoer', 2], ['jester', 1]],
  rare: [['pg_mascot', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
