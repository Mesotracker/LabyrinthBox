// --------------------------------------------------------------------------
// Φ-04 - Ornithophobia  (id: phobia04, The Phobia Wing)
// Wheat under a low grey sky, and on every fence, every barn roof, every scarecrow: crows.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 3
//    1. Start the pump generators  [generator x2]
//    2. Find the grain hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia04',
  name: 'Φ-04',
  subtitle: 'Ornithophobia',
  place: 'The Rookery Fields',
  cls: 'Class 3',
  seed: 5148,
  description: 'Wheat under a low grey sky, and on every fence, every barn roof, every scarecrow: crows.',
  intro: 'Start the two pump generators, then get down the grain hatch. When the circle tightens: crouch, freeze.',
  spawn: [2, 16],
  outdoor: true,
  cover: true,
  ambience: 'field',
  hum: 0,
  surface: 'grass',
  ambientLight: [0.22, 0.22, 0.24],
  bounce: 0.22,
  lightRange: 18,
  fog: { color: 0x5a5c60, density: 0.02 },
  sky: {
    top: 0x3a3d44,
    horizon: 0x7a7c80,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 0.3, wetScale: 0.8 },
  gen: { type: 'open', mode: 'field', params: {} },
  stages: [
    {
      text: 'Start the pump generators',
      goal: 'generator',
      count: 2,
      dist: [30, 60],
    },
    { text: 'Find the grain hatch', goal: 'hatch', dist: [55, 75], final: true },
  ],
  entities: [['murder', 3]],
  rare: [['stature', 0.25]],
  loot: { keys: 12, water: 6, batteries: 3 },
});
