// --------------------------------------------------------------------------
// Ω-20 - The Sky Tram  (id: pg20, Playground)
// Cable-car stations joined by catwalks over a bright nothing. The tram is long gone. The cables hum.
//
// Scene: 1 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 3
//    1. Throw the station breakers  [breaker x2]
//    2. Reach the maintenance hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg20',
  name: 'Ω-20',
  subtitle: 'The Sky Tram',
  place: 'Mind the gap',
  cls: 'Class 4',
  seed: 9940,
  description: 'Cable-car stations joined by catwalks over a bright nothing. The tram is long gone. The cables hum.',
  intro: 'Throw the two station breakers, then reach the maintenance hatch. Crouch when the wind rises.',
  spawn: [16, 16],
  outdoor: true,
  fall: true,
  ambience: 'field',
  hum: 0.01,
  surface: 'carpet',
  ambientLight: [0.36, 0.34, 0.38],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xf0d8e8, density: 0.02 },
  sky: {
    top: 0xe08ad0,
    horizon: 0xfbe0d0,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.9,
  },
  tuning: { grimeScale: 0.2, wetScale: 0.3 },
  gen: { type: 'open', mode: 'heights', params: { style: 'sky' } },
  stages: [
    {
      text: 'Throw the station breakers',
      goal: 'breaker',
      count: 2,
      dist: [20, 48],
    },
    {
      text: 'Reach the maintenance hatch',
      goal: 'hatch',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['updraft', 3]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 3 },
});
