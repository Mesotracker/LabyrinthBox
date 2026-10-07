// --------------------------------------------------------------------------
// Δ-23 - The School Halls, Overgrown  (id: cor23, Corruption)
// Lockers crusted with moss, classrooms open to the sky. The gym floor ends in a drop into soft white cloud.
//
// Scene: 22 generator settings, 5 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 4, file corruption 0.4
//    1. Ring the school bell  [bell]
//    2. Get out through the main doors  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor23',
  name: 'Δ-23',
  subtitle: 'The School Halls, Overgrown',
  place: 'Level 52, the last bell',
  cls: 'Class 3',
  passive: false,
  seed: 7943,
  description: 'Lockers crusted with moss, classrooms open to the sky. The gym floor ends in a drop into soft white cloud.',
  intro: 'Ring the bell to unlock the main doors. Everything will hear it. The hall past the gym is gone. Every shortcut ends in the same cliff.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.0608, 0.0608, 0.0652],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x909594, density: 0.0204 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.65, wetScale: 0.405 },
  corrupt: 0.4,
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'drywall_blue',
      floorMat: 'vct_school',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.95, 0.97, 1],
      fixtureIntensity: 3.4,
      density: [0.3, 0.6],
      roomChance: 0.6,
      deadChance: 0.19,
      flickerChance: 0.11,
      strobeChance: 0.01,
      dyingChance: 0.07,
      darkZones: 0.37,
      featureWeights: { pool: 0, glass: 0.6, collapse: 1.48, exit: 0.8, blackout: 0.8, leak: 1.5 },
      props: 'school',
      missingTileChance: 0.06,
      overgrown: 0.8,
      cracked: 0.7,
      damp: 0.55,
      cliff: { axis: 'x', mid: 8, length: 64, offset: 24, width: 5, wobble: 10 },
    },
  },
  stages: [
    {
      text: 'Ring the school bell',
      goal: 'bell',
      dist: [35, 50],
      effects: [
        ['alarm'],
        ['spawn', 'hound', 2],
        ['message', 'Everything heard that. Get to the main doors!'],
      ],
    },
    {
      text: 'Get out through the main doors',
      goal: 'door_exit',
      dist: [45, 60],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [
    ['hound', 2, null],
    ['faceling', 3, null],
    ['wretch', 1, null],
    ['mut_splice', 1],
    ['mut_fractured', 1],
  ],
  rare: [['mut_sprawl', 0.42]],
  loot: { keys: 10, water: 5, batteries: 4 },
});
