// --------------------------------------------------------------------------
// Ω-30 - The Park Exit  (id: pg30, Playground)
// The last midway: lights, music, every ride you have been on running all at once. The exit is at the end of the main street.
//
// Scene: 20 generator settings, 5 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Throw the main street breakers  [breaker x3]
//    2. Reach THE EXIT  [door_final (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg30',
  name: 'Ω-30',
  subtitle: 'The Park Exit',
  place: 'Please come again',
  cls: 'Class 5',
  seed: 10410,
  description: 'The last midway: lights, music, every ride you have been on running all at once. The exit is at the end of the main street.',
  intro: 'Everything that lives in the park is on the main street. Reach THE EXIT. The gift shop does not count.',
  spawn: [16, 16],
  hum: 0.02,
  ambientLight: [0.1, 0.09, 0.1],
  bounce: 0.4,
  lightRange: 20,
  fog: { color: 0xf2dce8, density: 0.016 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.6,
      wallMat: 'party_wall',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.88, 0.9],
      fixtureIntensity: 3.8,
      density: [0.12, 0.34],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.03,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'party',
      pillarChance: 0.5,
    },
  },
  stages: [
    {
      text: 'Throw the main street breakers',
      goal: 'breaker',
      count: 3,
      dist: [22, 50],
      effects: [['powercut', 50, 6], ['spawn', 'pg_ringmaster', 1]],
    },
    {
      text: 'Reach THE EXIT',
      goal: 'door_final',
      dist: [46, 62],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [
    ['partygoer', 3],
    ['pg_lifeguard', 1],
    ['pg_attendant', 2],
    ['pg_bouncer', 1],
    ['pg_mascot', 1],
  ],
  rare: [['pg_ringmaster', 0.5]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
