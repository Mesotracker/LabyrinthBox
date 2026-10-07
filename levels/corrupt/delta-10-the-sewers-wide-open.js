// --------------------------------------------------------------------------
// Δ-10 - The Sewers, Wide Open  (id: cor10, Corruption)
// The floodgates all failed at once. The tunnels run bank-full with fast black water, the walls weep, and a crevice has opened along the main run. One tunnel end simply is not there any more.
//
// Scene: 25 generator settings, 5 entity groups, 2 rare spawns, loot keys 9/water 5/batteries 5, 2 cuts in the floor (crevice, block), file corruption 0.35
//    1. Close the floodgate valves  [valve x3]
//    2. Climb out of the manhole  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor10',
  name: 'Δ-10',
  subtitle: 'The Sewers, Wide Open',
  place: 'Level 7.1, every gate open',
  cls: 'Class 4',
  passive: false,
  seed: 7410,
  description: 'The floodgates all failed at once. The tunnels run bank-full with fast black water, the walls weep, and a crevice has opened along the main run. One tunnel end simply is not there any more.',
  intro: 'Close three floodgate valves, then climb out through the manhole. Strong current, and a lot of it. Hold the walls when it surges.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  fall: true,
  ambience: 'water',
  hum: 0.03,
  fogBanks: 0.5,
  ambientLight: [0.023, 0.0255, 0.023],
  bounce: 0.24,
  lightRange: 15,
  fog: { color: 0x31372f, density: 0.056 },
  tuning: { grimeScale: 2.4, wetScale: 2.16 },
  current: { power: 3, rate: 0.35, dir: 1.9, swirl: 1.1 },
  corrupt: 0.35,
  gen: {
    type: 'lobby',
    params: {
      height: 2.6,
      wallMat: 'concrete_dark',
      floorMat: 'concrete_dark',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_rust',
      fixtureColor: [0.8, 0.95, 0.85],
      fixtureIntensity: 2.8,
      density: [0.35, 0.7],
      roomChance: 0.2,
      fixtureEvery: 3,
      deadChance: 0.27,
      flickerChance: 0.16,
      strobeChance: 0.03,
      dyingChance: 0.11,
      darkZones: 0.52,
      missingTileChance: 0.06,
      featureWeights: { pool: 2.5, glass: 0, collapse: 1.12, exit: 0.4, blackout: 1.2, leak: 2 },
      props: 'sewer',
      overgrown: 0.4,
      cracked: 0.7,
      damp: 0.55,
      flood: 0.34,
      waterMat: 'water',
      cuts: [
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 64,
          offset: -20,
          runs: 3,
          spacing: 18,
          width: 1.2,
          wobble: 9,
        },
        { kind: 'block', x: -14, z: 14, w: 8, h: 10, shards: 0.1 },
      ],
    },
  },
  stages: [
    {
      text: 'Close the floodgate valves',
      goal: 'valve',
      count: 3,
      dist: [25, 55],
    },
    {
      text: 'Climb out of the manhole',
      goal: 'hatch',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [
    ['wretch', 2, null],
    ['clump', 1, null],
    ['hound', 2, null],
    ['deathmoth', 1, null],
    ['mut_drowned', 2],
  ],
  rare: [['haze', 0.56], ['worm', 0.35]],
  loot: { keys: 9, water: 5, batteries: 5 },
});
