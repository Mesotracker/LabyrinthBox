// --------------------------------------------------------------------------
// Φ-29 - Algophobia  (id: phobia29, The Phobia Wing)
// Tiled killing floors, hooks, drains in the floor. Every surface here wants to cut you, and every cut keeps hurting.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 8/batteries 3
//    1. Throw the line breakers  [breaker x3]
//    2. Raise the loading shutter  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia29',
  name: 'Φ-29',
  subtitle: 'Algophobia',
  place: 'The Abattoir',
  cls: 'Class 4',
  seed: 6073,
  description: 'Tiled killing floors, hooks, drains in the floor. Every surface here wants to cut you, and every cut keeps hurting.',
  intro: 'Throw the three line breakers, then raise the loading shutter. Pain lingers here — drink to make it stop.',
  spawn: [16, 16],
  hum: 0.08,
  ambientLight: [0.024, 0.012, 0.01],
  bounce: 0.28,
  lightRange: 16,
  fog: { color: 0x1a0806, density: 0.04 },
  tuning: { grimeScale: 1.8, wetScale: 1.4 },
  phobia: { hazards: ['pain'] },
  gen: {
    type: 'lobby',
    params: {
      height: 3.4,
      wallMat: 'wall_tile',
      floorMat: 'concrete_floor',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_red',
      frameMat: 'metal_rust',
      fixtureColor: [1, 0.5, 0.4],
      fixtureIntensity: 2.8,
      density: [0.2, 0.5],
      roomChance: 0.35,
      pillarChance: 0.5,
      deadChance: 0.12,
      flickerChance: 0.12,
      strobeChance: 0.03,
      darkZones: 0.35,
      featureWeights: { pool: 0.5, glass: 0, collapse: 1, exit: 0.7, blackout: 1.2 },
      props: 'abattoir',
    },
  },
  stages: [
    {
      text: 'Throw the line breakers',
      goal: 'breaker',
      count: 3,
      dist: [22, 52],
    },
    {
      text: 'Raise the loading shutter',
      goal: 'door_shutter',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['thorn', 3]],
  rare: [['skinstealer', 0.3]],
  loot: { keys: 10, water: 8, batteries: 3 },
});
