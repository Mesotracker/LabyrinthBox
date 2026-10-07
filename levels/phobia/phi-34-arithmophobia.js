// --------------------------------------------------------------------------
// Φ-34 - Arithmophobia  (id: phobia34, The Phobia Wing)
// Cubicles, ledgers, adding machines with the paper still spooling. Numbers everywhere. One of them is counting down.
//
// Scene: 15 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the four digits and open the vault  [keypad]
//    2. Take the stairwell  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia34',
  name: 'Φ-34',
  subtitle: 'Arithmophobia',
  place: 'Accounts Receivable',
  cls: 'Class 4',
  seed: 6258,
  description: 'Cubicles, ledgers, adding machines with the paper still spooling. Numbers everywhere. One of them is counting down.',
  intro: 'Find the four digits and open the vault, then take the stairs. Every time you look at the Counter, the number drops.',
  spawn: [16, 16],
  puzzle: true,
  ambientLight: [0.026, 0.027, 0.03],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x1b1d21, density: 0.032 },
  tuning: { grimeScale: 0.9, wetScale: 0.3 },
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
      deadChance: 0.06,
      flickerChance: 0.06,
      darkZones: 0.25,
      featureWeights: { pool: 0, glass: 3, collapse: 0.4, exit: 0.6, blackout: 0.6 },
      props: 'office',
    },
  },
  stages: [
    {
      text: 'Find the four digits and open the vault',
      hint: 'The ledgers are scattered around',
      goal: 'keypad',
      code: true,
      dist: [30, 45],
      clueDist: [10, 40],
      clueTitle: 'A ledger page',
    },
    {
      text: 'Take the stairwell',
      goal: 'door_stairs',
      dist: [35, 55],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['counter', 1]],
  rare: [['faceling', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
