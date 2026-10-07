// --------------------------------------------------------------------------
// Level 8 - Cave System  (id: level28, Base campaign)
// Natural caverns under rock that goes on forever. Glowing fungus, old campsites, and things with too many legs.
//
// Scene: 0 generator settings, 2 entity groups, 2 rare spawns, loot keys 11/water 6/batteries 5
//    1. Light the lanterns  [lantern x3]
//    2. Find the hatch out  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level28',
  name: 'Level 8',
  subtitle: 'Cave System',
  cls: 'Class 3',
  seed: 3829,
  description: 'Natural caverns under rock that goes on forever. Glowing fungus, old campsites, and things with too many legs.',
  intro: 'Light three lanterns to mark the way back, then find the hatch out. Listen for clicking.',
  spawn: [16, 16],
  ambience: 'water',
  hum: 0,
  fogBanks: 0.45,
  surface: 'soft',
  ambientLight: [0.05, 0.05, 0.058],
  bounce: 0.34,
  lightRange: 15,
  fog: { color: 0x07080a, density: 0.05 },
  tuning: { grimeScale: 0.8, wetScale: 1.2 },
  gen: { type: 'open', mode: 'cave', params: {} },
  stages: [
    { text: 'Light the lanterns', goal: 'lantern', count: 3, dist: [22, 55] },
    { text: 'Find the hatch out', goal: 'hatch', dist: [50, 70], final: true },
  ],
  entities: [['troglosidae', 3], ['deathmoth', 2]],
  rare: [['crawler', 0.3], ['worm', 0.25]],
  loot: { keys: 11, water: 6, batteries: 5 },
});
