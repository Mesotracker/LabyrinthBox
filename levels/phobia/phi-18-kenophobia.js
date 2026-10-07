// --------------------------------------------------------------------------
// Φ-18 - Kenophobia  (id: phobia18, The Phobia Wing)
// Vast black rooms with almost nothing in them. Your footsteps do not echo. Your light does not reach the walls.
//
// Scene: 18 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 5
//    1. Stabilise the anchors  [anchor x3]
//    2. Find the door out of nothing  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia18',
  name: 'Φ-18',
  subtitle: 'Kenophobia',
  place: 'The Empty Rooms',
  cls: 'Class 4',
  seed: 5666,
  description: 'Vast black rooms with almost nothing in them. Your footsteps do not echo. Your light does not reach the walls.',
  intro: 'Stabilise three anchors before the emptiness swallows them, then find the door. If everything goes quiet, move.',
  spawn: [16, 16],
  hum: 0,
  ambientLight: [0.006, 0.006, 0.008],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0x030305, density: 0.03 },
  tuning: { grimeScale: 0.4, wetScale: 0.2 },
  phobia: { hazards: ['void'] },
  gen: {
    type: 'lobby',
    params: {
      height: 4.4,
      wallMat: 'void_wall',
      floorMat: 'concrete_dark',
      ceilMat: 'void_black',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_dark',
      fixtureColor: [0.8, 0.82, 1],
      fixtureIntensity: 3.2,
      density: [0.04, 0.14],
      roomChance: 0.05,
      pillarChance: 0.08,
      fixtureEvery: 3,
      fixtureChance: 0.6,
      deadChance: 0.3,
      flickerChance: 0.06,
      darkZones: 0.5,
      featureWeights: { pool: 0, glass: 0, collapse: 0.3, exit: 0.3, blackout: 1.6 },
      props: 'void',
    },
  },
  stages: [
    { text: 'Stabilise the anchors', goal: 'anchor', count: 3, dist: [25, 55] },
    {
      text: 'Find the door out of nothing',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['absence', 1]],
  rare: [['peripheral', 0.5]],
  loot: { keys: 10, water: 5, batteries: 5 },
});
