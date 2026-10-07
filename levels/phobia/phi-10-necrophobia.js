// --------------------------------------------------------------------------
// Φ-10 - Necrophobia  (id: phobia10, The Phobia Wing)
// Steel drawers, gurneys in rows, bodies under sheets. Most of them have been dead for a very long time.
//
// Scene: 18 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the morgue keycard  [find keycard]
//    2. Swipe out of the cold room  [door_security (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia10',
  name: 'Φ-10',
  subtitle: 'Necrophobia',
  place: 'The Cold Room',
  cls: 'Class 3',
  seed: 5370,
  description: 'Steel drawers, gurneys in rows, bodies under sheets. Most of them have been dead for a very long time.',
  intro: 'The morgue keycard is in one of the cabinets. Walk slowly. Do not run past the bodies.',
  spawn: [16, 16],
  hum: 0.08,
  ambientLight: [0.018, 0.024, 0.026],
  bounce: 0.3,
  lightRange: 17,
  fog: { color: 0x10161a, density: 0.04 },
  tuning: { grimeScale: 1.3, wetScale: 0.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'wall_tile',
      floorMat: 'vct_hospital',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.82, 0.94, 1],
      fixtureIntensity: 3,
      density: [0.2, 0.5],
      roomChance: 0.6,
      doorwayChance: 0.15,
      deadChance: 0.12,
      flickerChance: 0.12,
      strobeChance: 0.02,
      dyingChance: 0.05,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.6, collapse: 0.4, exit: 0.6, blackout: 1 },
      props: 'morgue',
    },
  },
  stages: [
    {
      text: 'Find the morgue keycard',
      hint: 'Cabinets and filing drawers',
      item: 'keycard',
      dist: [35, 55],
    },
    {
      text: 'Swipe out of the cold room',
      goal: 'door_security',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['mourner', 11]],
  rare: [['wretch', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
