// --------------------------------------------------------------------------
// Δ-09 - The Tideless Sea  (id: cor09, Corruption)
// The sea no longer sits still. The current runs in long slow surges through the fog, and something enormous is no longer at a distance.
//
// Scene: 0 generator settings, 3 entity groups, 3 rare spawns, loot keys 12/water 7/batteries 5, file corruption 0.5
//    1. Restart the beacon generators  [generator x2]
//    2. Find the drain hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor09',
  name: 'Δ-09',
  subtitle: 'The Tideless Sea',
  place: 'Level 7, with the tide gone strange',
  cls: 'Class 4',
  passive: false,
  seed: 7369,
  description: 'The sea no longer sits still. The current runs in long slow surges through the fog, and something enormous is no longer at a distance.',
  intro: 'Restart the two beacon generators, then find the drain hatch on the sea floor. The water is moving now. Fight the current when it surges and use it when it lulls.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  outdoor: true,
  leviathan: true,
  ambience: 'water',
  hum: 0,
  fogBanks: 0.9,
  ambientLight: [0.11425, 0.1205, 0.1205],
  bounce: 0.4,
  lightRange: 16,
  fog: { color: 0x8d9187, density: 0.04704 },
  sky: { top: 0x9a9b94, horizon: 0x8e8f88, stars: 0, moon: false, clouds: 0.8 },
  tuning: { grimeScale: 1.2, wetScale: 1.62 },
  current: { power: 3.2, rate: 0.35, dir: 0.2, swirl: 1.1 },
  corrupt: 0.5,
  gen: { type: 'open', mode: 'ocean', params: {} },
  stages: [
    {
      text: 'Restart the beacon generators',
      goal: 'generator',
      count: 2,
      dist: [30, 60],
    },
    { text: 'Find the drain hatch', goal: 'hatch', dist: [50, 70], final: true },
  ],
  entities: [['haze', 1, null], ['wretch', 1, null], ['mut_drowned', 1]],
  rare: [['whisperer', 0.56], ['duller', 0.42], ['worm', 0.35]],
  loot: { keys: 12, water: 7, batteries: 5 },
});
