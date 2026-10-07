// --------------------------------------------------------------------------
// Ω-19 - The Ghost Train  (id: pg19, Playground)
// A dark ride where the cars have been taken away. The painted ghosts on the walls are done in glow paint and one of them moves.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the tunnel fuses  [find fuse x3]
//    2. Reset the ride panel  [breaker]
//    3. Follow the rails out  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg19',
  name: 'Ω-19',
  subtitle: 'The Ghost Train',
  place: 'Through the tunnel',
  cls: 'Class 5',
  seed: 9893,
  description: 'A dark ride where the cars have been taken away. The painted ghosts on the walls are done in glow paint and one of them moves.',
  intro: 'Find three tunnel fuses, reset the ride panel, then follow the rails out. Do not follow the one that moves.',
  spawn: [16, 16],
  hum: 0.05,
  ambientLight: [0.012, 0.01, 0.02],
  bounce: 0.3,
  lightRange: 14,
  fog: { color: 0x120816, density: 0.04 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'red_room',
      floorMat: 'carpet_red',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.4, 0.4],
      fixtureIntensity: 2.8,
      density: [0.3, 0.6],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.15,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.4,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'red',
    },
  },
  stages: [
    { text: 'Find the tunnel fuses', item: 'fuse', count: 3, dist: [20, 46] },
    {
      text: 'Reset the ride panel',
      goal: 'breaker',
      dist: [28, 44],
      from: 'prev',
    },
    {
      text: 'Follow the rails out',
      goal: 'door_exit',
      dist: [40, 58],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['smiler', 3], ['pg_attendant', 1]],
  rare: [['whisperer', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
