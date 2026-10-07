// --------------------------------------------------------------------------
// Φ-28 - Somniphobia  (id: phobia28, The Phobia Wing)
// An office at four in the morning. Screensavers, a ticking clock, a heaviness behind your eyes that will not go away.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 6/batteries 4
//    1. Get coffee from the vending machines  [vending x3]
//    2. Finish the report  [terminal]
//    3. Clock out: take the stairs  [door_stairs (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia28',
  name: 'Φ-28',
  subtitle: 'Somniphobia',
  place: 'The Night Shift',
  cls: 'Class 5',
  seed: 6036,
  description: 'An office at four in the morning. Screensavers, a ticking clock, a heaviness behind your eyes that will not go away.',
  intro: 'Get three coffees from the vending machines, finish the report at the terminal, take the stairs. Keep moving. Stay awake.',
  spawn: [16, 16],
  hum: 0.05,
  ambientLight: [0.016, 0.017, 0.022],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x0e1016, density: 0.04 },
  tuning: { grimeScale: 0.9, wetScale: 0.3 },
  phobia: { meters: ['drowsy'], coffee: true },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'drywall_grey',
      floorMat: 'carpet_office',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.8, 0.86, 1],
      fixtureIntensity: 2.6,
      density: [0.15, 0.45],
      roomChance: 0.6,
      pillarChance: 0.2,
      deadChance: 0.25,
      flickerChance: 0.08,
      darkZones: 0.45,
      featureWeights: { pool: 0, glass: 2, collapse: 0.5, exit: 0.6, blackout: 1 },
      props: 'office',
    },
  },
  stages: [
    {
      text: 'Get coffee from the vending machines',
      goal: 'vending',
      count: 3,
      dist: [20, 50],
    },
    { text: 'Finish the report', goal: 'terminal', dist: [35, 50] },
    {
      text: 'Clock out: take the stairs',
      goal: 'door_stairs',
      dist: [35, 50],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['sandman', 1]],
  rare: [['faceling', 0.4]],
  loot: { keys: 10, water: 6, batteries: 4 },
});
