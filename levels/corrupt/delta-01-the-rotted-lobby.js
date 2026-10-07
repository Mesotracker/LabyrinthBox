// --------------------------------------------------------------------------
// Δ-01 - The Rotted Lobby  (id: cor01, Corruption)
// The yellow has gone green. Ceiling tiles lie where they fell and the light comes down through the gaps in dusty bars. Two rooms did not load at all, and only their holes are left.
//
// Scene: 21 generator settings, 1 entity groups, 0 rare spawns, loot keys 7/water 4/batteries 3, 2 cuts in the floor (block, block), file corruption 0.35
//    1. Find the exit door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor01',
  name: 'Δ-01',
  subtitle: 'The Rotted Lobby',
  place: 'Level 0, a thousand years on',
  cls: 'Class 2',
  passive: false,
  seed: 7041,
  description: 'The yellow has gone green. Ceiling tiles lie where they fell and the light comes down through the gaps in dusty bars. Two rooms did not load at all, and only their holes are left.',
  intro: 'Nothing lives here. Only the hum, and the feeling of being watched. Find a way out. The roof has holes now. Water comes through them in streams, and something has grown in the carpet.',
  spawn: [16, 16],
  wet: true,
  fall: true,
  ambientLight: [0.0455, 0.043, 0.033],
  bounce: 0.34,
  lightRange: 17,
  fog: { color: 0x434132, density: 0.0336 },
  tuning: { grimeScale: 1.5, wetScale: 1.35 },
  corrupt: 0.35,
  gen: {
    type: 'lobby',
    params: {
      height: 2.75,
      wallMat: 'l0_wall',
      floorMat: 'l0_carpet',
      ceilMat: 'l0_ceiling',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.94, 0.78],
      fixtureIntensity: 3.6,
      density: [0.22, 0.62],
      deadChance: 0.17,
      flickerChance: 0.11,
      strobeChance: 0.012,
      dyingChance: 0.065,
      darkZones: 0.42,
      featureWeights: {
        pool: 0.5,
        glass: 0.8,
        collapse: 1.66,
        exit: 0.9,
        blackout: 1.4,
        leak: 1.6,
      },
      props: 'lobby',
      missingTileChance: 0.06,
      overgrown: 0.5,
      cracked: 0.7,
      damp: 0.55,
      cuts: [
        { kind: 'block', x: 18, z: -12, w: 9, h: 12, shards: 0.14 },
        { kind: 'block', x: -16, z: 6, w: 8, h: 10, shards: 0.1 },
      ],
    },
  },
  stages: [
    {
      text: 'Find the exit door',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['mut_chorus', 1]],
  rare: [],
  loot: { keys: 7, water: 4, batteries: 3 },
});
