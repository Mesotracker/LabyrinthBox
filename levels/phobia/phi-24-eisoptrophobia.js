// --------------------------------------------------------------------------
// Φ-24 - Eisoptrophobia  (id: phobia24, The Phobia Wing)
// A funhouse maze of mirrored walls and white marble. You are in every one of them. Some of them are moving on their own.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Smash the mirror cores  [artifact x3]
//    2. Find the way out of the maze  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia24',
  name: 'Φ-24',
  subtitle: 'Eisoptrophobia',
  place: 'The Hall of Mirrors',
  cls: 'Class 4',
  seed: 5888,
  description: 'A funhouse maze of mirrored walls and white marble. You are in every one of them. Some of them are moving on their own.',
  intro: 'Smash three mirror cores, then find the exit. Your reflections only move when you do. Think before you walk.',
  spawn: [16, 16],
  ambientLight: [0.032, 0.032, 0.036],
  bounce: 0.45,
  lightRange: 18,
  fog: { color: 0x1a1c20, density: 0.03 },
  tuning: { grimeScale: 0.4, wetScale: 0.2 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'mirror',
      floorMat: 'marble_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'chrome',
      fixtureColor: [0.95, 0.97, 1],
      fixtureIntensity: 3.4,
      density: [0.4, 0.75],
      roomChance: 0.2,
      doorwayChance: 0.1,
      pillarChance: 0.3,
      deadChance: 0.08,
      flickerChance: 0.05,
      darkZones: 0.2,
      featureWeights: { pool: 0, glass: 1.6, collapse: 0.2, exit: 0.5, blackout: 0.6 },
      props: 'void',
    },
  },
  stages: [
    {
      text: 'Smash the mirror cores',
      goal: 'artifact',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Find the way out of the maze',
      goal: 'door_exit',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['reflection', 3]],
  rare: [['mannequin', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
