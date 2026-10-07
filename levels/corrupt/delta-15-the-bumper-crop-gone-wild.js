// --------------------------------------------------------------------------
// Δ-15 - The Bumper Crop, Gone Wild  (id: cor15, Corruption)
// The wheat is higher than it was and thicker, and what moves through it moves wrongly. The barns are tilted.
//
// Scene: 0 generator settings, 4 entity groups, 3 rare spawns, loot keys 12/water 6/batteries 5, file corruption 0.5
//    1. Light the signal lanterns  [lantern x3]
//    2. Find the grain hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor15',
  name: 'Δ-15',
  subtitle: 'The Bumper Crop, Gone Wild',
  place: 'Level 10, untended',
  cls: 'Class 4',
  passive: false,
  seed: 7615,
  description: 'The wheat is higher than it was and thicker, and what moves through it moves wrongly. The barns are tilted.',
  intro: 'Light the three signal lanterns, then find the old grain hatch. Crouch in the wheat to stay hidden. The field has been left alone for a very long time. So have the things in it.',
  spawn: [2, 16],
  outdoor: true,
  cover: true,
  ambience: 'field',
  hum: 0,
  surface: 'grass',
  ambientLight: [0.433, 0.333, 0.258],
  bounce: 0.2,
  lightRange: 18,
  fog: { color: 0x524f44, density: 0.02912 },
  sky: {
    top: 0x15141c,
    horizon: 0x6a4a38,
    glow: 0x5a2a10,
    stars: 0,
    moon: false,
    clouds: 0.85,
  },
  tuning: { grimeScale: 0.45, wetScale: 1.08 },
  corrupt: 0.5,
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
  entities: [
    ['worm', 1, null],
    ['hound', 2, null],
    ['wretch', 1, null],
    ['mut_sprawl', 1],
  ],
  rare: [['mut_thicket', 0.56], ['haze', 0.42], ['duller', 0.35]],
  loot: { keys: 12, water: 6, batteries: 5 },
});
