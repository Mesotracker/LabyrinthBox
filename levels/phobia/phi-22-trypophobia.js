// --------------------------------------------------------------------------
// Φ-22 - Trypophobia  (id: phobia22, The Phobia Wing)
// Boiler rooms gone soft and porous: walls pocked with clusters of little holes, and a dry buzzing in all of them.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 7/batteries 3
//    1. Shut the steam valves  [valve x3]
//    2. Climb out through the boiler hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia22',
  name: 'Φ-22',
  subtitle: 'Trypophobia',
  place: 'The Comb',
  cls: 'Class 3',
  seed: 5814,
  description: 'Boiler rooms gone soft and porous: walls pocked with clusters of little holes, and a dry buzzing in all of them.',
  intro: 'Shut the three steam valves, then climb out. Keep your distance from the swarm.',
  spawn: [16, 16],
  hum: 0.07,
  ambientLight: [0.022, 0.016, 0.012],
  bounce: 0.28,
  lightRange: 15,
  fog: { color: 0x1a1008, density: 0.042 },
  tuning: { grimeScale: 1.8, wetScale: 1.2 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'plaster_old',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_sodium',
      frameMat: 'metal_rust',
      fixtureColor: [1, 0.7, 0.4],
      fixtureIntensity: 2.8,
      density: [0.25, 0.6],
      roomChance: 0.35,
      pillarChance: 0.4,
      deadChance: 0.12,
      flickerChance: 0.1,
      darkZones: 0.35,
      missingTileChance: 0.04,
      featureWeights: { pool: 0.4, glass: 0, collapse: 1.4, exit: 0.6, blackout: 1 },
      props: 'hive',
    },
  },
  stages: [
    { text: 'Shut the steam valves', goal: 'valve', count: 3, dist: [22, 52] },
    {
      text: 'Climb out through the boiler hatch',
      goal: 'hatch',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['hive', 3]],
  rare: [['deathmoth', 0.3]],
  loot: { keys: 10, water: 7, batteries: 3 },
});
