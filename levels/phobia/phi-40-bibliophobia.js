// --------------------------------------------------------------------------
// Φ-40 - Bibliophobia  (id: phobia40, The Phobia Wing)
// Shelves to the ceiling in every direction, green lamps, the smell of old paper. A sign on every wall: SILENCE.
//
// Scene: 16 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 3
//    1. Return the overdue books  [artifact x3]
//    2. Take the stairs out, quietly  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia40',
  name: 'Φ-40',
  subtitle: 'Bibliophobia',
  place: 'The Stacks',
  cls: 'Class 5',
  seed: 6480,
  description: 'Shelves to the ceiling in every direction, green lamps, the smell of old paper. A sign on every wall: SILENCE.',
  intro: 'Return three overdue books to the reading desks, then take the stairs. It is blind. It hears everything. Crouch.',
  spawn: [16, 16],
  hum: 0,
  ambientLight: [0.018, 0.02, 0.014],
  bounce: 0.3,
  lightRange: 15,
  fog: { color: 0x12140c, density: 0.04 },
  tuning: { grimeScale: 1, wetScale: 0.2 },
  phobia: { meters: ['noise'] },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'damask_green',
      floorMat: 'carpet_green',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'brass',
      fixtureColor: [0.9, 1, 0.75],
      fixtureIntensity: 2.6,
      density: [0.4, 0.75],
      roomChance: 0.5,
      doorwayChance: 0.2,
      deadChance: 0.1,
      flickerChance: 0.05,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.2, collapse: 0.3, exit: 0.6, blackout: 0.8 },
      props: 'library',
    },
  },
  stages: [
    {
      text: 'Return the overdue books',
      goal: 'artifact',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Take the stairs out, quietly',
      goal: 'door_stairs',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['librarian', 2]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 3 },
});
