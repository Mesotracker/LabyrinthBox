// --------------------------------------------------------------------------
// Ω-15 - The Cake Hall  (id: pg15, Playground)
// Frosting-pink walls, sponge-cake floors and a candle on every table. It all smells wrong in a very sweet way.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Blow out the cakes  [cake x3]
//    2. Take the service stairwell up  [stairshaft - 5 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg15',
  name: 'Ω-15',
  subtitle: 'The Cake Hall',
  place: 'Happy birthday',
  cls: 'Class 4',
  seed: 9705,
  description: 'Frosting-pink walls, sponge-cake floors and a candle on every table. It all smells wrong in a very sweet way.',
  intro: 'Blow out the three birthday cakes and take the service stairwell up. The guests will notice.',
  spawn: [16, 16],
  hum: 0.01,
  ambientLight: [0.1, 0.09, 0.1],
  bounce: 0.4,
  lightRange: 20,
  fog: { color: 0xf2dce8, density: 0.016 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'party_wall',
      floorMat: 'cake_sponge',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 0.8],
      fixtureIntensity: 3.8,
      density: [0.14, 0.4],
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
    },
  },
  stages: [
    { text: 'Blow out the cakes', goal: 'cake', count: 3, dist: [22, 48] },
    {
      text: 'Take the service stairwell up',
      goal: 'stairshaft',
      flights: 5,
      rise: 2.8,
      dist: [40, 58],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['partygoer', 4], ['pg_ringmaster', 1]],
  rare: [['smiler', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
