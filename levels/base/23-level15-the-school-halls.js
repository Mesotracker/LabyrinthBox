// --------------------------------------------------------------------------
// Level 52 - The School Halls  (id: level15, Base campaign)
// Lockers, linoleum and a bell that has not rung in decades.
//
// Scene: 17 generator settings, 3 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Ring the school bell  [bell]
//    2. Get out through the main doors  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level15',
  name: 'Level 52',
  subtitle: 'The School Halls',
  cls: 'Class 2',
  seed: 2516,
  description: 'Lockers, linoleum and a bell that has not rung in decades.',
  intro: 'Ring the bell to unlock the main doors. Everything will hear it.',
  spawn: [16, 16],
  ambientLight: [0.024, 0.024, 0.026],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x17181a, density: 0.034 },
  tuning: { grimeScale: 1.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'drywall_blue',
      floorMat: 'vct_school',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.95, 0.97, 1],
      fixtureIntensity: 3.4,
      density: [0.3, 0.6],
      roomChance: 0.6,
      deadChance: 0.07,
      flickerChance: 0.05,
      strobeChance: 0.01,
      dyingChance: 0.02,
      darkZones: 0.25,
      featureWeights: { pool: 0, glass: 0.6, collapse: 0.6, exit: 0.8, blackout: 0.8 },
      props: 'school',
    },
  },
  stages: [
    {
      text: 'Ring the school bell',
      goal: 'bell',
      dist: [35, 50],
      effects: [
        ['alarm'],
        ['spawn', 'hound', 2],
        ['message', 'Everything heard that. Get to the main doors!'],
      ],
    },
    {
      text: 'Get out through the main doors',
      goal: 'door_exit',
      dist: [45, 60],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [['hound', 2], ['faceling', 3], ['wretch', 1]],
  rare: [['crawler', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
