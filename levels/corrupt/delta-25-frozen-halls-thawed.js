// --------------------------------------------------------------------------
// Δ-25 - Frozen Halls, Thawed  (id: cor25, Corruption)
// The ice has let go all at once. Meltwater streams through every hole in the ceiling and runs in strong sheets across the floors. The floor itself has cracked open into crevices, and whole rooms are missing.
//
// Scene: 24 generator settings, 5 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 5, 4 cuts in the floor (block, block, block, crevice), file corruption 0.4
//    1. Restart the heaters  [generator x2]
//    2. Find the way down  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor25',
  name: 'Δ-25',
  subtitle: 'Frozen Halls, Thawed',
  place: 'Level 120, the melt',
  cls: 'Class 4',
  passive: false,
  seed: 8025,
  description: 'The ice has let go all at once. Meltwater streams through every hole in the ceiling and runs in strong sheets across the floors. The floor itself has cracked open into crevices, and whole rooms are missing.',
  intro: 'Restart the two heaters, then find the way down. Meltwater is running through everything. It will push you, and it is freezing.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  fall: true,
  ambience: 'water',
  hum: 0.04,
  ambientLight: [0.0455, 0.053, 0.0655],
  bounce: 0.4,
  lightRange: 18,
  fog: { color: 0x8a969c, density: 0.03808 },
  tuning: { grimeScale: 0.6, wetScale: 0.675 },
  current: { power: 2.2, rate: 0.35, dir: 1, swirl: 1.1 },
  corrupt: 0.4,
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'ice_wall',
      floorMat: 'snow',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.82, 0.9, 1],
      fixtureIntensity: 3.2,
      density: [0.2, 0.5],
      roomChance: 0.4,
      deadChance: 0.22,
      flickerChance: 0.14,
      strobeChance: 0.02,
      dyingChance: 0.09,
      darkZones: 0.42,
      featureWeights: { pool: 0, glass: 0.6, collapse: 1.84, exit: 0.6, blackout: 0.8, leak: 2.4 },
      props: 'industrial',
      missingTileChance: 0.06,
      overgrown: 0.4,
      cracked: 0.7,
      damp: 0.55,
      flood: 0.26,
      waterMat: 'water',
      cuts: [
        { kind: 'block', x: -14, z: -16, w: 9, h: 11, shards: 0.14 },
        { kind: 'block', x: -14, z: -2, w: 9, h: 11, shards: 0.14 },
        { kind: 'block', x: -14, z: 12, w: 9, h: 11, shards: 0.14 },
        {
          kind: 'crevice',
          axis: 'z',
          mid: 8,
          length: 56,
          offset: 22,
          runs: 3,
          spacing: 15,
          width: 1,
          wobble: 9,
        },
      ],
    },
  },
  stages: [
    { text: 'Restart the heaters', goal: 'generator', count: 2, dist: [30, 55] },
    { text: 'Find the way down', goal: 'hatch', dist: [50, 70], final: true },
  ],
  entities: [
    ['hound', 3, null],
    ['mut_drowned', 1, null],
    ['wretch', 1, null],
    ['mut_chorus', 1],
    ['mut_drowned', 1],
  ],
  rare: [['mut_thicket', 0.49], ['haze', 0.49]],
  loot: { keys: 10, water: 5, batteries: 5 },
});
