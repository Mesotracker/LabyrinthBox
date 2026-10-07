// --------------------------------------------------------------------------
// Ω-08 - The Bouncing Hills  (id: pg08, Playground)
// Rolling hills of coloured turf, every one of them slightly too bouncy. The sky is candy and the clouds are cotton.
//
// Scene: 0 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Wind up the music boxes  [musicbox x2]
//    2. Reach the little white house  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg08',
  name: 'Ω-08',
  subtitle: 'The Bouncing Hills',
  place: 'Mind the springs',
  cls: 'Class 2',
  seed: 9376,
  description: 'Rolling hills of coloured turf, every one of them slightly too bouncy. The sky is candy and the clouds are cotton.',
  intro: 'Wind two music boxes and reach the little white house on the far hill.',
  spawn: [16, 16],
  outdoor: true,
  ambience: 'field',
  hum: 0.01,
  surface: 'grass',
  ambientLight: [0.4, 0.38, 0.4],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xfbd8e8, density: 0.011 },
  sky: {
    top: 0x80c0f4,
    horizon: 0xfbd8e8,
    glow: 0xffd8a0,
    stars: 0,
    moon: false,
    clouds: 0.7,
  },
  tuning: { grimeScale: 0.1, wetScale: 0.2 },
  gen: { type: 'open', mode: 'hills', params: {} },
  stages: [
    {
      text: 'Wind up the music boxes',
      goal: 'musicbox',
      count: 2,
      dist: [24, 50],
    },
    {
      text: 'Reach the little white house',
      goal: 'cabin',
      dist: [44, 62],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_mascot', 1], ['partygoer', 2]],
  rare: [['puppet', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
