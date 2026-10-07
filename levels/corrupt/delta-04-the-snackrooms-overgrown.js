// --------------------------------------------------------------------------
// Δ-04 - The Snackrooms, Overgrown  (id: cor04, Corruption)
// Vending machines furred with moss, grass through the terrazzo, and almond water that has become something else. Crevices have opened between the rows, and the floor has holes where the file gave out.
//
// Scene: 22 generator settings, 4 entity groups, 2 rare spawns, loot keys 9/water 4/batteries 4, 2 cuts in the floor (block, crevice), file corruption 0.3
//    1. Find working vending machines  [vending x3]
//    2. Reach the exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor04',
  name: 'Δ-04',
  subtitle: 'The Snackrooms, Overgrown',
  place: 'Level 2.5, gone to seed',
  cls: 'Class 3',
  passive: false,
  seed: 7164,
  description: 'Vending machines furred with moss, grass through the terrazzo, and almond water that has become something else. Crevices have opened between the rows, and the floor has holes where the file gave out.',
  intro: 'Find three vending machines that still work, then head for the exit. Plants have taken the floor. Everything that moves in the green is not wind.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.0455, 0.0405, 0.033],
  bounce: 0.32,
  lightRange: 17,
  fog: { color: 0x413f33, density: 0.03584 },
  tuning: { grimeScale: 1.5, wetScale: 0.675 },
  corrupt: 0.3,
  gen: {
    type: 'lobby',
    params: {
      height: 2.75,
      wallMat: 'snack_wall',
      floorMat: 'terrazzo',
      ceilMat: 'l0_ceiling',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.93, 0.8],
      fixtureIntensity: 3.4,
      density: [0.2, 0.5],
      roomChance: 0.5,
      deadChance: 0.18,
      flickerChance: 0.12,
      strobeChance: 0.01,
      dyingChance: 0.07,
      darkZones: 0.37,
      featureWeights: {
        pool: 0.2,
        glass: 0.6,
        collapse: 1.48,
        exit: 0.8,
        blackout: 0.8,
        leak: 1.2,
      },
      props: 'snack',
      missingTileChance: 0.06,
      overgrown: 0.95,
      cracked: 0.7,
      damp: 0.55,
      cuts: [
        { kind: 'block', x: -14, z: -6, w: 10, h: 9, shards: 0.12 },
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 56,
          offset: -24,
          runs: 2,
          spacing: 20,
          width: 0.9,
          wobble: 8,
        },
      ],
    },
  },
  stages: [
    {
      text: 'Find working vending machines',
      goal: 'vending',
      count: 3,
      dist: [25, 55],
    },
    { text: 'Reach the exit', goal: 'door_exit', dist: [50, 70], final: true },
  ],
  entities: [
    ['hound', 2, null],
    ['mut_splice', 1, null],
    ['partygoer', 1, null],
    ['mut_splice', 1],
  ],
  rare: [['haze', 0.28], ['whisperer', 0.21]],
  loot: { keys: 9, water: 4, batteries: 4 },
});
