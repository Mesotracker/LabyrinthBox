// --------------------------------------------------------------------------
// Φ-08 - Automatonophobia  (id: phobia08, The Phobia Wing)
// An exhibition hall of animatronics and wax figures with the power almost gone. Some exhibits have left their plinths.
//
// Scene: 16 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 9
//    1. Throw the stage-light breakers  [breaker x3]
//    2. Raise the loading shutter  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia08',
  name: 'Φ-08',
  subtitle: 'Automatonophobia',
  place: 'The Showroom After Close',
  cls: 'Class 4',
  seed: 5296,
  description: 'An exhibition hall of animatronics and wax figures with the power almost gone. Some exhibits have left their plinths.',
  intro: 'Throw the three stage-light breakers, then raise the loading shutter. Keep your flashlight on the Showman. Save your batteries.',
  spawn: [16, 16],
  ambientLight: [0.01, 0.008, 0.008],
  bounce: 0.28,
  lightRange: 14,
  fog: { color: 0x0e0808, density: 0.045 },
  tuning: { grimeScale: 1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.6,
      wallMat: 'gallery_red',
      floorMat: 'wood_floor',
      ceilMat: 'void_black',
      fixtureMat: 'fixture_red',
      frameMat: 'metal_dark',
      fixtureColor: [1, 0.4, 0.3],
      fixtureIntensity: 2.2,
      density: [0.15, 0.4],
      roomChance: 0.85,
      doorwayChance: 0.25,
      deadChance: 0.35,
      flickerChance: 0.15,
      darkZones: 0.6,
      featureWeights: { pool: 0, glass: 1, collapse: 0.3, exit: 0.6, blackout: 1.5 },
      props: 'theater',
    },
  },
  stages: [
    {
      text: 'Throw the stage-light breakers',
      goal: 'breaker',
      count: 3,
      dist: [22, 52],
    },
    {
      text: 'Raise the loading shutter',
      goal: 'door_shutter',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [['showman', 3], ['mannequin', 3]],
  rare: [['stature', 0.2]],
  loot: { keys: 10, water: 5, batteries: 9 },
});
