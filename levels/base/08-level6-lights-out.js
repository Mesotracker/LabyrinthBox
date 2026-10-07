// --------------------------------------------------------------------------
// Level 6 - Lights Out  (id: level6, Base campaign)
// Total darkness. Only your flashlight, and the grins that answer it.
//
// Scene: 13 generator settings, 2 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 6
//    1. Restart the generator  [generator]
//    2. Find the exit while the power holds  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level6',
  name: 'Level 6',
  subtitle: 'Lights Out',
  cls: 'Class 5',
  seed: 1607,
  description: 'Total darkness. Only your flashlight, and the grins that answer it.',
  intro: 'Every light is dead. Restart the generator and the Smilers will scatter.',
  spawn: [16, 16],
  dark: true,
  hum: 0,
  flashes: [16, 32],
  ambientLight: [0.002, 0.002, 0.002],
  bounce: 0.3,
  lightRange: 17,
  fog: { color: 0x020202, density: 0.05 },
  tuning: { grimeScale: 1.3, wetScale: 0.6 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'concrete_painted',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_grey',
      fixtureColor: [0.9, 0.95, 1],
      fixtureIntensity: 3.4,
      density: [0.2, 0.55],
      allDark: true,
      darkZones: 0,
      featureWeights: { pool: 0.3, glass: 0.4, collapse: 0.8, exit: 0, blackout: 0 },
      props: 'lobby',
    },
  },
  stages: [
    {
      text: 'Restart the generator',
      goal: 'generator',
      dist: [40, 60],
      effects: [['lightsOn']],
    },
    {
      text: 'Find the exit while the power holds',
      goal: 'door_exit',
      dist: [40, 55],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['smiler', 6], ['clump', 1]],
  rare: [['duller', 0.4], ['whisperer', 0.2]],
  loot: { keys: 8, water: 5, batteries: 6 },
});
