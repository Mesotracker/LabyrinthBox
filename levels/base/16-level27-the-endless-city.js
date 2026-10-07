// --------------------------------------------------------------------------
// Level 11 - The Endless City  (id: level27, Base campaign)
// Night avenues between towers that never end. A safe level, by Backrooms standards. Most windows are dark.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 4
//    1. Throw the substation breakers  [breaker x2]
//    2. Find the subway stairs  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level27',
  name: 'Level 11',
  subtitle: 'The Endless City',
  cls: 'Class 1',
  passive: true,
  seed: 3728,
  description: 'Night avenues between towers that never end. A safe level, by Backrooms standards. Most windows are dark.',
  intro: 'Throw the breakers at two substations, then find the subway stairs.',
  spawn: [16, 1.6],
  outdoor: true,
  ambience: 'city',
  hum: 0,
  envLamps: [[2.5, 1.7, 0.9], [1.6, 1.5, 1.2]],
  ambientLight: [0.04, 0.038, 0.045],
  bounce: 0.25,
  lightRange: 18,
  fog: { color: 0x12121a, density: 0.022 },
  sky: {
    top: 0x03040a,
    horizon: 0x221c22,
    glow: 0x3a2010,
    stars: 0.3,
    clouds: 0.6,
  },
  tuning: { grimeScale: 1.1, wetScale: 1 },
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
  entities: [['faceling', 5]],
  rare: [['stature', 0.3]],
  loot: { keys: 12, water: 6, batteries: 4 },
});
