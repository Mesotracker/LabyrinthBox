// --------------------------------------------------------------------------
// Ω-01 - The Welcome Gate  (id: pg01, Playground)
// A pink and gold entrance hall with a turnstile that does not turn. Everything is cheerful. The music box is the only thing speaking.
//
// Scene: 19 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the ride tickets  [find ticket x2]
//    2. Switch the gate breakers on  [breaker x2]
//    3. Go through the park gate  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg01',
  name: 'Ω-01',
  subtitle: 'The Welcome Gate',
  place: 'Please keep your hands inside the park',
  cls: 'Class 2',
  seed: 9047,
  description: 'A pink and gold entrance hall with a turnstile that does not turn. Everything is cheerful. The music box is the only thing speaking.',
  intro: 'Find two ride tickets and swipe the gate controls, then walk out onto the midway.',
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
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.86, 0.95],
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
    {
      text: 'Find the ride tickets',
      hint: 'Search drawers and boxes',
      item: 'ticket',
      count: 2,
      dist: [22, 50],
    },
    {
      text: 'Switch the gate breakers on',
      goal: 'breaker',
      count: 2,
      dist: [22, 46],
    },
    {
      text: 'Go through the park gate',
      goal: 'door_exit',
      dist: [40, 60],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['partygoer', 2]],
  rare: [['pg_attendant', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
