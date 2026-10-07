// --------------------------------------------------------------------------
// Δ-16 - The Endless City, Emptied  (id: cor16, Corruption)
// Towers with half their faces torn off, avenues of rubble, a sky with nothing in it. It used to be the safe one.
//
// Scene: 0 generator settings, 3 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 5, file corruption 0.45
//    1. Throw the substation breakers  [breaker x2]
//    2. Find the subway stairs  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor16',
  name: 'Δ-16',
  subtitle: 'The Endless City, Emptied',
  place: 'Level 11, no one left',
  cls: 'Class 2',
  passive: false,
  seed: 7656,
  description: 'Towers with half their faces torn off, avenues of rubble, a sky with nothing in it. It used to be the safe one.',
  intro: 'Throw the breakers at two substations, then find the subway stairs. It is not safe anymore. Take the avenues and not the shadows between them.',
  spawn: [16, 1.6],
  outdoor: true,
  ambience: 'city',
  hum: 0,
  envLamps: [[2.5, 1.7, 0.9], [1.6, 1.5, 1.2]],
  ambientLight: [0.058, 0.0555, 0.06425],
  bounce: 0.25,
  lightRange: 18,
  fog: { color: 0x363a3a, density: 0.02464 },
  sky: {
    top: 0x03040a,
    horizon: 0x221c22,
    glow: 0x3a2010,
    stars: 0.3,
    clouds: 0.8,
  },
  tuning: { grimeScale: 1.65, wetScale: 1.35 },
  corrupt: 0.45,
  gen: { type: 'open', mode: 'city', params: {} },
  stages: [
    {
      text: 'Throw the substation breakers',
      goal: 'breaker',
      count: 2,
      dist: [30, 60],
    },
    {
      text: 'Find the subway stairs',
      goal: 'door_stairs',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['faceling', 5, null], ['mut_splice', 2], ['mut_chorus', 1]],
  rare: [['mut_thicket', 0.42]],
  loot: { keys: 12, water: 6, batteries: 5 },
});
