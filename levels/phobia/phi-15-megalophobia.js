// --------------------------------------------------------------------------
// Φ-15 - Megalophobia  (id: phobia15, The Phobia Wing)
// Flat farmland in thick evening fog. The ground shakes every few seconds. Far off, a light sweeps the fields.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 4
//    1. Start the irrigation pumps  [generator x3]
//    2. Get into the cellar  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia15',
  name: 'Φ-15',
  subtitle: 'Megalophobia',
  place: 'The Long Shadow',
  cls: 'Class 5',
  seed: 5555,
  description: 'Flat farmland in thick evening fog. The ground shakes every few seconds. Far off, a light sweeps the fields.',
  intro: 'Start three irrigation pumps, then take the cellar hatch. Watch where its light lands. When it turns red: run sideways.',
  spawn: [2, 16],
  outdoor: true,
  cover: true,
  ambience: 'field',
  hum: 0,
  surface: 'grass',
  ambientLight: [0.12, 0.11, 0.12],
  bounce: 0.22,
  lightRange: 18,
  fog: { color: 0x2a2a30, density: 0.022 },
  sky: {
    top: 0x101016,
    horizon: 0x34343c,
    glow: 0x1a1008,
    stars: 0,
    moon: false,
    clouds: 0.9,
  },
  tuning: { grimeScale: 0.3, wetScale: 0.8 },
  gen: { type: 'open', mode: 'field', params: {} },
  stages: [
    {
      text: 'Start the irrigation pumps',
      goal: 'generator',
      count: 3,
      dist: [30, 60],
    },
    { text: 'Get into the cellar', goal: 'hatch', dist: [55, 75], final: true },
  ],
  entities: [['colossus', 1]],
  rare: [['worm', 0.2]],
  loot: { keys: 12, water: 6, batteries: 4 },
});
