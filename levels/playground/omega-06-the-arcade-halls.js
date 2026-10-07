// --------------------------------------------------------------------------
// Ω-06 - The Arcade Halls  (id: pg06, Playground)
// Cabinets in rows to the horizon, every screen showing the same four words. The floor is carpeted in pinball-table swirls.
//
// Scene: 19 generator settings, 2 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Find the arcade tokens  [find token x3]
//    2. Upload your high score  [terminal]
//    3. Reach the prize counter  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg06',
  name: 'Ω-06',
  subtitle: 'The Arcade Halls',
  place: 'Insert coin',
  cls: 'Class 3',
  seed: 9282,
  description: 'Cabinets in rows to the horizon, every screen showing the same four words. The floor is carpeted in pinball-table swirls.',
  intro: 'Collect three tokens, upload your score at the main terminal and leave by the prize counter.',
  spawn: [16, 16],
  hum: 0.01,
  ambientLight: [0.03, 0.02, 0.05],
  bounce: 0.4,
  lightRange: 14,
  fog: { color: 0x100820, density: 0.03 },
  tuning: { grimeScale: 0.1, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'paint_black',
      floorMat: 'party_carpet',
      ceilMat: 'ceiling_white',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [0.7, 0.5, 1],
      fixtureIntensity: 3.2,
      density: [0.14, 0.4],
      roomChance: 0.45,
      doorwayChance: 0.18,
      deadChance: 0.02,
      flickerChance: 0.02,
      strobeChance: 0,
      dyingChance: 0,
      darkZones: 0.25,
      missingTileChance: 0.004,
      featureWeights: { pool: 0.4, glass: 0.8, collapse: 0, exit: 0.6, blackout: 0 },
      props: 'party',
    },
  },
  stages: [
    { text: 'Find the arcade tokens', item: 'token', count: 3, dist: [20, 48] },
    {
      text: 'Upload your high score',
      goal: 'terminal',
      dist: [30, 46],
      from: 'prev',
    },
    {
      text: 'Reach the prize counter',
      goal: 'door_exit',
      dist: [40, 58],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['smiler', 3], ['pg_ringmaster', 1]],
  rare: [['partygoer', 0.4]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
