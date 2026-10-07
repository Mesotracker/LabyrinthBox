// --------------------------------------------------------------------------
// Level 7 - Thalassophobia  (id: level26, Base campaign)
// A rusted bunker on an endless, still sea. The fog is bone dust. Something huge moves out there.
//
// Scene: 0 generator settings, 2 entity groups, 3 rare spawns, loot keys 12/water 7/batteries 4
//    1. Restart the beacon generators  [generator x2]
//    2. Find the drain hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level26',
  name: 'Level 7',
  subtitle: 'Thalassophobia',
  cls: 'Class 3',
  seed: 3627,
  description: 'A rusted bunker on an endless, still sea. The fog is bone dust. Something huge moves out there.',
  intro: 'Restart the two beacon generators, then find the drain hatch on the sea floor.',
  spawn: [16, 16],
  wade: true,
  outdoor: true,
  leviathan: true,
  ambience: 'ocean',
  hum: 0,
  fogBanks: 0.9,
  ambientLight: [0.085, 0.09, 0.09],
  bounce: 0.4,
  lightRange: 16,
  fog: { color: 0x8e8f88, density: 0.042 },
  sky: { top: 0x9a9b94, horizon: 0x8e8f88, stars: 0, moon: false, clouds: 0 },
  tuning: { grimeScale: 0.8, wetScale: 1.2 },
  gen: { type: 'open', mode: 'ocean', params: {} },
  stages: [
    {
      text: 'Restart the beacon generators',
      goal: 'generator',
      count: 2,
      dist: [30, 60],
    },
    { text: 'Find the drain hatch', goal: 'hatch', dist: [50, 70], final: true },
  ],
  entities: [['haze', 1], ['wretch', 1]],
  rare: [['whisperer', 0.4], ['duller', 0.3], ['worm', 0.25]],
  loot: { keys: 12, water: 7, batteries: 4 },
});
