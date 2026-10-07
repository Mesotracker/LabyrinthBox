// --------------------------------------------------------------------------
// Level ∞ - The Final Exit  (id: level23, Base campaign)
// Back where it started, but worse. Everything you have run from is waiting here.
//
// Scene: 16 generator settings, 5 entity groups, 8 rare spawns, loot keys 12/water 7/batteries 4
//    1. Flip the breakers  [breaker x3]
//    2. Pull the main power switch  [breaker_main]
//    3. Reach THE EXIT  [door_final (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level23',
  name: 'Level ∞',
  subtitle: 'The Final Exit',
  cls: 'Class ∞',
  seed: 3324,
  description: 'Back where it started, but worse. Everything you have run from is waiting here.',
  intro: 'Flip the breakers, pull the main switch, and run for THE EXIT.',
  spawn: [16, 16],
  wet: true,
  ambientLight: [0.024, 0.022, 0.016],
  bounce: 0.32,
  lightRange: 17,
  fog: { color: 0x1d170b, density: 0.034 },
  tuning: { grimeScale: 1.4, wetScale: 1.2 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.75,
      wallMat: 'l0_wall',
      floorMat: 'l0_carpet',
      ceilMat: 'l0_ceiling',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.94, 0.78],
      fixtureIntensity: 3.6,
      density: [0.25, 0.65],
      deadChance: 0.1,
      flickerChance: 0.1,
      strobeChance: 0.03,
      dyingChance: 0.04,
      darkZones: 0.35,
      featureWeights: { pool: 0.6, glass: 0.8, collapse: 1, exit: 0.6, blackout: 1.4 },
      props: 'lobby',
    },
  },
  stages: [
    { text: 'Flip the breakers', goal: 'breaker', count: 3, dist: [25, 55] },
    {
      text: 'Pull the main power switch',
      goal: 'breaker_main',
      dist: [35, 55],
      effects: [['powercut', 60, 8], ['spawn', 'chase', 1]],
    },
    {
      text: 'Reach THE EXIT',
      goal: 'door_final',
      dist: [48, 60],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [
    ['skinstealer', 2],
    ['howler', 1],
    ['hound', 2],
    ['wretch', 1],
    ['smiler', 3],
  ],
  rare: [
    ['worm', 0.35],
    ['whisperer', 0.35],
    ['stature', 0.3],
    ['crawler', 0.3],
    ['duller', 0.3],
    ['haze', 0.3],
    ['troglosidae', 0.3],
    ['beast', 0.2],
  ],
  loot: { keys: 12, water: 7, batteries: 4 },
});
