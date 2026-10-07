// --------------------------------------------------------------------------
// Level 0 - The Lobby  (id: level0, Base campaign)
// Mono-yellow rooms, damp carpet and the hum of fluorescent tubes.
//
// Scene: 16 generator settings, 0 entity groups, 0 rare spawns, loot keys 7/water 4/batteries 2
//    1. Find the exit door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level0',
  name: 'Level 0',
  subtitle: 'The Lobby',
  cls: 'Class 1',
  passive: true,
  seed: 1001,
  description: 'Mono-yellow rooms, damp carpet and the hum of fluorescent tubes.',
  intro: 'Nothing lives here. Only the hum, and the feeling of being watched. Find a way out.',
  spawn: [16, 16],
  wet: true,
  ambientLight: [0.03, 0.028, 0.02],
  bounce: 0.34,
  lightRange: 17,
  fog: { color: 0x241d0f, density: 0.03 },
  tuning: { grimeScale: 1, wetScale: 1 },
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
      density: [0.22, 0.62],
      deadChance: 0.05,
      flickerChance: 0.05,
      strobeChance: 0.012,
      dyingChance: 0.015,
      darkZones: 0.3,
      featureWeights: { pool: 0.5, glass: 0.8, collapse: 0.7, exit: 0.9, blackout: 1.4 },
      props: 'lobby',
    },
  },
  stages: [
    {
      text: 'Find the exit door',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [],
  rare: [],
  loot: { keys: 7, water: 4, batteries: 2 },
});
