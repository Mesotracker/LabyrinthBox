// --------------------------------------------------------------------------
// Δ-06 - The Abandoned Office, Abandoned Again  (id: cor06, Corruption)
// Monitors grown over with ivy, the water coolers dry. The far end of the floor is a torn edge and a drop into cloud.
//
// Scene: 23 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 9/batteries 4, file corruption 0.35
//    1. Find the security keycard  [find keycard]
//    2. Open the security door  [door_security (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor06',
  name: 'Δ-06',
  subtitle: 'The Abandoned Office, Abandoned Again',
  place: 'Level 4, past the last person',
  cls: 'Class 2',
  passive: false,
  seed: 7246,
  description: 'Monitors grown over with ivy, the water coolers dry. The far end of the floor is a torn edge and a drop into cloud.',
  intro: 'The security door needs a keycard. Someone left it in a desk drawer. There is no ceiling past the third bay. Take the long way round the edge.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.0608, 0.063, 0.0674],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x919795, density: 0.0192 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.35, wetScale: 0.405 },
  corrupt: 0.35,
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'drywall_grey',
      floorMat: 'carpet_office',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.95, 0.97, 1],
      fixtureIntensity: 3.4,
      density: [0.15, 0.45],
      roomChance: 0.6,
      pillarChance: 0.2,
      deadChance: 0.19,
      flickerChance: 0.12,
      strobeChance: 0.01,
      dyingChance: 0.07,
      darkZones: 0.32,
      featureWeights: { pool: 0, glass: 2.5, collapse: 1.48, exit: 0.6, blackout: 0.6, leak: 1.4 },
      props: 'office',
      missingTileChance: 0.06,
      overgrown: 0.6,
      cracked: 0.7,
      damp: 0.55,
      cliff: { axis: 'x', mid: 8, length: 56, offset: 26, width: 5, wobble: 10 },
    },
  },
  stages: [
    {
      text: 'Find the security keycard',
      hint: 'Search desk drawers',
      item: 'keycard',
      dist: [35, 55],
    },
    {
      text: 'Open the security door',
      goal: 'door_security',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['faceling', 3, null], ['mut_splice', 2]],
  rare: [['mut_thicket', 0.28]],
  loot: { keys: 10, water: 9, batteries: 4 },
});
