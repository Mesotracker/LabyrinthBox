// --------------------------------------------------------------------------
// Φ-12 - Thalassophobia  (id: phobia12, The Phobia Wing)
// Black water up to your waist in tiled halls that go on forever. Things move under it. Sometimes there is a light.
//
// Scene: 18 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 7
//    1. Open the drain valves  [valve x3]
//    2. Climb the stairs out of the water  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia12',
  name: 'Φ-12',
  subtitle: 'Thalassophobia',
  place: 'The Flooded Deep',
  cls: 'Class 4',
  seed: 5444,
  description: 'Black water up to your waist in tiled halls that go on forever. Things move under it. Sometimes there is a light.',
  intro: 'Open the three drain valves, then take the stairs up. Never walk toward a light in the water.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  ambience: 'water',
  hum: 0.02,
  ambientLight: [0.008, 0.012, 0.016],
  bounce: 0.34,
  lightRange: 15,
  fog: { color: 0x05090c, density: 0.05 },
  tuning: { grimeScale: 0.9, wetScale: 1.8 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.6,
      wallMat: 'wall_tile',
      floorMat: 'pool_tile_blue',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_rust',
      fixtureColor: [0.7, 0.9, 1],
      fixtureIntensity: 2.4,
      density: [0.1, 0.3],
      roomChance: 0.25,
      pillarChance: 0.6,
      deadChance: 0.4,
      flickerChance: 0.1,
      darkZones: 0.55,
      featureWeights: { pool: 2, glass: 0, collapse: 0.3, exit: 0.3, blackout: 1.4 },
      props: 'pool',
      flood: 0.62,
      waterMat: 'water',
    },
  },
  stages: [
    { text: 'Open the drain valves', goal: 'valve', count: 3, dist: [22, 52] },
    {
      text: 'Climb the stairs out of the water',
      goal: 'door_stairs',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['lure', 3]],
  rare: [['haze', 0.2]],
  loot: { keys: 10, water: 5, batteries: 7 },
});
