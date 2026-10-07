// --------------------------------------------------------------------------
// Δ-27 - The Red Rooms, Bleeding  (id: cor27, Corruption)
// The velvet has rotted black and the ceiling weeps red-brown water in thick streams. A crevice has opened down the red corridor, one room is a hole, and the elevator takes longer than it did.
//
// Scene: 22 generator settings, 4 entity groups, 2 rare spawns, loot keys 9/water 6/batteries 4, 2 cuts in the floor (crevice, block), file corruption 0.35
//    1. Call the elevator  [elevator]
//    2. Survive until the elevator arrives  [survive 45s]
//    3. Get in the elevator  [stage (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor27',
  name: 'Δ-27',
  subtitle: 'The Red Rooms, Bleeding',
  place: 'Level 666, through the ceiling',
  cls: 'Class 5',
  passive: false,
  seed: 8107,
  description: 'The velvet has rotted black and the ceiling weeps red-brown water in thick streams. A crevice has opened down the red corridor, one room is a hole, and the elevator takes longer than it did.',
  intro: 'Call the elevator and stay alive until it arrives. Streams pour from the roof. Do not stand under anything that is dripping red.',
  spawn: [16, 16],
  fall: true,
  hum: 0.06,
  ambientLight: [0.0455, 0.0155, 0.0155],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x3d312c, density: 0.04704 },
  tuning: { grimeScale: 1.5, wetScale: 0.54 },
  corrupt: 0.35,
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'red_room',
      floorMat: 'carpet_red',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_red',
      frameMat: 'metal_dark',
      fixtureColor: [1, 0.25, 0.2],
      fixtureIntensity: 3,
      density: [0.25, 0.55],
      roomChance: 0.6,
      deadChance: 0.2,
      flickerChance: 0.18,
      strobeChance: 0.04,
      dyingChance: 0.09,
      darkZones: 0.42,
      featureWeights: { pool: 0, glass: 0.3, collapse: 1.3, exit: 0, blackout: 1, leak: 2.4 },
      props: 'red',
      missingTileChance: 0.06,
      overgrown: 0.3,
      cracked: 1,
      damp: 0.55,
      cuts: [
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 70,
          offset: -18,
          runs: 3,
          spacing: 16,
          width: 1.2,
          wobble: 9,
        },
        { kind: 'block', x: 20, z: -10, w: 9, h: 11, shards: 0.16 },
      ],
    },
  },
  stages: [
    { text: 'Call the elevator', goal: 'elevator', dist: [45, 60] },
    {
      text: 'Survive until the elevator arrives',
      survive: 45,
      start: [['spawn', 'skinstealer', 2], ['alarm']],
      revert: true,
    },
    { text: 'Get in the elevator', reuse: true, final: true },
  ],
  entities: [
    ['mut_splice', 3, null],
    ['mut_chorus', 2, null],
    ['mut_chorus', 2],
    ['mut_splice', 1],
  ],
  rare: [['duller', 0.49], ['whisperer', 0.28]],
  loot: { keys: 9, water: 6, batteries: 4 },
});
