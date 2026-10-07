// --------------------------------------------------------------------------
// Level 3 - Electrical Station  (id: level3, Base campaign)
// Dark concrete, sodium lamps and a main breaker that should never be pulled.
//
// Scene: 22 generator settings, 5 entity groups, 1 rare spawns, loot keys 9/water 5/batteries 4
//    1. Find the four digits and enter the code  [keypad]
//    2. Cut the main power  [breaker_main]
//    3. Reach the freight lift before the lights go out  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level3',
  name: 'Level 3',
  subtitle: 'Electrical Station',
  cls: 'Class 4',
  seed: 1304,
  description: 'Dark concrete, sodium lamps and a main breaker that should never be pulled.',
  intro: 'The lift is locked behind a keypad. Four workers each left one digit of the code. Then cut the power and run.',
  spawn: [16, 16],
  puzzle: true,
  hum: 0.09,
  ambientLight: [0.012, 0.011, 0.009],
  bounce: 0.22,
  lightRange: 15,
  fog: { color: 0x0d0a07, density: 0.052 },
  tuning: { grimeScale: 1.5, wetScale: 1.1 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'concrete_dark',
      floorMat: 'concrete_floor',
      ceilMat: 'void_black',
      fixtureMat: 'fixture_sodium',
      frameMat: 'metal_dark',
      fixtureColor: [1, 0.66, 0.34],
      fixtureIntensity: 3.4,
      density: [0.24, 0.58],
      roomChance: 0.3,
      pillarChance: 0.45,
      doorwayChance: 0.09,
      fixtureEvery: 3,
      fixtureChance: 0.82,
      deadChance: 0.16,
      flickerChance: 0.14,
      strobeChance: 0.05,
      dyingChance: 0.06,
      darkZones: 0.42,
      missingTileChance: 0.03,
      featureWeights: { pool: 0.4, glass: 0.4, collapse: 1.1, exit: 1, blackout: 1.3 },
      props: 'industrial',
    },
  },
  stages: [
    {
      text: 'Find the four digits and enter the code',
      hint: 'Notes are scattered around',
      goal: 'keypad',
      code: true,
      dist: [30, 45],
      clueDist: [10, 40],
      clueTitle: 'A scrap of paper',
    },
    {
      text: 'Cut the main power',
      goal: 'breaker_main',
      dist: [25, 40],
      from: 'prev',
      effects: [['powercut', 55, 6]],
    },
    {
      text: 'Reach the freight lift before the lights go out',
      goal: 'elevator',
      dist: [36, 46],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [
    ['hound', 1],
    ['faceling', 1],
    ['skinstealer', 1],
    ['smiler', 2],
    ['deathmoth', 1],
  ],
  rare: [['duller', 0.35]],
  loot: { keys: 9, water: 5, batteries: 4 },
});
