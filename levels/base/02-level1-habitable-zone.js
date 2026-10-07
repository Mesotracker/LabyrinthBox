// --------------------------------------------------------------------------
// Level 1 - Habitable Zone  (id: level1, Base campaign)
// Concrete halls and loading bays. Fog rolls off the puddles and hangs there for hours.
//
// Scene: 22 generator settings, 3 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 3
//    1. Turn on the breakers  [breaker x3]
//    2. Take the freight elevator  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level1',
  name: 'Level 1',
  subtitle: 'Habitable Zone',
  cls: 'Class 1',
  seed: 1102,
  description: 'Concrete halls and loading bays. Fog rolls off the puddles and hangs there for hours.',
  intro: 'Get the freight elevator running: flip all three breakers first.',
  spawn: [16, 16],
  fogBanks: 1.1,
  ambientLight: [0.018, 0.02, 0.024],
  bounce: 0.28,
  lightRange: 20,
  fog: { color: 0x1a1d22, density: 0.036 },
  tuning: { grimeScale: 1.15, wetScale: 0.8 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.5,
      wallMat: 'concrete_painted',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_grey',
      fixtureColor: [0.88, 0.93, 1],
      fixtureIntensity: 3.2,
      density: [0.12, 0.4],
      roomChance: 0.25,
      pillarChance: 0.5,
      doorwayChance: 0.07,
      fixtureEvery: 3,
      fixtureChance: 0.9,
      deadChance: 0.11,
      flickerChance: 0.07,
      strobeChance: 0.01,
      dyingChance: 0.03,
      darkZones: 0.25,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.6, glass: 0.5, collapse: 1, exit: 0.8, blackout: 1.1 },
      props: 'industrial',
    },
  },
  stages: [
    { text: 'Turn on the breakers', goal: 'breaker', count: 3, dist: [22, 55] },
    {
      text: 'Take the freight elevator',
      goal: 'elevator',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['hound', 2], ['faceling', 2], ['deathmoth', 1]],
  rare: [['haze', 0.3], ['crawler', 0.15]],
  loot: { keys: 8, water: 5, batteries: 3 },
});
