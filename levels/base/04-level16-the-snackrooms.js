// --------------------------------------------------------------------------
// Level 2.5 - The Snackrooms  (id: level16, Base campaign)
// Vending machines hum in every room. A few still dispense almond water.
//
// Scene: 17 generator settings, 3 entity groups, 2 rare spawns, loot keys 9/water 4/batteries 3
//    1. Find working vending machines  [vending x3]
//    2. Reach the exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level16',
  name: 'Level 2.5',
  subtitle: 'The Snackrooms',
  cls: 'Class 2',
  seed: 2617,
  description: 'Vending machines hum in every room. A few still dispense almond water.',
  intro: 'Find three vending machines that still work, then head for the exit.',
  spawn: [16, 16],
  ambientLight: [0.03, 0.026, 0.02],
  bounce: 0.32,
  lightRange: 17,
  fog: { color: 0x221a10, density: 0.032 },
  tuning: { grimeScale: 1, wetScale: 0.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.75,
      wallMat: 'snack_wall',
      floorMat: 'terrazzo',
      ceilMat: 'l0_ceiling',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.93, 0.8],
      fixtureIntensity: 3.4,
      density: [0.2, 0.5],
      roomChance: 0.5,
      deadChance: 0.06,
      flickerChance: 0.06,
      strobeChance: 0.01,
      dyingChance: 0.02,
      darkZones: 0.25,
      featureWeights: { pool: 0.2, glass: 0.6, collapse: 0.6, exit: 0.8, blackout: 0.8 },
      props: 'snack',
    },
  },
  stages: [
    {
      text: 'Find working vending machines',
      goal: 'vending',
      count: 3,
      dist: [25, 55],
    },
    { text: 'Reach the exit', goal: 'door_exit', dist: [50, 70], final: true },
  ],
  entities: [['hound', 2], ['skinstealer', 1], ['partygoer', 1]],
  rare: [['haze', 0.2], ['whisperer', 0.15]],
  loot: { keys: 9, water: 4, batteries: 3 },
});
