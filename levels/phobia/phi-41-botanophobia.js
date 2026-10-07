// --------------------------------------------------------------------------
// Φ-41 - Botanophobia  (id: phobia41, The Phobia Wing)
// An office building that the plants took back: vines through the ceiling tiles, roots splitting the floor, moss on everything.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Restart the backup generators  [generator x2]
//    2. Climb out through the roof hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia41',
  name: 'Φ-41',
  subtitle: 'Botanophobia',
  place: 'The Overgrowth',
  cls: 'Class 3',
  seed: 6517,
  description: 'An office building that the plants took back: vines through the ceiling tiles, roots splitting the floor, moss on everything.',
  intro: 'Restart two backup generators and climb out through the roof hatch. When the floor rustles, get off that spot.',
  spawn: [16, 16],
  wet: true,
  hum: 0.03,
  ambientLight: [0.022, 0.03, 0.018],
  bounce: 0.32,
  lightRange: 16,
  fog: { color: 0x0e160a, density: 0.04 },
  tuning: { grimeScale: 1.6, wetScale: 1.2 },
  phobia: { hazards: ['vines'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.9,
      wallMat: 'concrete_painted',
      floorMat: 'lawn',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_green',
      fixtureColor: [0.9, 1, 0.8],
      fixtureIntensity: 2.8,
      density: [0.2, 0.5],
      roomChance: 0.4,
      pillarChance: 0.3,
      deadChance: 0.2,
      flickerChance: 0.1,
      darkZones: 0.35,
      missingTileChance: 0.08,
      featureWeights: { pool: 1.2, glass: 0.8, collapse: 1.4, exit: 0.6, blackout: 1 },
      props: 'greenhouse',
    },
  },
  stages: [
    {
      text: 'Restart the backup generators',
      goal: 'generator',
      count: 2,
      dist: [25, 55],
    },
    {
      text: 'Climb out through the roof hatch',
      goal: 'hatch',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['overgrowth', 3]],
  rare: [['worm', 0.2]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
