// --------------------------------------------------------------------------
// Δ-12 - The Mall, Hollowed  (id: cor12, Corruption)
// Shuttered storefronts with their shutters hanging by one hinge. The atrium floor has dropped away into a canyon, the fountain is a hole, and one shopfront is gone from the map.
//
// Scene: 23 generator settings, 5 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 4, 2 cuts in the floor (canyon, block), file corruption 0.4
//    1. Shut off the alarm panels  [breaker x2]
//    2. Leave through the mall exit  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor12',
  name: 'Δ-12',
  subtitle: 'The Mall, Hollowed',
  place: 'Level 8.2, the atrium fell',
  cls: 'Class 3',
  passive: false,
  seed: 7492,
  description: 'Shuttered storefronts with their shutters hanging by one hinge. The atrium floor has dropped away into a canyon, the fountain is a hole, and one shopfront is gone from the map.',
  intro: 'Shut off the alarm panels, then leave through the mall exit. The central atrium is gone. Find the way round it, and keep clear of the mannequins that came with it.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.074, 0.0718, 0.0652],
  bounce: 0.36,
  lightRange: 22,
  fog: { color: 0x939794, density: 0.0168 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.35, wetScale: 0.81 },
  corrupt: 0.4,
  gen: {
    type: 'lobby',
    params: {
      height: 4.2,
      wallMat: 'stucco',
      floorMat: 'terrazzo',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.96, 0.88],
      fixtureIntensity: 4.2,
      density: [0.08, 0.3],
      roomChance: 0.4,
      pillarChance: 0.6,
      deadChance: 0.18,
      flickerChance: 0.1,
      strobeChance: 0.01,
      dyingChance: 0.07,
      darkZones: 0.32,
      featureWeights: { pool: 0.8, glass: 1, collapse: 1.12, exit: 0.8, blackout: 0.6, leak: 1.5 },
      props: 'mall',
      missingTileChance: 0.06,
      overgrown: 0.5,
      cracked: 0.7,
      damp: 0.55,
      cuts: [
        {
          kind: 'canyon',
          axis: 'x',
          mid: 8,
          length: 60,
          offset: 24,
          width: 5.5,
          wobble: 10,
          bridges: 2,
          bridgeSpan: 4,
          jag: 3,
        },
        { kind: 'block', x: -18, z: 14, w: 13, h: 13, shards: 0.24 },
      ],
    },
  },
  stages: [
    {
      text: 'Shut off the alarm panels',
      goal: 'breaker',
      count: 2,
      dist: [30, 55],
    },
    {
      text: 'Leave through the mall exit',
      goal: 'door_shutter',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [
    ['mut_fractured', 4, null],
    ['hound', 1, null],
    ['partygoer', 1, null],
    ['deathmoth', 1, null],
    ['mut_fractured', 2],
  ],
  rare: [['mut_thicket', 0.49], ['mut_sprawl', 0.28]],
  loot: { keys: 10, water: 5, batteries: 4 },
});
