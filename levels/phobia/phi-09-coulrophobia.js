// --------------------------------------------------------------------------
// Φ-09 - Coulrophobia  (id: phobia09, The Phobia Wing)
// Striped canvas walls, sawdust, the smell of popcorn left too long. Somewhere ahead, someone is giggling.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Collect the ringmaster's tickets  [artifact x3]
//    2. Leave through the performers' exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia09',
  name: 'Φ-09',
  subtitle: 'Coulrophobia',
  place: 'The Big Top',
  cls: 'Class 5',
  seed: 5333,
  description: 'Striped canvas walls, sawdust, the smell of popcorn left too long. Somewhere ahead, someone is giggling.',
  intro: 'Collect the three ringmaster\'s tickets, then leave through the performers\' exit. If you hear giggling ahead — go another way.',
  spawn: [16, 16],
  ambience: 'party',
  ambientLight: [0.03, 0.022, 0.02],
  bounce: 0.34,
  lightRange: 17,
  fog: { color: 0x22140e, density: 0.032 },
  tuning: { grimeScale: 0.9, wetScale: 0.2 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'party_wall',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'metal_red',
      fixtureColor: [1, 0.82, 0.6],
      fixtureIntensity: 3,
      density: [0.2, 0.5],
      roomChance: 0.6,
      doorwayChance: 0.2,
      deadChance: 0.08,
      flickerChance: 0.1,
      strobeChance: 0.03,
      darkZones: 0.25,
      featureWeights: { pool: 0, glass: 0.2, collapse: 0.3, exit: 0.6, blackout: 0.6 },
      props: 'party',
    },
  },
  stages: [
    {
      text: 'Collect the ringmaster\'s tickets',
      goal: 'artifact',
      count: 3,
      dist: [25, 55],
    },
    {
      text: 'Leave through the performers\' exit',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['jester', 2]],
  rare: [['partygoer', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
