// --------------------------------------------------------------------------
// Level 666 - The Red Rooms  (id: level18, Base campaign)
// Blood-red velvet, low red light, and an elevator that takes its time.
//
// Scene: 17 generator settings, 2 entity groups, 2 rare spawns, loot keys 9/water 6/batteries 3
//    1. Call the elevator  [elevator]
//    2. Survive until the elevator arrives  [survive 45s]
//    3. Get in the elevator  [stage (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level18',
  name: 'Level 666',
  subtitle: 'The Red Rooms',
  cls: 'Class 5',
  seed: 2819,
  description: 'Blood-red velvet, low red light, and an elevator that takes its time.',
  intro: 'Call the elevator and stay alive until it arrives.',
  spawn: [16, 16],
  hum: 0.06,
  ambientLight: [0.03, 0.006, 0.006],
  bounce: 0.3,
  lightRange: 16,
  fog: { color: 0x1c0506, density: 0.042 },
  tuning: { grimeScale: 1, wetScale: 0.4 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.7,
      wallMat: 'red_room',
      floorMat: 'carpet_red',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_red',
      frameMat: 'metal_dark',
      fixtureColor: [1, 0.25, 0.2],
      fixtureIntensity: 3,
      density: [0.25, 0.55],
      roomChance: 0.6,
      deadChance: 0.08,
      flickerChance: 0.12,
      strobeChance: 0.04,
      dyingChance: 0.04,
      darkZones: 0.3,
      featureWeights: { pool: 0, glass: 0.3, collapse: 0.5, exit: 0, blackout: 1 },
      props: 'red',
    },
  },
  stages: [
    { text: 'Call the elevator', goal: 'elevator', dist: [45, 60] },
    {
      text: 'Survive until the elevator arrives',
      survive: 45,
      start: [['spawn', 'skinstealer', 2], ['alarm']],
      revert: true,
    },
    { text: 'Get in the elevator', reuse: true, final: true },
  ],
  entities: [['skinstealer', 3], ['smiler', 2]],
  rare: [['duller', 0.35], ['whisperer', 0.2]],
  loot: { keys: 9, water: 6, batteries: 3 },
});
