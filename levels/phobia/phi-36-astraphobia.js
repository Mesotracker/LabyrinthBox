// --------------------------------------------------------------------------
// Φ-36 - Astraphobia  (id: phobia36, The Phobia Wing)
// Wheat flattened by wind under a sky that never stops flashing. Thunder on top of thunder. In every flash, a figure, a little closer.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 5
//    1. Light the storm lanterns  [lantern x3]
//    2. Get into the storm cellar  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia36',
  name: 'Φ-36',
  subtitle: 'Astraphobia',
  place: 'The Storm',
  cls: 'Class 5',
  seed: 6332,
  description: 'Wheat flattened by wind under a sky that never stops flashing. Thunder on top of thunder. In every flash, a figure, a little closer.',
  intro: 'Light the three storm lanterns and get down the storm-cellar hatch. When your hair stands on end, move — now.',
  spawn: [2, 16],
  outdoor: true,
  cover: true,
  ambience: 'field',
  hum: 0,
  surface: 'grass',
  ambientLight: [0.03, 0.032, 0.04],
  bounce: 0.2,
  lightRange: 18,
  fog: { color: 0x0a0c12, density: 0.03 },
  sky: {
    top: 0x05060a,
    horizon: 0x1a1c24,
    glow: 0x101420,
    stars: 0,
    moon: false,
    clouds: 1,
  },
  tuning: { grimeScale: 0.3, wetScale: 1.6 },
  phobia: { hazards: ['storm'] },
  gen: { type: 'open', mode: 'field', params: {} },
  stages: [
    {
      text: 'Light the storm lanterns',
      goal: 'lantern',
      count: 3,
      dist: [25, 60],
    },
    {
      text: 'Get into the storm cellar',
      goal: 'hatch',
      dist: [55, 75],
      final: true,
    },
  ],
  entities: [['stormcaller', 1]],
  rare: [['hound', 0.3]],
  loot: { keys: 12, water: 6, batteries: 5 },
});
