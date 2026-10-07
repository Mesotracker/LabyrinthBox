// --------------------------------------------------------------------------
// Φ-30 - Panophobia  (id: phobia30, The Phobia Wing)
// The Lobby again — but every fear in the Wing has leaked into it. Webs. Dolls. Barking. Something that will not keep one shape.
//
// Scene: 16 generator settings, 3 entity groups, 2 rare spawns, loot keys 12/water 7/batteries 5
//    1. Flip the breakers  [breaker x3]
//    2. Pull the main power switch  [breaker_main]
//    3. Get out  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia30',
  name: 'Φ-30',
  subtitle: 'Panophobia',
  place: 'Everything, Everywhere',
  cls: 'Class 5',
  seed: 6110,
  description: 'The Lobby again — but every fear in the Wing has leaked into it. Webs. Dolls. Barking. Something that will not keep one shape.',
  intro: 'Flip the three breakers, pull the main switch, and get out. Whatever it is now, it will be something else in a moment.',
  spawn: [16, 16],
  wet: true,
  hum: 0.06,
  flashes: [24, 40],
  ambientLight: [0.024, 0.022, 0.016],
  bounce: 0.32,
  lightRange: 17,
  fog: { color: 0x1d170b, density: 0.036 },
  tuning: { grimeScale: 1.4, wetScale: 1.2 },
  phobia: { hazards: ['webs', 'blink'] },
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
      fixtureIntensity: 3.4,
      density: [0.25, 0.65],
      deadChance: 0.12,
      flickerChance: 0.12,
      strobeChance: 0.04,
      dyingChance: 0.05,
      darkZones: 0.4,
      featureWeights: { pool: 0.6, glass: 0.8, collapse: 1, exit: 0.6, blackout: 1.4 },
      props: 'lobby',
    },
  },
  stages: [
    { text: 'Flip the breakers', goal: 'breaker', count: 3, dist: [25, 55] },
    {
      text: 'Pull the main power switch',
      goal: 'breaker_main',
      dist: [35, 50],
      effects: [['powercut', 60, 4], ['spawn', 'formless', 1]],
    },
    {
      text: 'Get out',
      goal: 'door_exit',
      dist: [45, 60],
      from: 'prev',
      final: true,
      revert: true,
    },
  ],
  entities: [['formless', 2], ['porcelain', 2], ['goodboy', 2]],
  rare: [['weaver', 0.5], ['jester', 0.4]],
  loot: { keys: 12, water: 7, batteries: 5 },
});
