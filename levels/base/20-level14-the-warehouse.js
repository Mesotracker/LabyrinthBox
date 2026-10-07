// --------------------------------------------------------------------------
// Level 20 - The Warehouse  (id: level14, Base campaign)
// Shelving to the ceiling and a generator that keeps the dark at bay.
//
// Scene: 19 generator settings, 3 entity groups, 2 rare spawns, loot keys 9/water 5/batteries 4
//    1. Shut down the generator  [generator]
//    2. Reach the loading dock before the dark  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level14',
  name: 'Level 20',
  subtitle: 'The Warehouse',
  cls: 'Class 3',
  seed: 2415,
  description: 'Shelving to the ceiling and a generator that keeps the dark at bay.',
  intro: 'Shut down the generator, then reach the loading dock before the dark swallows the place.',
  spawn: [16, 16],
  hum: 0.08,
  ambientLight: [0.016, 0.017, 0.019],
  bounce: 0.26,
  lightRange: 20,
  fog: { color: 0x101214, density: 0.034 },
  tuning: { grimeScale: 1.3, wetScale: 0.6 },
  gen: {
    type: 'lobby',
    params: {
      height: 5,
      wallMat: 'concrete_block',
      floorMat: 'concrete_floor',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_grey',
      fixtureColor: [0.95, 0.96, 1],
      fixtureIntensity: 4.4,
      density: [0.06, 0.24],
      roomChance: 0.15,
      pillarChance: 0.7,
      fixtureEvery: 3,
      deadChance: 0.08,
      flickerChance: 0.06,
      strobeChance: 0.02,
      dyingChance: 0.03,
      darkZones: 0.2,
      featureWeights: { pool: 0.2, glass: 0.4, collapse: 0.5, exit: 0.8, blackout: 0.8 },
      props: 'industrial',
    },
  },
  stages: [
    {
      text: 'Shut down the generator',
      goal: 'generator',
      dist: [40, 55],
      effects: [['powercut', 55, 7]],
    },
    {
      text: 'Reach the loading dock before the dark',
      goal: 'door_shutter',
      dist: [38, 50],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [['hound', 2], ['skinstealer', 1], ['smiler', 2]],
  rare: [['worm', 0.3], ['duller', 0.2]],
  loot: { keys: 9, water: 5, batteries: 4 },
});
