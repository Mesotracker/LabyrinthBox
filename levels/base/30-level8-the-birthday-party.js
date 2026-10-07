// --------------------------------------------------------------------------
// Level Fun =) - The Birthday Party  (id: level8, Base campaign)
// Balloons, cake and streamers. The Partygoers would love for you to stay.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 9/water 5/batteries 2
//    1. Blow out the candles on the birthday cake  [cake]
//    2. Escape before the party catches you  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level8',
  name: 'Level Fun =)',
  subtitle: 'The Birthday Party',
  cls: 'Class 5',
  seed: 1809,
  description: 'Balloons, cake and streamers. The Partygoers would love for you to stay.',
  intro: 'Blow out the candles, then get out. Do not let the party catch you.',
  spawn: [16, 16],
  ambience: 'party',
  hum: 0.03,
  ambientLight: [0.03, 0.024, 0.026],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x22141a, density: 0.03 },
  tuning: { grimeScale: 0.7, wetScale: 0.2 },
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
      deadChance: 0.04,
      flickerChance: 0.04,
      strobeChance: 0.01,
      dyingChance: 0.01,
      darkZones: 0.1,
      featureWeights: { pool: 0, glass: 0.3, collapse: 0.2, exit: 0.6, blackout: 0.3 },
      props: 'party',
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
  entities: [['partygoer', 5]],
  rare: [['whisperer', 0.15]],
  loot: { keys: 9, water: 5, batteries: 2 },
});
