// --------------------------------------------------------------------------
// Level 120 - Frozen Halls  (id: level22, Base campaign)
// Frost on the walls, snow drifting across the floor, breath fogging in the cold.
//
// Scene: 17 generator settings, 3 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 4
//    1. Restart the heaters  [generator x2]
//    2. Find the way down  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level22',
  name: 'Level 120',
  subtitle: 'Frozen Halls',
  cls: 'Class 3',
  seed: 3223,
  description: 'Frost on the walls, snow drifting across the floor, breath fogging in the cold.',
  intro: 'Restart the two heaters, then find the way down.',
  spawn: [16, 16],
  hum: 0.04,
  ambientLight: [0.03, 0.036, 0.046],
  bounce: 0.4,
  lightRange: 18,
  fog: { color: 0x8a96a6, density: 0.034 },
  tuning: { grimeScale: 0.4, wetScale: 0.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'ice_wall',
      floorMat: 'snow',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.82, 0.9, 1],
      fixtureIntensity: 3.2,
      density: [0.2, 0.5],
      roomChance: 0.4,
      deadChance: 0.1,
      flickerChance: 0.08,
      strobeChance: 0.02,
      dyingChance: 0.04,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.6, collapse: 0.8, exit: 0.6, blackout: 0.8 },
      props: 'industrial',
    },
  },
  stages: [
    { text: 'Restart the heaters', goal: 'generator', count: 2, dist: [30, 55] },
    { text: 'Find the way down', goal: 'hatch', dist: [50, 70], final: true },
  ],
  entities: [['hound', 3], ['howler', 1], ['wretch', 1]],
  rare: [['stature', 0.35], ['haze', 0.35]],
  loot: { keys: 10, water: 5, batteries: 4 },
});
