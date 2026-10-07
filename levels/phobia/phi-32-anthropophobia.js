// --------------------------------------------------------------------------
// Φ-32 - Anthropophobia  (id: phobia32, The Phobia Wing)
// Night streets between towers, and people. Grey coats, faces you cannot quite see, standing still in the road. Watching.
//
// Scene: 0 generator settings, 1 entity groups, 0 rare spawns, loot keys 12/water 6/batteries 3
//    1. Throw the substation breakers  [breaker x2]
//    2. Get down into the subway  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia32',
  name: 'Φ-32',
  subtitle: 'Anthropophobia',
  place: 'Rush Hour',
  cls: 'Class 4',
  seed: 6184,
  description: 'Night streets between towers, and people. Grey coats, faces you cannot quite see, standing still in the road. Watching.',
  intro: 'Throw the breakers at two substations, then get down into the subway. Keep them in front of you. Never let them crowd you.',
  spawn: [16, 1.6],
  outdoor: true,
  ambience: 'city',
  hum: 0,
  envLamps: [[2.5, 1.7, 0.9], [1.6, 1.5, 1.2]],
  ambientLight: [0.04, 0.038, 0.045],
  bounce: 0.25,
  lightRange: 18,
  fog: { color: 0x12121a, density: 0.024 },
  sky: {
    top: 0x03040a,
    horizon: 0x221c22,
    glow: 0x3a2010,
    stars: 0.2,
    clouds: 0.7,
  },
  tuning: { grimeScale: 1.1, wetScale: 1.2 },
  gen: { type: 'open', mode: 'city', params: {} },
  stages: [
    {
      text: 'Throw the substation breakers',
      goal: 'breaker',
      count: 2,
      dist: [30, 60],
    },
    {
      text: 'Get down into the subway',
      goal: 'door_stairs',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['stranger', 11]],
  rare: [],
  loot: { keys: 12, water: 6, batteries: 3 },
});
