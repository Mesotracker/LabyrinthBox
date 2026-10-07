// --------------------------------------------------------------------------
// Level 999 - The Void Halls  (id: level21, Base campaign)
// Black walls that hum, lights that cannot decide, and reality coming apart.
//
// Scene: 17 generator settings, 3 entity groups, 3 rare spawns, loot keys 10/water 6/batteries 4
//    1. Stabilise the anchors  [anchor x3]
//    2. Step through the exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level21',
  name: 'Level 999',
  subtitle: 'The Void Halls',
  cls: 'Class 5',
  seed: 3122,
  description: 'Black walls that hum, lights that cannot decide, and reality coming apart.',
  intro: 'Stabilise three anchors before the halls fall apart, then step through.',
  spawn: [16, 16],
  hum: 0.05,
  flashes: [22, 40],
  ambientLight: [0.006, 0.005, 0.009],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x07050b, density: 0.05 },
  tuning: { grimeScale: 0.6, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'void_wall',
      floorMat: 'concrete_dark',
      ceilMat: 'void_black',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_dark',
      fixtureColor: [0.72, 0.76, 1],
      fixtureIntensity: 3.2,
      density: [0.25, 0.6],
      roomChance: 0.3,
      deadChance: 0.22,
      flickerChance: 0.15,
      strobeChance: 0.06,
      dyingChance: 0.08,
      darkZones: 0.5,
      featureWeights: { pool: 0.2, glass: 0.3, collapse: 1.2, exit: 0.3, blackout: 1.5 },
      props: 'void',
    },
  },
  stages: [
    { text: 'Stabilise the anchors', goal: 'anchor', count: 3, dist: [25, 55] },
    {
      text: 'Step through the exit',
      goal: 'door_exit',
      dist: [50, 65],
      final: true,
    },
  ],
  entities: [['clump', 2], ['smiler', 4], ['howler', 1]],
  rare: [['duller', 0.45], ['whisperer', 0.45], ['haze', 0.35]],
  loot: { keys: 10, water: 6, batteries: 4 },
});
