// --------------------------------------------------------------------------
// Φ-16 - Claustrophobia  (id: phobia16, The Phobia Wing)
// Service corridors barely wider than your shoulders, ceilings you could touch, pipes on every side. No windows. No air.
//
// Scene: 18 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 4
//    1. Shut the gas valves  [valve x3]
//    2. Crawl out through the hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia16',
  name: 'Φ-16',
  subtitle: 'Claustrophobia',
  place: 'The Crawlspace',
  cls: 'Class 4',
  seed: 5592,
  description: 'Service corridors barely wider than your shoulders, ceilings you could touch, pipes on every side. No windows. No air.',
  intro: 'Shut the three gas valves, then crawl out through the hatch. Rest in the wide rooms when your PRESSURE climbs.',
  spawn: [16, 16],
  hum: 0.07,
  ambientLight: [0.016, 0.014, 0.012],
  bounce: 0.28,
  lightRange: 12,
  fog: { color: 0x0e0c0a, density: 0.05 },
  tuning: { grimeScale: 1.6, wetScale: 0.8 },
  phobia: { meters: ['pressure'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.15,
      wallMat: 'concrete_block',
      floorMat: 'concrete_floor',
      ceilMat: 'concrete_dark',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_rust',
      fixtureColor: [0.9, 0.95, 1],
      fixtureIntensity: 2.2,
      density: [0.6, 0.9],
      roomChance: 0.06,
      pillarChance: 0.5,
      doorwayChance: 0.05,
      fixtureEvery: 2,
      deadChance: 0.15,
      flickerChance: 0.12,
      darkZones: 0.3,
      featureWeights: { pool: 0.2, glass: 0, collapse: 1, exit: 0.6, blackout: 1 },
      props: 'sewer',
    },
  },
  stages: [
    { text: 'Shut the gas valves', goal: 'valve', count: 3, dist: [20, 48] },
    {
      text: 'Crawl out through the hatch',
      goal: 'hatch',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['squeeze', 3]],
  rare: [['crawler', 0.3]],
  loot: { keys: 10, water: 5, batteries: 4 },
});
