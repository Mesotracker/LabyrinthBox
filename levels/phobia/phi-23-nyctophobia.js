// --------------------------------------------------------------------------
// Φ-23 - Nyctophobia  (id: phobia23, The Phobia Wing)
// Corridors with one working light for every twenty dead ones. Between the pools of light: nothing. Or something.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 10
//    1. Light the lanterns  [lantern x4]
//    2. Find the exit in the dark  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia23',
  name: 'Φ-23',
  subtitle: 'Nyctophobia',
  place: 'The Long Dark',
  cls: 'Class 5',
  seed: 5851,
  description: 'Corridors with one working light for every twenty dead ones. Between the pools of light: nothing. Or something.',
  intro: 'Light four lanterns to make a path, then find the exit. Move from light to light. The beam drives it back, but it drinks your batteries.',
  spawn: [16, 16],
  dark: true,
  hum: 0.02,
  ambientLight: [0.003, 0.003, 0.004],
  bounce: 0.3,
  lightRange: 15,
  fog: { color: 0x020203, density: 0.05 },
  tuning: { grimeScale: 1.2, wetScale: 0.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'concrete_painted',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_grey',
      fixtureColor: [0.9, 0.95, 1],
      fixtureIntensity: 3.2,
      density: [0.2, 0.55],
      fixtureEvery: 3,
      fixtureChance: 0.5,
      deadChance: 0.25,
      flickerChance: 0.05,
      darkZones: 0.85,
      featureWeights: { pool: 0.3, glass: 0.3, collapse: 0.8, exit: 0.4, blackout: 2 },
      props: 'lobby',
    },
  },
  stages: [
    { text: 'Light the lanterns', goal: 'lantern', count: 4, dist: [18, 46] },
    {
      text: 'Find the exit in the dark',
      goal: 'door_exit',
      dist: [45, 60],
      final: true,
    },
  ],
  entities: [['umbra', 2]],
  rare: [['smiler', 0.4]],
  loot: { keys: 10, water: 5, batteries: 10 },
});
