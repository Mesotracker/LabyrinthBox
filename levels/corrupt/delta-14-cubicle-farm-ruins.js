// --------------------------------------------------------------------------
// Δ-14 - Cubicle Farm, Ruins  (id: cor14, Corruption)
// The partitions have rusted in place and the ceiling has come down in sheets. Whole grids of cubicles are missing and a crevice runs the length of the floor. Rain falls on the monitors.
//
// Scene: 22 generator settings, 5 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 4, 4 cuts in the floor (block, block, block, crevice), file corruption 0.4
//    1. Find the data disks  [find disk x3]
//    2. Upload them at the terminal  [terminal]
//    3. Take the stairwell  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor14',
  name: 'Δ-14',
  subtitle: 'Cubicle Farm, Ruins',
  place: 'Level 9.1, quarter by quarter',
  cls: 'Class 3',
  passive: false,
  seed: 7574,
  description: 'The partitions have rusted in place and the ceiling has come down in sheets. Whole grids of cubicles are missing and a crevice runs the length of the floor. Rain falls on the monitors.',
  intro: 'Find three data disks in the desks, upload them, then take the stairs. The ceiling is mostly gone. Streams of water cross the floor everywhere.',
  spawn: [16, 16],
  fall: true,
  puzzle: true,
  ambientLight: [0.0405, 0.04175, 0.0455],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x3c413f, density: 0.03584 },
  tuning: { grimeScale: 1.35, wetScale: 0.405 },
  corrupt: 0.4,
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'drywall',
      floorMat: 'carpet_office',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.96, 0.98, 1],
      fixtureIntensity: 3.5,
      density: [0.25, 0.5],
      roomChance: 0.4,
      deadChance: 0.18,
      flickerChance: 0.12,
      strobeChance: 0.01,
      dyingChance: 0.07,
      darkZones: 0.37,
      featureWeights: { pool: 0, glass: 3, collapse: 1.12, exit: 0.6, blackout: 0.6, leak: 2.2 },
      props: 'office',
      missingTileChance: 0.06,
      overgrown: 0.55,
      cracked: 1,
      damp: 0.55,
      cuts: [
        { kind: 'block', x: -14, z: -16, w: 10, h: 11, shards: 0.2 },
        { kind: 'block', x: -14, z: -2, w: 10, h: 11, shards: 0.2 },
        { kind: 'block', x: -14, z: 12, w: 10, h: 11, shards: 0.2 },
        {
          kind: 'crevice',
          axis: 'z',
          mid: 8,
          length: 50,
          offset: 24,
          runs: 2,
          spacing: 16,
          width: 1,
          wobble: 8,
        },
      ],
    },
  },
  stages: [
    {
      text: 'Find the data disks',
      hint: 'Search desk drawers and filing cabinets',
      item: 'disk',
      count: 3,
      dist: [25, 55],
    },
    { text: 'Upload them at the terminal', goal: 'terminal', dist: [40, 55] },
    {
      text: 'Take the stairwell',
      goal: 'door_stairs',
      dist: [35, 50],
      from: 'prev',
      final: true,
    },
  ],
  entities: [
    ['faceling', 4, null],
    ['mut_splice', 2, null],
    ['mut_fractured', 2, null],
    ['mut_splice', 1],
    ['mut_fractured', 1],
  ],
  rare: [['whisperer', 0.42], ['mut_thicket', 0.21]],
  loot: { keys: 10, water: 5, batteries: 4 },
});
