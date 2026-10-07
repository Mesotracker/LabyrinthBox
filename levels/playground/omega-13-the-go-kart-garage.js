// --------------------------------------------------------------------------
// Ω-13 - The Go-Kart Garage  (id: pg13, Playground)
// A car park of bumper cars and painted lines. Every kart has been run into every other kart.
//
// Scene: 0 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Reset the ticket machines  [breaker x2]
//    2. Reach the exit booth  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg13',
  name: 'Ω-13',
  subtitle: 'The Go-Kart Garage',
  place: 'Please fasten your helmet',
  cls: 'Class 3',
  seed: 9611,
  description: 'A car park of bumper cars and painted lines. Every kart has been run into every other kart.',
  intro: 'Reset the two ticket machines and leave by the exit booth. The karts do not move. Not while you are looking.',
  spawn: [16, 16],
  outdoor: true,
  ambience: 'city',
  hum: 0.01,
  surface: 'carpet',
  ambientLight: [0.4, 0.38, 0.4],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xf8d8a8, density: 0.011 },
  sky: {
    top: 0xf0b070,
    horizon: 0xf8d8a8,
    glow: 0xffd8a0,
    stars: 0,
    moon: false,
    clouds: 0.7,
  },
  tuning: { grimeScale: 0.1, wetScale: 0.2 },
  gen: { type: 'open', mode: 'lot', params: {} },
  stages: [
    {
      text: 'Reset the ticket machines',
      goal: 'breaker',
      count: 2,
      dist: [24, 52],
    },
    {
      text: 'Reach the exit booth',
      goal: 'door_exit',
      dist: [44, 64],
      final: true,
    },
  ],
  entities: [['pg_attendant', 2], ['hound', 1]],
  rare: [['pg_bouncer', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
