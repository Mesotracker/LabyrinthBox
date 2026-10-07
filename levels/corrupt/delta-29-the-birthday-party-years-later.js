// --------------------------------------------------------------------------
// Δ-29 - The Birthday Party, Years Later  (id: cor29, Corruption)
// Streamers rotted to string, balloons hung deflated from the pipes, and the presents grown over. The floor has holes in it where parts of the party never loaded, and a crevice runs under the tables. Everyone is still here.
//
// Scene: 22 generator settings, 3 entity groups, 1 rare spawns, loot keys 9/water 5/batteries 3, 2 cuts in the floor (block, crevice), file corruption 0.3
//    1. Blow out the candles on the birthday cake  [cake]
//    2. Escape before the party catches you  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor29',
  name: 'Δ-29',
  subtitle: 'The Birthday Party, Years Later',
  place: 'Level Fun =), the cake still lit',
  cls: 'Class 5',
  passive: false,
  seed: 8189,
  description: 'Streamers rotted to string, balloons hung deflated from the pipes, and the presents grown over. The floor has holes in it where parts of the party never loaded, and a crevice runs under the tables. Everyone is still here.',
  intro: 'Blow out the candles, then get out. Do not let the party catch you. The guests have changed. They are still glad you came.',
  spawn: [16, 16],
  fall: true,
  ambience: 'party',
  hum: 0.03,
  ambientLight: [0.0455, 0.038, 0.0405],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x413b3a, density: 0.0336 },
  tuning: { grimeScale: 1.05, wetScale: 0.27 },
  corrupt: 0.3,
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'party_wall',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.92, 0.85],
      fixtureIntensity: 3.4,
      density: [0.15, 0.4],
      roomChance: 0.7,
      deadChance: 0.16,
      flickerChance: 0.1,
      strobeChance: 0.01,
      dyingChance: 0.06,
      darkZones: 0.22,
      featureWeights: { pool: 0, glass: 0.3, collapse: 0.76, exit: 0.6, blackout: 0.3, leak: 1.2 },
      props: 'party',
      missingTileChance: 0.06,
      overgrown: 0.7,
      cracked: 0.8,
      damp: 0.55,
      cuts: [
        { kind: 'block', x: -16, z: -12, w: 10, h: 12, shards: 0.12 },
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 60,
          offset: 18,
          runs: 2,
          spacing: 22,
          width: 1,
          wobble: 9,
        },
      ],
    },
  },
  stages: [
    {
      text: 'Blow out the candles on the birthday cake',
      goal: 'cake',
      dist: [40, 55],
      effects: [['rage'], ['message', 'The party has noticed you. RUN.']],
    },
    {
      text: 'Escape before the party catches you',
      goal: 'door_exit',
      dist: [45, 60],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [['partygoer', 5, null], ['mut_chorus', 1], ['mut_splice', 1]],
  rare: [['whisperer', 0.21]],
  loot: { keys: 9, water: 5, batteries: 3 },
});
