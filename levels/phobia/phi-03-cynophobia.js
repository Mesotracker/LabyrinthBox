// --------------------------------------------------------------------------
// Φ-03 - Cynophobia  (id: phobia03, The Phobia Wing)
// A night suburb where every gate is open and every yard has a chain with nothing on the end of it.
//
// Scene: 0 generator settings, 1 entity groups, 1 rare spawns, loot keys 12/water 6/batteries 4
//    1. Find the house key  [find housekey]
//    2. Unlock the front door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia03',
  name: 'Φ-03',
  subtitle: 'Cynophobia',
  place: 'Beware of the Dog',
  cls: 'Class 4',
  seed: 5111,
  description: 'A night suburb where every gate is open and every yard has a chain with nothing on the end of it.',
  intro: 'The house key is in a mailbox. Find the house. Do NOT run when they circle you.',
  spawn: [16, 1.6],
  outdoor: true,
  ambience: 'suburbs',
  hum: 0,
  envLamps: [[2.5, 1.6, 0.8]],
  surface: 'grass',
  ambientLight: [0.03, 0.036, 0.055],
  bounce: 0.22,
  lightRange: 18,
  fog: { color: 0x0a0d14, density: 0.03 },
  sky: {
    top: 0x01020a,
    horizon: 0x141a26,
    glow: 0x05070c,
    stars: 0.6,
    clouds: 0.6,
  },
  tuning: { grimeScale: 0.6, wetScale: 0.8 },
  gen: { type: 'open', mode: 'suburbs', params: {} },
  stages: [
    {
      text: 'Find the house key',
      hint: 'Search the mailboxes',
      item: 'housekey',
      dist: [30, 55],
    },
    {
      text: 'Unlock the front door',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['goodboy', 5]],
  rare: [['hound', 0.3]],
  loot: { keys: 12, water: 6, batteries: 4 },
});
