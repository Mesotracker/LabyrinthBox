// --------------------------------------------------------------------------
// Φ-17 - Agoraphobia  (id: phobia17, The Phobia Wing)
// A car park that does not end. Sodium lights, mostly dead, and a figure on the horizon in every direction you look.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 3
//    1. Reset the ticket machines  [breaker x2]
//    2. Reach the exit booth  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia17',
  name: 'Φ-17',
  subtitle: 'Agoraphobia',
  place: 'The Overflow Lot',
  cls: 'Class 5',
  seed: 5629,
  description: 'A car park that does not end. Sodium lights, mostly dead, and a figure on the horizon in every direction you look.',
  intro: 'Reset the two ticket machines in the bus shelters, then find the exit booth. Move from shelter to shelter. Do not linger in the open.',
  spawn: [16, 16],
  outdoor: true,
  ambience: 'city',
  hum: 0,
  surface: 'carpet',
  ambientLight: [0.03, 0.026, 0.024],
  bounce: 0.22,
  lightRange: 20,
  fog: { color: 0x120e0a, density: 0.018 },
  sky: {
    top: 0x04040a,
    horizon: 0x2a1c14,
    glow: 0x3a1c08,
    stars: 0.2,
    clouds: 0.5,
  },
  tuning: { grimeScale: 0.9, wetScale: 1 },
  gen: { type: 'open', mode: 'lot', params: {} },
  stages: [
    {
      text: 'Reset the ticket machines',
      goal: 'breaker',
      count: 2,
      dist: [28, 60],
    },
    {
      text: 'Reach the exit booth',
      goal: 'door_exit',
      dist: [45, 70],
      final: true,
    },
  ],
  entities: [['horizon', 1]],
  rare: [['faceling', 0.3]],
  loot: { keys: 12, water: 6, batteries: 3 },
});
