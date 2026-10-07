// --------------------------------------------------------------------------
// Δ-02 - The Sunken Zone  (id: cor02, Corruption)
// A canyon has opened through the zone end to end, bridged in two places, with a crevice wandering beside it. The floors end without warning, and below them is pale, soft, endless cloud.
//
// Scene: 26 generator settings, 4 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 4, 2 cuts in the floor (canyon, crevice), file corruption 0.4
//    1. Turn on the breakers  [breaker x3]
//    2. Take the freight elevator  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor02',
  name: 'Δ-02',
  subtitle: 'The Sunken Zone',
  place: 'Where the loading bays stop',
  cls: 'Class 2',
  passive: false,
  seed: 7082,
  description: 'A canyon has opened through the zone end to end, bridged in two places, with a crevice wandering beside it. The floors end without warning, and below them is pale, soft, endless cloud.',
  intro: 'Get the freight elevator running: flip all three breakers first. Parts of the floor have fallen away. If the straight way is gone, find the long one.',
  spawn: [16, 16],
  fall: true,
  fogBanks: 1.1,
  ambientLight: [0.0476, 0.052, 0.0608],
  bounce: 0.28,
  lightRange: 20,
  fog: { color: 0x919796, density: 0.0216 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.725, wetScale: 1.08 },
  corrupt: 0.4,
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
      deadChance: 0.23,
      flickerChance: 0.13,
      strobeChance: 0.01,
      dyingChance: 0.08,
      darkZones: 0.37,
      missingTileChance: 0.04,
      featureWeights: {
        pool: 0.6,
        glass: 0.5,
        collapse: 2.2,
        exit: 0.8,
        blackout: 1.1,
        leak: 1.2,
      },
      props: 'industrial',
      overgrown: 0.4,
      cracked: 0.9,
      damp: 0.55,
      cuts: [
        {
          kind: 'canyon',
          axis: 'x',
          mid: 8,
          length: 64,
          offset: -20,
          width: 5,
          wobble: 10,
          bridges: 2,
          bridgeSpan: 4,
          jag: 3,
        },
        {
          kind: 'crevice',
          axis: 'z',
          mid: 8,
          length: 60,
          offset: 26,
          runs: 1,
          spacing: 16,
          width: 1.1,
          wobble: 8,
        },
      ],
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
  entities: [
    ['hound', 2, null],
    ['faceling', 2, null],
    ['deathmoth', 1, null],
    ['mut_chorus', 1],
  ],
  rare: [['haze', 0.42], ['mut_sprawl', 0.21]],
  loot: { keys: 8, water: 5, batteries: 4 },
});
