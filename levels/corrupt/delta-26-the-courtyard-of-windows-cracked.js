// --------------------------------------------------------------------------
// Δ-26 - The Courtyard of Windows, Cracked  (id: cor26, Corruption)
// The windows have shattered, and what looks out of them has grown. Some of the frames are no longer in walls.
//
// Scene: 0 generator settings, 3 entity groups, 1 rare spawns, loot keys 11/water 5/batteries 4, file corruption 0.45
//    1. Find the window that leads home  [portal_window x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor26',
  name: 'Δ-26',
  subtitle: 'The Courtyard of Windows, Cracked',
  place: 'Level 188, the glass came out',
  cls: 'Class 3',
  passive: false,
  seed: 8066,
  description: 'The windows have shattered, and what looks out of them has grown. Some of the frames are no longer in walls.',
  intro: 'One window shows the way home. Read the note, check every view, and keep your distance from the dark ones. The views are the same. The things behind them are not.',
  spawn: [16, 16],
  outdoor: true,
  puzzle: true,
  ambience: 'city',
  hum: 0,
  fogBanks: 0.25,
  surface: 'carpet',
  ambientLight: [0.258, 0.258, 0.283],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x808788, density: 0.0224 },
  sky: {
    top: 0x4e5462,
    horizon: 0x8a8e97,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.35, wetScale: 1.35 },
  corrupt: 0.45,
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
  entities: [['window', 7, null], ['peripheral', 2, null], ['mut_fractured', 1]],
  rare: [['whisperer', 0.35]],
  loot: { keys: 11, water: 5, batteries: 4 },
});
