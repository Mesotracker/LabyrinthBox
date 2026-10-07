// --------------------------------------------------------------------------
// Φ-38 - Hemophobia  (id: phobia38, The Phobia Wing)
// Donation chairs, cold-room fridges, bags of it hanging everywhere. The floors are sticky. The trails are fresh.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 8/batteries 3
//    1. Collect the trauma kits  [medkit x3]
//    2. Find the way out  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia38',
  name: 'Φ-38',
  subtitle: 'Hemophobia',
  place: 'The Blood Bank',
  cls: 'Class 4',
  seed: 6406,
  description: 'Donation chairs, cold-room fridges, bags of it hanging everywhere. The floors are sticky. The trails are fresh.',
  intro: 'Collect three trauma kits and get out. Wounds bleed here until you drink. Fresh trails mean it was just there.',
  spawn: [16, 16],
  wet: true,
  hum: 0.07,
  ambientLight: [0.026, 0.014, 0.014],
  bounce: 0.3,
  lightRange: 17,
  fog: { color: 0x1a0a0a, density: 0.038 },
  tuning: { grimeScale: 1.4, wetScale: 1.4 },
  phobia: { hazards: ['bleed'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'plaster_hospital',
      floorMat: 'vct_hospital',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_red',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.7, 0.66],
      fixtureIntensity: 3,
      density: [0.3, 0.6],
      roomChance: 0.6,
      deadChance: 0.1,
      flickerChance: 0.1,
      strobeChance: 0.02,
      darkZones: 0.3,
      featureWeights: { pool: 0.6, glass: 0.6, collapse: 0.5, exit: 0.8, blackout: 1 },
      props: 'hospital',
    },
  },
  stages: [
    {
      text: 'Collect the trauma kits',
      goal: 'medkit',
      count: 3,
      dist: [25, 55],
    },
    { text: 'Find the way out', goal: 'door_exit', dist: [50, 70], final: true },
  ],
  entities: [['bleeder', 3]],
  rare: [['wretch', 0.3]],
  loot: { keys: 10, water: 8, batteries: 3 },
});
