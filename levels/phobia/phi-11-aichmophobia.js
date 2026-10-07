// --------------------------------------------------------------------------
// Φ-11 - Aichmophobia  (id: phobia11, The Phobia Wing)
// Waiting rooms, treatment bays and sharps bins tipped out over the floor. Every floor.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 8/batteries 3
//    1. Collect the trauma kits  [medkit x3]
//    2. Find the clinic exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia11',
  name: 'Φ-11',
  subtitle: 'Aichmophobia',
  place: 'The Clinic',
  cls: 'Class 3',
  seed: 5407,
  description: 'Waiting rooms, treatment bays and sharps bins tipped out over the floor. Every floor.',
  intro: 'Take the three trauma kits from the wall cabinets and get out. Crouch-walk over the syringes; drink to stop bleeding.',
  spawn: [16, 16],
  ambientLight: [0.022, 0.026, 0.026],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x141a19, density: 0.036 },
  tuning: { grimeScale: 1.2, wetScale: 0.4 },
  phobia: { hazards: ['needles'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'plaster_hospital',
      floorMat: 'vct_hospital',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.9, 0.97, 1],
      fixtureIntensity: 3.3,
      density: [0.3, 0.6],
      roomChance: 0.6,
      deadChance: 0.08,
      flickerChance: 0.08,
      strobeChance: 0.02,
      dyingChance: 0.03,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.8, collapse: 0.6, exit: 0.8, blackout: 1 },
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
    {
      text: 'Find the clinic exit',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['phlebotomist', 3]],
  rare: [['wretch', 0.25]],
  loot: { keys: 10, water: 8, batteries: 3 },
});
