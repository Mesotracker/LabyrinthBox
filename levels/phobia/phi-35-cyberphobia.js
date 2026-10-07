// --------------------------------------------------------------------------
// Φ-35 - Cyberphobia  (id: phobia35, The Phobia Wing)
// Cold blue aisles of humming racks, cables in the ceiling, screens that show you from behind. Reality has a low frame rate here.
//
// Scene: 17 generator settings, 1 entity groups, 0 rare spawns, loot keys 10/water 5/batteries 4
//    1. Recover the backup disks  [find disk x3]
//    2. Upload them at the console  [terminal]
//    3. Leave through security  [door_security (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia35',
  name: 'Φ-35',
  subtitle: 'Cyberphobia',
  place: 'The Server Farm',
  cls: 'Class 4',
  seed: 6295,
  description: 'Cold blue aisles of humming racks, cables in the ceiling, screens that show you from behind. Reality has a low frame rate here.',
  intro: 'Recover three backup disks, upload them, then leave through security. Glance at it — never stare.',
  spawn: [16, 16],
  hum: 0.12,
  ambientLight: [0.012, 0.018, 0.026],
  bounce: 0.26,
  lightRange: 16,
  fog: { color: 0x060a12, density: 0.04 },
  tuning: { grimeScale: 0.7, wetScale: 0.2 },
  phobia: { hazards: ['glitch'] },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'concrete_dark',
      floorMat: 'rubber_floor',
      ceilMat: 'void_black',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_dark',
      fixtureColor: [0.6, 0.8, 1],
      fixtureIntensity: 3,
      density: [0.3, 0.6],
      roomChance: 0.3,
      pillarChance: 0.3,
      deadChance: 0.1,
      flickerChance: 0.12,
      strobeChance: 0.05,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 1, collapse: 0.4, exit: 0.6, blackout: 1 },
      props: 'server',
    },
  },
  stages: [
    {
      text: 'Recover the backup disks',
      hint: 'Cabinets and lockers',
      item: 'disk',
      count: 3,
      dist: [25, 55],
    },
    { text: 'Upload them at the console', goal: 'terminal', dist: [40, 55] },
    {
      text: 'Leave through security',
      goal: 'door_security',
      dist: [35, 50],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['glitch', 2]],
  rare: [],
  loot: { keys: 10, water: 5, batteries: 4 },
});
