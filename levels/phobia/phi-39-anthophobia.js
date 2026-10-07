// --------------------------------------------------------------------------
// Φ-39 - Anthophobia  (id: phobia39, The Phobia Wing)
// Greenhouses joined into a maze, warm and humid, the air yellow with pollen. Some of the flowers are taller than you.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 6/batteries 3
//    1. Turn on the sprinklers  [valve x3]
//    2. Find the potting-shed door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia39',
  name: 'Φ-39',
  subtitle: 'Anthophobia',
  place: 'The Hothouse',
  cls: 'Class 4',
  seed: 6443,
  description: 'Greenhouses joined into a maze, warm and humid, the air yellow with pollen. Some of the flowers are taller than you.',
  intro: 'Turn the three sprinkler valves to wash the pollen down, then find the door. Watched, it is just a flower.',
  spawn: [16, 16],
  wet: true,
  hum: 0.04,
  ambientLight: [0.04, 0.05, 0.03],
  bounce: 0.35,
  lightRange: 18,
  fog: { color: 0x3a3a20, density: 0.034 },
  tuning: { grimeScale: 0.8, wetScale: 1.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.6,
      wallMat: 'drywall_green',
      floorMat: 'dirt',
      ceilMat: 'glass_dirty',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_green',
      fixtureColor: [1, 0.96, 0.8],
      fixtureIntensity: 3.6,
      density: [0.2, 0.45],
      roomChance: 0.5,
      doorwayChance: 0.2,
      pillarChance: 0.3,
      deadChance: 0.06,
      flickerChance: 0.04,
      darkZones: 0.15,
      featureWeights: { pool: 1, glass: 2, collapse: 0.3, exit: 0.6, blackout: 0.4 },
      props: 'greenhouse',
    },
  },
  stages: [
    { text: 'Turn on the sprinklers', goal: 'valve', count: 3, dist: [22, 50] },
    {
      text: 'Find the potting-shed door',
      goal: 'door_exit',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['bloom', 4]],
  rare: [['deathmoth', 0.3]],
  loot: { keys: 10, water: 6, batteries: 3 },
});
