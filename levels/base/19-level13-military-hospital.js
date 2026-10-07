// --------------------------------------------------------------------------
// Level 14 - Military Hospital  (id: level13, Base campaign)
// Empty wards, gurneys in the hall, and something that drags itself between the beds.
//
// Scene: 17 generator settings, 3 entity groups, 2 rare spawns, loot keys 9/water 4/batteries 3
//    1. Collect the medical kits  [medkit x3]
//    2. Find the hospital exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level13',
  name: 'Level 14',
  subtitle: 'Military Hospital',
  cls: 'Class 3',
  seed: 2314,
  description: 'Empty wards, gurneys in the hall, and something that drags itself between the beds.',
  intro: 'Collect three medical kits from the wall cabinets, then find the exit.',
  spawn: [16, 16],
  ambientLight: [0.022, 0.026, 0.026],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x141a19, density: 0.036 },
  tuning: { grimeScale: 1.2, wetScale: 0.4 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'plaster_hospital',
      floorMat: 'vct_hospital',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.9, 0.97, 1],
      fixtureIntensity: 3.3,
      density: [0.3, 0.6],
      roomChance: 0.6,
      deadChance: 0.08,
      flickerChance: 0.08,
      strobeChance: 0.02,
      dyingChance: 0.03,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.8, collapse: 0.6, exit: 0.8, blackout: 1 },
      props: 'hospital',
    },
  },
  stages: [
    {
      text: 'Collect the medical kits',
      goal: 'medkit',
      count: 3,
      dist: [25, 55],
    },
    {
      text: 'Find the hospital exit',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['wretch', 3], ['clump', 1], ['faceling', 1]],
  rare: [['whisperer', 0.35], ['crawler', 0.25]],
  loot: { keys: 9, water: 4, batteries: 3 },
});
