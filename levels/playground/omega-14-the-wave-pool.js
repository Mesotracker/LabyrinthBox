// --------------------------------------------------------------------------
// Ω-14 - The Wave Pool  (id: pg14, Playground)
// A sea of turquoise water under a plastic sky, a fake beach, a fake horizon. The waves are real.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Restart the pump generators  [generator x2]
//    2. Pick a slide  [slide x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg14',
  name: 'Ω-14',
  subtitle: 'The Wave Pool',
  place: 'Waves every ten minutes',
  cls: 'Class 3',
  seed: 9658,
  description: 'A sea of turquoise water under a plastic sky, a fake beach, a fake horizon. The waves are real.',
  intro: 'Restart the two pump generators, then reach the drain hatch. The slides at the far end all lead to the same drain. Only one does so safely.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  outdoor: true,
  puzzle: true,
  ambience: 'water',
  hum: 0.01,
  ambientLight: [0.3, 0.34, 0.36],
  bounce: 0.4,
  lightRange: 18,
  fog: { color: 0xbfe6f0, density: 0.026 },
  sky: { top: 0x60b0f0, horizon: 0xd8f0f8, stars: 0, moon: false, clouds: 0.4 },
  tuning: { grimeScale: 0.1, wetScale: 1.8 },
  current: { power: 1.3, rate: 0.28, dir: 0, swirl: 0.8 },
  gen: { type: 'open', mode: 'ocean', params: {} },
  stages: [
    {
      text: 'Restart the pump generators',
      goal: 'generator',
      count: 2,
      dist: [24, 50],
    },
    {
      text: 'Pick a slide',
      hint: 'Only one in four lets you live',
      goal: 'slide',
      count: 4,
      pickSafe: true,
      dist: [18, 30],
      rideTime: 8,
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_lifeguard', 2]],
  rare: [['mut_drowned', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
