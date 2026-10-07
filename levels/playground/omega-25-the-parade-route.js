// --------------------------------------------------------------------------
// Ω-25 - The Parade Route  (id: pg25, Playground)
// Bunting from every window, floats parked end to end, the street one long ribbon of paper. The crowd has gone to the rooftops.
//
// Scene: 0 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Throw the float breakers  [breaker x2]
//    2. Take the subway stairwell up  [stairshaft - 6 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg25',
  name: 'Ω-25',
  subtitle: 'The Parade Route',
  place: 'Streets of confetti',
  cls: 'Class 3',
  seed: 10175,
  description: 'Bunting from every window, floats parked end to end, the street one long ribbon of paper. The crowd has gone to the rooftops.',
  intro: 'Throw the two float breakers and take the subway stairwell up. Everyone on the rooftops is waving.',
  spawn: [16, 16],
  outdoor: true,
  ambience: 'city',
  hum: 0.01,
  surface: 'carpet',
  ambientLight: [0.4, 0.38, 0.4],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xf8d0b0, density: 0.011 },
  sky: {
    top: 0xf09870,
    horizon: 0xf8d0b0,
    glow: 0xffd8a0,
    stars: 0,
    moon: false,
    clouds: 0.7,
  },
  tuning: { grimeScale: 0.1, wetScale: 0.2 },
  gen: { type: 'open', mode: 'city', params: {} },
  stages: [
    {
      text: 'Throw the float breakers',
      goal: 'breaker',
      count: 2,
      dist: [24, 52],
    },
    {
      text: 'Take the subway stairwell up',
      goal: 'stairshaft',
      flights: 6,
      rise: 2.8,
      dist: [46, 66],
      final: true,
    },
  ],
  entities: [['pg_mascot', 1], ['partygoer', 3]],
  rare: [['pg_ringmaster', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
