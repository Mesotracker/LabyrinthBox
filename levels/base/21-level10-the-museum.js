// --------------------------------------------------------------------------
// Level 30.5 - The Museum  (id: level10, Base campaign)
// Silent galleries of art nobody painted. The mannequins only move when you look away.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 9/water 5/batteries 2
//    1. Recover the artifacts  [artifact x3]
//    2. Leave through the gallery exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level10',
  name: 'Level 30.5',
  subtitle: 'The Museum',
  cls: 'Class 3',
  seed: 2011,
  description: 'Silent galleries of art nobody painted. The mannequins only move when you look away.',
  intro: 'Recover three artifacts, then leave. Keep your eyes on the mannequins.',
  spawn: [16, 16],
  ambientLight: [0.028, 0.024, 0.02],
  bounce: 0.34,
  lightRange: 18,
  fog: { color: 0x1d1712, density: 0.03 },
  tuning: { grimeScale: 0.6, wetScale: 0.2 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.4,
      wallMat: 'gallery_red',
      floorMat: 'wood_floor',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.9, 0.76],
      fixtureIntensity: 3.6,
      density: [0.2, 0.45],
      roomChance: 0.9,
      doorwayChance: 0.25,
      pillarChance: 0.1,
      deadChance: 0.06,
      flickerChance: 0.04,
      strobeChance: 0.01,
      dyingChance: 0.02,
      darkZones: 0.2,
      featureWeights: { pool: 0, glass: 1.5, collapse: 0.2, exit: 0.6, blackout: 0.5 },
      props: 'museum',
    },
  },
  stages: [
    {
      text: 'Recover the artifacts',
      goal: 'artifact',
      count: 3,
      dist: [25, 60],
    },
    {
      text: 'Leave through the gallery exit',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['mannequin', 7], ['smiler', 1]],
  rare: [['stature', 0.35]],
  loot: { keys: 9, water: 5, batteries: 2 },
});
