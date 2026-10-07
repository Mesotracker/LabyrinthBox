// --------------------------------------------------------------------------
// Ω-11 - The Mirror Maze  (id: pg11, Playground)
// Corridors of mirrors, each reflecting a slightly different corridor. Your reflection is a little behind.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Throw the maze breakers  [breaker x3]
//    2. Find the exit door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg11',
  name: 'Ω-11',
  subtitle: 'The Mirror Maze',
  place: 'Which one is you',
  cls: 'Class 4',
  seed: 9517,
  description: 'Corridors of mirrors, each reflecting a slightly different corridor. Your reflection is a little behind.',
  intro: 'Throw three breakers in the maze and leave by the exit door. Do not trust a reflection that moves first.',
  spawn: [16, 16],
  hum: 0.01,
  ambientLight: [0.1, 0.09, 0.1],
  bounce: 0.4,
  lightRange: 20,
  fog: { color: 0xf2dce8, density: 0.016 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'mirror',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.9, 0.95, 1],
      fixtureIntensity: 3.8,
      density: [0.3, 0.6],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'theater',
    },
  },
  stages: [
    {
      text: 'Throw the maze breakers',
      goal: 'breaker',
      count: 3,
      dist: [20, 44],
    },
    {
      text: 'Find the exit door',
      goal: 'door_exit',
      dist: [38, 56],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_attendant', 2], ['faceling', 2]],
  rare: [['mannequin', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
