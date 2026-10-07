// --------------------------------------------------------------------------
// Φ-02 - Ophidiophobia  (id: phobia02, The Phobia Wing)
// Steamy tiled enclosures, heat lamps, glass tanks with the lids off. The vivarium was never meant to be this big.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Turn off the heat lamps  [breaker x3]
//    2. Climb out through the service hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia02',
  name: 'Φ-02',
  subtitle: 'Ophidiophobia',
  place: 'The Reptile House',
  cls: 'Class 4',
  seed: 5074,
  description: 'Steamy tiled enclosures, heat lamps, glass tanks with the lids off. The vivarium was never meant to be this big.',
  intro: 'Kill the three heat-lamp breakers so it gets sluggish, then find the service hatch. Walk softly.',
  spawn: [16, 16],
  wet: true,
  hum: 0.06,
  ambientLight: [0.016, 0.026, 0.014],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x101a0c, density: 0.042 },
  tuning: { grimeScale: 1.4, wetScale: 1.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'wall_tile_green',
      floorMat: 'floor_tile',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_green',
      frameMat: 'metal_grey',
      fixtureColor: [0.8, 1, 0.6],
      fixtureIntensity: 2.8,
      density: [0.2, 0.5],
      roomChance: 0.5,
      doorwayChance: 0.15,
      deadChance: 0.1,
      flickerChance: 0.08,
      darkZones: 0.3,
      featureWeights: { pool: 1.5, glass: 1.4, collapse: 0.4, exit: 0.6, blackout: 0.8 },
      props: 'greenhouse',
    },
  },
  stages: [
    {
      text: 'Turn off the heat lamps',
      goal: 'breaker',
      count: 3,
      dist: [22, 52],
    },
    {
      text: 'Climb out through the service hatch',
      goal: 'hatch',
      dist: [45, 65],
      final: true,
    },
  ],
  entities: [['coil', 2]],
  rare: [['deathmoth', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
