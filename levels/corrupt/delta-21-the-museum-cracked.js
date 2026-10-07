// --------------------------------------------------------------------------
// Δ-21 - The Museum, Cracked  (id: cor21, Corruption)
// Cases split, paintings sagging, marble floors fissured along a canyon that runs the length of the gallery, with a crevice between the plinths and one wing missing from the file. The statues are no longer entirely statues.
//
// Scene: 24 generator settings, 3 entity groups, 1 rare spawns, loot keys 9/water 5/batteries 3, 3 cuts in the floor (canyon, crevice, block), file corruption 0.35
//    1. Recover the artifacts  [artifact x3]
//    2. Leave through the gallery exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor21',
  name: 'Δ-21',
  subtitle: 'The Museum, Cracked',
  place: 'Level 30.5, the gallery of fractures',
  cls: 'Class 4',
  passive: false,
  seed: 7861,
  description: 'Cases split, paintings sagging, marble floors fissured along a canyon that runs the length of the gallery, with a crevice between the plinths and one wing missing from the file. The statues are no longer entirely statues.',
  intro: 'Recover three artifacts, then leave. Keep your eyes on the mannequins. The galleries end in a drop. Mind the exhibits: they have grown extra pieces.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.0696, 0.0608, 0.052],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x929591, density: 0.018 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 0.9, wetScale: 0.27 },
  corrupt: 0.35,
  gen: {
    type: 'lobby',
    params: {
      height: 3.4,
      wallMat: 'gallery_red',
      floorMat: 'wood_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 0.76],
      fixtureIntensity: 3.6,
      density: [0.2, 0.45],
      roomChance: 0.9,
      doorwayChance: 0.25,
      pillarChance: 0.1,
      deadChance: 0.18,
      flickerChance: 0.1,
      strobeChance: 0.01,
      dyingChance: 0.07,
      darkZones: 0.32,
      featureWeights: { pool: 0, glass: 1.5, collapse: 0.76, exit: 0.6, blackout: 0.5, leak: 1.2 },
      props: 'museum',
      missingTileChance: 0.06,
      overgrown: 0.4,
      cracked: 1,
      damp: 0.55,
      cuts: [
        {
          kind: 'canyon',
          axis: 'x',
          mid: 8,
          length: 60,
          offset: -22,
          width: 5.5,
          wobble: 10,
          bridges: 2,
          bridgeSpan: 4,
          jag: 3,
        },
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 76,
          offset: -20,
          runs: 3,
          spacing: 19,
          width: 1.3,
          wobble: 11,
        },
        { kind: 'block', x: 20, z: -12, w: 9, h: 9, shards: 0.18 },
      ],
    },
  },
  stages: [
    {
      text: 'Recover the artifacts',
      goal: 'artifact',
      count: 3,
      dist: [25, 60],
    },
    {
      text: 'Leave through the gallery exit',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [
    ['mut_fractured', 7, null],
    ['mut_chorus', 1, null],
    ['mut_fractured', 3],
  ],
  rare: [['mut_thicket', 0.49]],
  loot: { keys: 9, water: 5, batteries: 3 },
});
