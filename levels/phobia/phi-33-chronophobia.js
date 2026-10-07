// --------------------------------------------------------------------------
// Φ-33 - Chronophobia  (id: phobia33, The Phobia Wing)
// Wood panelling and a thousand clocks, all ticking slightly out of step. They are counting down to something.
//
// Scene: 16 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 3
//    1. Wind the clock weights  [generator x3]
//    2. Take the lift before time runs out  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia33',
  name: 'Φ-33',
  subtitle: 'Chronophobia',
  place: 'The Clockmaker\'s House',
  cls: 'Class 5',
  seed: 6221,
  description: 'Wood panelling and a thousand clocks, all ticking slightly out of step. They are counting down to something.',
  intro: 'Wind the three clock weights and take the lift before your time runs out. Every hour, it gets closer.',
  spawn: [16, 16],
  hum: 0.03,
  ambientLight: [0.022, 0.016, 0.01],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x1a120a, density: 0.038 },
  tuning: { grimeScale: 1.1, wetScale: 0.3 },
  phobia: { clock: 420 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'damask_hotel',
      floorMat: 'wood_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'brass',
      fixtureColor: [1, 0.8, 0.55],
      fixtureIntensity: 2.8,
      density: [0.3, 0.6],
      roomChance: 0.7,
      doorwayChance: 0.2,
      deadChance: 0.08,
      flickerChance: 0.08,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.4, collapse: 0.4, exit: 0.6, blackout: 0.8 },
      props: 'clockwork',
    },
  },
  stages: [
    {
      text: 'Wind the clock weights',
      goal: 'generator',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Take the lift before time runs out',
      goal: 'elevator',
      dist: [45, 60],
      final: true,
    },
  ],
  entities: [['hourman', 1]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 3 },
});
