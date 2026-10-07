// --------------------------------------------------------------------------
// Level 10 - The Bumper Crop  (id: level25, Base campaign)
// Wheat to the horizon under a bruised dusk. Stained fences. Something tunnels under the roads.
//
// Scene: 0 generator settings, 3 entity groups, 3 rare spawns, loot keys 12/water 6/batteries 4
//    1. Light the signal lanterns  [lantern x3]
//    2. Find the grain hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level25',
  name: 'Level 10',
  subtitle: 'The Bumper Crop',
  cls: 'Class 3',
  seed: 3526,
  description: 'Wheat to the horizon under a bruised dusk. Stained fences. Something tunnels under the roads.',
  intro: 'Light the three signal lanterns, then find the old grain hatch. Crouch in the wheat to stay hidden.',
  spawn: [2, 16],
  outdoor: true,
  cover: true,
  ambience: 'field',
  hum: 0,
  surface: 'grass',
  ambientLight: [0.34, 0.26, 0.2],
  bounce: 0.2,
  lightRange: 18,
  fog: { color: 0x3a3028, density: 0.026 },
  sky: {
    top: 0x15141c,
    horizon: 0x6a4a38,
    glow: 0x5a2a10,
    stars: 0,
    moon: false,
    clouds: 0.85,
  },
  tuning: { grimeScale: 0.3, wetScale: 0.8 },
  gen: { type: 'open', mode: 'field', params: {} },
  stages: [
    {
      text: 'Light the signal lanterns',
      goal: 'lantern',
      count: 3,
      dist: [25, 60],
    },
    { text: 'Find the grain hatch', goal: 'hatch', dist: [60, 80], final: true },
  ],
  entities: [['worm', 1], ['hound', 2], ['wretch', 1]],
  rare: [['stature', 0.4], ['haze', 0.3], ['duller', 0.25]],
  loot: { keys: 12, water: 6, batteries: 4 },
});
