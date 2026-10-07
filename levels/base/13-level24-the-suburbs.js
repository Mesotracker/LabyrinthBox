// --------------------------------------------------------------------------
// Level 9 - The Suburbs  (id: level24, Base campaign)
// Identical houses under a moon that never moves. Something very tall stands between them.
//
// Scene: 0 generator settings, 4 entity groups, 2 rare spawns, loot keys 12/water 6/batteries 4
//    1. Find the house key  [find housekey]
//    2. Unlock the right front door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level24',
  name: 'Level 9',
  subtitle: 'The Suburbs',
  cls: 'Class 4',
  seed: 3425,
  description: 'Identical houses under a moon that never moves. Something very tall stands between them.',
  intro: 'The house key is in one of the mailboxes. Find the door it opens.',
  spawn: [16, 1.6],
  outdoor: true,
  ambience: 'suburbs',
  hum: 0,
  envLamps: [[2.5, 1.6, 0.8]],
  surface: 'carpet',
  ambientLight: [0.035, 0.042, 0.062],
  bounce: 0.22,
  lightRange: 18,
  fog: { color: 0x0b0e16, density: 0.028 },
  sky: { top: 0x01020a, horizon: 0x161c2c, glow: 0x0a0c18, stars: 1, clouds: 0.45 },
  tuning: { grimeScale: 0.6, wetScale: 0.7 },
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
  entities: [['stature', 1], ['faceling', 3], ['hound', 2], ['howler', 1]],
  rare: [['whisperer', 0.4], ['crawler', 0.35]],
  loot: { keys: 12, water: 6, batteries: 4 },
});
