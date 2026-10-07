// --------------------------------------------------------------------------
// Φ-31 - Phobophobia  (id: phobia31, The Phobia Wing)
// Padded walls, flickering violet light, and your own heartbeat louder than anything. The fear has a shape here, and it grows.
//
// Scene: 17 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 7/batteries 5
//    1. Stabilise the anchors  [anchor x3]
//    2. Find the door  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia31',
  name: 'Φ-31',
  subtitle: 'Phobophobia',
  place: 'The Panic Room',
  cls: 'Class 5',
  seed: 6147,
  description: 'Padded walls, flickering violet light, and your own heartbeat louder than anything. The fear has a shape here, and it grows.',
  intro: 'Stabilise three anchors and find the door. Keep your FEAR down: light, health, distance. What you see at the edges is not real.',
  spawn: [16, 16],
  hum: 0.06,
  ambientLight: [0.012, 0.008, 0.016],
  bounce: 0.3,
  lightRange: 15,
  fog: { color: 0x0c0612, density: 0.045 },
  tuning: { grimeScale: 0.8, wetScale: 0.3 },
  phobia: { meters: ['fear'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.9,
      wallMat: 'fabric_white',
      floorMat: 'rubber_floor',
      ceilMat: 'void_black',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_dark',
      fixtureColor: [0.78, 0.6, 1],
      fixtureIntensity: 2.8,
      density: [0.25, 0.6],
      roomChance: 0.5,
      deadChance: 0.15,
      flickerChance: 0.18,
      strobeChance: 0.04,
      dyingChance: 0.06,
      darkZones: 0.45,
      featureWeights: { pool: 0, glass: 0.3, collapse: 0.8, exit: 0.4, blackout: 1.4 },
      props: 'void',
    },
  },
  stages: [
    { text: 'Stabilise the anchors', goal: 'anchor', count: 3, dist: [22, 52] },
    { text: 'Find the door', goal: 'door_exit', dist: [45, 60], final: true },
  ],
  entities: [['dread', 1]],
  rare: [['whisperer', 0.3]],
  loot: { keys: 10, water: 7, batteries: 5 },
});
