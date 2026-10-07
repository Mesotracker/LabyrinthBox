// --------------------------------------------------------------------------
// Φ-25 - Atychiphobia  (id: phobia25, The Phobia Wing)
// Rows of desks, a clock above the blackboard, an exam you never revised for. Every wrong answer is heard.
//
// Scene: 15 generator settings, 1 entity groups, 0 rare spawns, loot keys 11/water 5/batteries 3
//    1. Shut the radiator valves in order  [valve x3]
//    2. Enter the exam-room code  [keypad]
//    3. Hand in your paper at the exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia25',
  name: 'Φ-25',
  subtitle: 'Atychiphobia',
  place: 'The Examination Hall',
  cls: 'Class 3',
  seed: 5925,
  description: 'Rows of desks, a clock above the blackboard, an exam you never revised for. Every wrong answer is heard.',
  intro: 'Shut the valves in the right order, then enter the code. The Examiner hears every mistake — and gets faster with each one.',
  spawn: [16, 16],
  puzzle: true,
  ambientLight: [0.024, 0.024, 0.026],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x17181a, density: 0.034 },
  tuning: { grimeScale: 1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'drywall_blue',
      floorMat: 'vct_school',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.95, 0.97, 1],
      fixtureIntensity: 3.4,
      density: [0.3, 0.6],
      roomChance: 0.65,
      deadChance: 0.06,
      flickerChance: 0.05,
      darkZones: 0.2,
      featureWeights: { pool: 0, glass: 0.6, collapse: 0.4, exit: 0.8, blackout: 0.6 },
      props: 'school',
    },
  },
  stages: [
    {
      text: 'Shut the radiator valves in order',
      hint: 'Read the caretaker\'s note',
      goal: 'valve',
      count: 3,
      order: ['red', 'blue', 'yellow'],
      dist: [22, 48],
      clueDist: [6, 16],
      clueTitle: 'Caretaker\'s note',
    },
    {
      text: 'Enter the exam-room code',
      hint: 'Four answers are written on scraps',
      goal: 'keypad',
      code: true,
      dist: [25, 40],
      clueDist: [8, 34],
      clueTitle: 'A crib sheet',
    },
    {
      text: 'Hand in your paper at the exit',
      goal: 'door_exit',
      dist: [35, 55],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['examiner', 2]],
  rare: [],
  loot: { keys: 11, water: 5, batteries: 3 },
});
