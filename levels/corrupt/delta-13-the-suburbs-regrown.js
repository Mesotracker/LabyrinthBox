// --------------------------------------------------------------------------
// Δ-13 - The Suburbs, Regrown  (id: cor13, Corruption)
// The houses are green boxes. The streets are meadows, the lawns have become forest, and the Watchers have more arms.
//
// Scene: 0 generator settings, 5 entity groups, 2 rare spawns, loot keys 12/water 6/batteries 5, file corruption 0.45
//    1. Find the house key  [find housekey]
//    2. Unlock the right front door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor13',
  name: 'Δ-13',
  subtitle: 'The Suburbs, Regrown',
  place: 'Level 9, a hundred summers on',
  cls: 'Class 5',
  passive: false,
  seed: 7533,
  description: 'The houses are green boxes. The streets are meadows, the lawns have become forest, and the Watchers have more arms.',
  intro: 'The house key is in one of the mailboxes. Find the door it opens. Everything has grown. The cover is thicker and so is what hides in it.',
  spawn: [16, 1.6],
  outdoor: true,
  ambience: 'suburbs',
  hum: 0,
  envLamps: [[2.5, 1.6, 0.8]],
  surface: 'carpet',
  ambientLight: [0.05175, 0.0605, 0.0855],
  bounce: 0.22,
  lightRange: 18,
  fog: { color: 0x313737, density: 0.03136 },
  sky: { top: 0x01020a, horizon: 0x161c2c, glow: 0x0a0c18, stars: 1, clouds: 0.8 },
  tuning: { grimeScale: 0.9, wetScale: 0.945 },
  corrupt: 0.45,
  gen: { type: 'open', mode: 'suburbs', params: {} },
  stages: [
    {
      text: 'Find the house key',
      hint: 'Search the mailboxes',
      item: 'housekey',
      dist: [30, 55],
    },
    {
      text: 'Unlock the right front door',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [
    ['mut_thicket', 1, null],
    ['faceling', 3, null],
    ['hound', 2, null],
    ['mut_drowned', 1, null],
    ['mut_thicket', 1],
  ],
  rare: [['whisperer', 0.56], ['mut_sprawl', 0.49]],
  loot: { keys: 12, water: 6, batteries: 5 },
});
