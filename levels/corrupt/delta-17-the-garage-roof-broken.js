// --------------------------------------------------------------------------
// Δ-17 - The Garage Roof, Broken  (id: cor17, Corruption)
// The ramps are gone and the decks are a lattice of walkway hung over cloud, with long stretches torn out and ending in jagged stubs.
//
// Scene: 2 generator settings, 3 entity groups, 2 rare spawns, loot keys 9/water 5/batteries 4, file corruption 0.55
//    1. Restart the two beacon generators  [generator x2]
//    2. Find the maintenance hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor17',
  name: 'Δ-17',
  subtitle: 'The Garage Roof, Broken',
  place: 'Level 11.5, what is left of the decks',
  cls: 'Class 3',
  passive: false,
  seed: 7697,
  description: 'The ramps are gone and the decks are a lattice of walkway hung over cloud, with long stretches torn out and ending in jagged stubs.',
  intro: 'The exit gate is locked. The key is in a locker or toolbox somewhere. Whole spans have gone. When a walkway ends in nothing, go back and take another.',
  spawn: [16, 16],
  fall: true,
  hum: 0.06,
  ambientLight: [0.0388, 0.0322, 0.0234],
  bounce: 0.25,
  lightRange: 18,
  fog: { color: 0x8f928e, density: 0.024 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 2.1, wetScale: 1.35 },
  corrupt: 0.55,
  gen: { type: 'open', mode: 'heights', params: { style: 'sky', broken: 0.75 } },
  stages: [
    {
      text: 'Restart the two beacon generators',
      goal: 'generator',
      count: 2,
      dist: [20, 50],
    },
    {
      text: 'Find the maintenance hatch',
      goal: 'hatch',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['mut_splice', 2, null], ['hound', 2, null], ['mut_chorus', 1]],
  rare: [['mut_sprawl', 0.49], ['duller', 0.28]],
  loot: { keys: 9, water: 5, batteries: 4 },
});
