// --------------------------------------------------------------------------
// Ω-02 - The Balloon Foyer  (id: pg02, Playground)
// Rooms full of helium balloons on ribbons that run the length of the halls. Some of them are looking at you.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Reset the party breakers  [breaker x3]
//    2. Take the stairwell to the midway  [stairshaft - 6 flights, rise 2.8 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg02',
  name: 'Ω-02',
  subtitle: 'The Balloon Foyer',
  place: 'Mind the strings',
  cls: 'Class 2',
  seed: 9094,
  description: 'Rooms full of helium balloons on ribbons that run the length of the halls. Some of them are looking at you.',
  intro: 'Three party breakers have tripped. Flip them back, then take the stairwell up to the midway. Balloons will not hurt you. The people holding them might.',
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
      wallMat: 'drywall_peach',
      floorMat: 'carpet_hotel_blue',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.82, 0.8],
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
      props: 'nursery',
    },
  },
  stages: [
    {
      text: 'Reset the party breakers',
      goal: 'breaker',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Take the stairwell to the midway',
      goal: 'stairshaft',
      flights: 6,
      rise: 2.8,
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['partygoer', 3], ['faceling', 2]],
  rare: [['pg_ringmaster', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
