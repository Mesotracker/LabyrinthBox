// --------------------------------------------------------------------------
// Δ-24 - Motion, Unwound  (id: cor24, Corruption)
// The candy hills have dried and cracked. The puppets sag on their strings, and some have more than the usual number of arms.
//
// Scene: 0 generator settings, 1 entity groups, 0 rare spawns, loot keys 11/water 5/batteries 5, file corruption 0.55
//    1. Wind up the music boxes before dark  [musicbox x3]
//    2. Reach the little white house  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor24',
  name: 'Δ-24',
  subtitle: 'Motion, Unwound',
  place: 'Level 94, the puppets run down',
  cls: 'Class 2 / 4 at night',
  passive: false,
  seed: 7984,
  description: 'The candy hills have dried and cracked. The puppets sag on their strings, and some have more than the usual number of arms.',
  intro: 'Wind up the three music boxes before dark. When the puppets wake, stand still: they only see what moves. Night comes the same. The puppets still only see what moves.',
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
  ambientLight: [0.508, 0.483, 0.508],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xcdc3c6, density: 0.01456 },
  sky: {
    top: 0x7fb6f0,
    horizon: 0xf6d6e6,
    glow: 0xffc890,
    stars: 0,
    moon: false,
    clouds: 0.8,
  },
  tuning: { grimeScale: 0.15, wetScale: 0.27 },
  corrupt: 0.55,
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
  entities: [['puppet', 6, null]],
  rare: [],
  loot: { keys: 11, water: 5, batteries: 5 },
});
