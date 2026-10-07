// --------------------------------------------------------------------------
// Δ-11 - Cave System, Fallen In  (id: cor11, Corruption)
// The caverns have shifted. Old campsites lie under rubble, and the clicking has more voices than before.
//
// Scene: 0 generator settings, 3 entity groups, 2 rare spawns, loot keys 11/water 6/batteries 6, file corruption 0.55
//    1. Light the lanterns  [lantern x3]
//    2. Find the hatch out  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor11',
  name: 'Δ-11',
  subtitle: 'Cave System, Fallen In',
  place: 'Level 8, the roof came down',
  cls: 'Class 4',
  passive: false,
  seed: 7451,
  description: 'The caverns have shifted. Old campsites lie under rubble, and the clicking has more voices than before.',
  intro: 'Light three lanterns to mark the way back, then find the hatch out. Listen for clicking. Passages have collapsed. Listen for the clicking, and for what keeps up with it.',
  spawn: [16, 16],
  ambience: 'water',
  hum: 0,
  fogBanks: 0.45,
  surface: 'soft',
  ambientLight: [0.0705, 0.0705, 0.0805],
  bounce: 0.34,
  lightRange: 15,
  fog: { color: 0x2e332f, density: 0.056 },
  tuning: { grimeScale: 1.2, wetScale: 1.62 },
  corrupt: 0.55,
  gen: { type: 'open', mode: 'cave', params: {} },
  stages: [
    { text: 'Light the lanterns', goal: 'lantern', count: 3, dist: [22, 55] },
    { text: 'Find the hatch out', goal: 'hatch', dist: [50, 70], final: true },
  ],
  entities: [['troglosidae', 3, null], ['deathmoth', 2, null], ['mut_sprawl', 1]],
  rare: [['mut_sprawl', 0.42], ['worm', 0.35]],
  loot: { keys: 11, water: 6, batteries: 6 },
});
