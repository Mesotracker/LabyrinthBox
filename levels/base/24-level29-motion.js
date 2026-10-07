// --------------------------------------------------------------------------
// Level 94 - Motion  (id: level29, Base campaign)
// Rolling claymation hills under a candy sky. Pleasant, by day. When night falls the puppets wake up.
//
// Scene: 0 generator settings, 1 entity groups, 0 rare spawns, loot keys 11/water 5/batteries 4
//    1. Wind up the music boxes before dark  [musicbox x3]
//    2. Reach the little white house  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level29',
  name: 'Level 94',
  subtitle: 'Motion',
  cls: 'Class 1 / 4 at night',
  seed: 3930,
  description: 'Rolling claymation hills under a candy sky. Pleasant, by day. When night falls the puppets wake up.',
  intro: 'Wind up the three music boxes before dark. When the puppets wake, stand still: they only see what moves.',
  spawn: [16, 16],
  outdoor: true,
  puzzle: true,
  ambience: 'field',
  hum: 0,
  dayNight: {
    nightAt: 330,
    nightLight: 0.14,
    nightTop: 263439,
    nightHorizon: 1840176,
    nightFog: 854806,
  },
  surface: 'grass',
  ambientLight: [0.4, 0.38, 0.4],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xe9d6e2, density: 0.013 },
  sky: {
    top: 0x7fb6f0,
    horizon: 0xf6d6e6,
    glow: 0xffc890,
    stars: 0,
    moon: false,
    clouds: 0.75,
  },
  tuning: { grimeScale: 0.1, wetScale: 0.2 },
  gen: { type: 'open', mode: 'hills', params: {} },
  stages: [
    {
      text: 'Wind up the music boxes before dark',
      goal: 'musicbox',
      count: 3,
      dist: [25, 55],
      effects: [
        ['night'],
        [
          'message',
          'The sky goes out. The puppets are waking. If one looks at you, STOP MOVING.',
        ],
      ],
    },
    {
      text: 'Reach the little white house',
      goal: 'cabin',
      dist: [45, 65],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['puppet', 6]],
  rare: [],
  loot: { keys: 11, water: 5, batteries: 4 },
});
