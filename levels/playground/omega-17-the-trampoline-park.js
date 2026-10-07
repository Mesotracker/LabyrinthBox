// --------------------------------------------------------------------------
// Ω-17 - The Trampoline Park  (id: pg17, Playground)
// Wall-to-wall trampolines under a roof of coloured nets, the whole floor humming with every jump that ever happened on it.
//
// Scene: 20 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Throw the arena breakers  [breaker x3]
//    2. Take the ride exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg17',
  name: 'Ω-17',
  subtitle: 'The Trampoline Park',
  place: 'No flips',
  cls: 'Class 4',
  seed: 9799,
  description: 'Wall-to-wall trampolines under a roof of coloured nets, the whole floor humming with every jump that ever happened on it.',
  intro: 'Throw three breakers and take the ride exit. The jumping you hear is not you.',
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
      height: 4.2,
      wallMat: 'plastic_orange',
      floorMat: 'rubber_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 0.7],
      fixtureIntensity: 3.8,
      density: [0.08, 0.26],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'party',
      pillarChance: 0.6,
    },
  },
  stages: [
    {
      text: 'Throw the arena breakers',
      goal: 'breaker',
      count: 3,
      dist: [20, 46],
    },
    {
      text: 'Take the ride exit',
      goal: 'door_exit',
      dist: [38, 56],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_bouncer', 2], ['partygoer', 2]],
  rare: [['crawler', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
