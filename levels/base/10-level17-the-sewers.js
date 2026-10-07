// --------------------------------------------------------------------------
// Level 7.1 - The Sewers  (id: level17, Base campaign)
// Dripping brick tunnels and black water. The floodgates are all open.
//
// Scene: 19 generator settings, 4 entity groups, 2 rare spawns, loot keys 9/water 5/batteries 4
//    1. Close the floodgate valves  [valve x3]
//    2. Climb out of the manhole  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level17',
  name: 'Level 7.1',
  subtitle: 'The Sewers',
  cls: 'Class 3',
  seed: 2718,
  description: 'Dripping brick tunnels and black water. The floodgates are all open.',
  intro: 'Close three floodgate valves, then climb out through the manhole.',
  spawn: [16, 16],
  wet: true,
  ambience: 'water',
  hum: 0.03,
  fogBanks: 0.5,
  ambientLight: [0.012, 0.014, 0.012],
  bounce: 0.24,
  lightRange: 15,
  fog: { color: 0x0b0e0a, density: 0.05 },
  tuning: { grimeScale: 1.6, wetScale: 1.6 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.6,
      wallMat: 'concrete_dark',
      floorMat: 'concrete_dark',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_rust',
      fixtureColor: [0.8, 0.95, 0.85],
      fixtureIntensity: 2.8,
      density: [0.35, 0.7],
      roomChance: 0.2,
      fixtureEvery: 3,
      deadChance: 0.15,
      flickerChance: 0.1,
      strobeChance: 0.03,
      dyingChance: 0.06,
      darkZones: 0.4,
      missingTileChance: 0,
      featureWeights: { pool: 2.5, glass: 0, collapse: 0.4, exit: 0.4, blackout: 1.2 },
      props: 'sewer',
    },
  },
  stages: [
    {
      text: 'Close the floodgate valves',
      goal: 'valve',
      count: 3,
      dist: [25, 55],
    },
    {
      text: 'Climb out of the manhole',
      goal: 'hatch',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['wretch', 2], ['clump', 1], ['hound', 2], ['deathmoth', 1]],
  rare: [['haze', 0.4], ['worm', 0.25]],
  loot: { keys: 9, water: 5, batteries: 4 },
});
