// --------------------------------------------------------------------------
// Level 188 - The Courtyard of Windows  (id: level30, Base campaign)
// An overcast courtyard boxed in by endless storeys of windows. Some windows look somewhere else. Some look back.
//
// Scene: 0 generator settings, 2 entity groups, 1 rare spawns, loot keys 11/water 5/batteries 3
//    1. Find the window that leads home  [portal_window x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level30',
  name: 'Level 188',
  subtitle: 'The Courtyard of Windows',
  cls: 'Class 2',
  seed: 4031,
  description: 'An overcast courtyard boxed in by endless storeys of windows. Some windows look somewhere else. Some look back.',
  intro: 'One window shows the way home. Read the note, check every view, and keep your distance from the dark ones.',
  spawn: [16, 16],
  outdoor: true,
  puzzle: true,
  ambience: 'city',
  hum: 0,
  fogBanks: 0.25,
  surface: 'carpet',
  ambientLight: [0.2, 0.2, 0.22],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x7c818a, density: 0.02 },
  sky: {
    top: 0x4e5462,
    horizon: 0x8a8e97,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 0.9, wetScale: 1 },
  gen: { type: 'open', mode: 'courtyard', params: {} },
  stages: [
    {
      text: 'Find the window that leads home',
      hint: 'Read the note first',
      goal: 'portal_window',
      count: 4,
      choose: 'lobby',
      dist: [14, 40],
      clueDist: [3, 8],
      clueTitle: 'A note pinned to a bench',
      final: true,
      chooseClue: 'I watched four windows for a week.\nOne opens onto blue water, one onto red, one onto trees, one onto nothing.\nThe last one is yellow and it hums. That one goes home.\nThe others hurt.',
    },
  ],
  entities: [['window', 7], ['peripheral', 2]],
  rare: [['whisperer', 0.25]],
  loot: { keys: 11, water: 5, batteries: 3 },
});
