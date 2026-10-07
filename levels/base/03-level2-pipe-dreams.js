// --------------------------------------------------------------------------
// Level 2 - Pipe Dreams  (id: level2, Base campaign)
// Tiled maintenance corridors, standing water and screaming pipes.
//
// Scene: 19 generator settings, 3 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 3
//    1. Shut the steam valves in order  [valve x3]
//    2. Climb out through the maintenance hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level2',
  name: 'Level 2',
  subtitle: 'Pipe Dreams',
  cls: 'Class 3',
  seed: 1203,
  description: 'Tiled maintenance corridors, standing water and screaming pipes.',
  intro: 'The steam lines are open. Find the maintenance log: the valves must be shut in the right order.',
  spawn: [16, 16],
  wet: true,
  puzzle: true,
  hum: 0.07,
  ambientLight: [0.02, 0.028, 0.03],
  bounce: 0.3,
  lightRange: 19,
  fog: { color: 0x101b1e, density: 0.04 },
  tuning: { grimeScale: 1.35, wetScale: 1.4 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'wall_tile',
      floorMat: 'pool_tile',
      ceilMat: 'concrete_painted',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.86, 0.94, 0.98],
      fixtureIntensity: 3,
      density: [0.1, 0.34],
      roomChance: 0.4,
      doorwayChance: 0.1,
      missingTileChance: 0.02,
      deadChance: 0.08,
      flickerChance: 0.06,
      strobeChance: 0.02,
      dyingChance: 0.02,
      darkZones: 0.3,
      featureWeights: { pool: 2.4, glass: 0.3, collapse: 0.5, exit: 0.6, blackout: 0.9 },
      props: 'sewer',
    },
  },
  stages: [
    {
      text: 'Shut the steam valves in order',
      hint: 'Read the maintenance log',
      goal: 'valve',
      count: 3,
      order: ['yellow', 'red', 'blue'],
      dist: [24, 50],
      clueDist: [6, 18],
      clueTitle: 'Maintenance log',
    },
    {
      text: 'Climb out through the maintenance hatch',
      goal: 'hatch',
      dist: [45, 70],
      final: true,
    },
  ],
  entities: [['faceling', 2], ['hound', 1], ['smiler', 2]],
  rare: [['duller', 0.35], ['worm', 0.2]],
  loot: { keys: 8, water: 5, batteries: 3 },
});
