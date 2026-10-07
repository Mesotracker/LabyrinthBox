// --------------------------------------------------------------------------
// Δ-08 - Lights Out, For Good  (id: cor08, Corruption)
// There were never any lights here, and now there is no floor to speak of either: crevices open underfoot, one corridor is missing entirely, and something is breathing from every hole in the ceiling.
//
// Scene: 21 generator settings, 3 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 7, 2 cuts in the floor (crevice, block), file corruption 0.5
//    1. Restart the generator  [generator]
//    2. Find the exit while the power holds  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor08',
  name: 'Δ-08',
  subtitle: 'Lights Out, For Good',
  place: 'Level 6, the dark that stopped moving',
  cls: 'Class 5',
  passive: false,
  seed: 7328,
  description: 'There were never any lights here, and now there is no floor to speak of either: crevices open underfoot, one corridor is missing entirely, and something is breathing from every hole in the ceiling.',
  intro: 'Every light is dead. Restart the generator and the Smilers will scatter. Holes in the roof let in a grey nothing. Do not mistake it for a light.',
  spawn: [16, 16],
  fall: true,
  dark: true,
  hum: 0,
  flashes: [16, 32],
  ambientLight: [0.0105, 0.0105, 0.0105],
  bounce: 0.3,
  lightRange: 17,
  fog: { color: 0x2b2e29, density: 0.056 },
  tuning: { grimeScale: 1.95, wetScale: 0.81 },
  corrupt: 0.5,
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'concrete_painted',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_grey',
      fixtureColor: [0.9, 0.95, 1],
      fixtureIntensity: 3.4,
      density: [0.2, 0.55],
      allDark: true,
      darkZones: 0.24,
      featureWeights: { pool: 0.3, glass: 0.4, collapse: 1.84, exit: 0, blackout: 0, leak: 2 },
      props: 'lobby',
      missingTileChance: 0.06,
      deadChance: 0.17,
      dyingChance: 0.065,
      flickerChance: 0.11,
      overgrown: 0.5,
      cracked: 1,
      damp: 0.55,
      cuts: [
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 80,
          offset: -20,
          runs: 3,
          spacing: 9,
          width: 1.4,
          wobble: 10,
        },
        { kind: 'block', x: 20, z: 18, w: 8, h: 8, shards: 0.1 },
      ],
    },
  },
  stages: [
    {
      text: 'Restart the generator',
      goal: 'generator',
      dist: [40, 60],
      effects: [['lightsOn']],
    },
    {
      text: 'Find the exit while the power holds',
      goal: 'door_exit',
      dist: [40, 55],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['mut_chorus', 6, null], ['clump', 1, null], ['mut_chorus', 2]],
  rare: [['duller', 0.56], ['whisperer', 0.28]],
  loot: { keys: 8, water: 5, batteries: 7 },
});
