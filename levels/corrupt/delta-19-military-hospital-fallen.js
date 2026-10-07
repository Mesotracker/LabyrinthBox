// --------------------------------------------------------------------------
// Δ-19 - Military Hospital, Fallen  (id: cor19, Corruption)
// Wards cut off mid-corridor. A canyon runs between them and a crevice opens along the theatre wing; the beds stand on the lip of both. Rain pours through the operating theatre.
//
// Scene: 22 generator settings, 4 entity groups, 2 rare spawns, loot keys 9/water 4/batteries 4, 2 cuts in the floor (canyon, crevice), file corruption 0.35
//    1. Collect the medical kits  [medkit x3]
//    2. Find the hospital exit  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor19',
  name: 'Δ-19',
  subtitle: 'Military Hospital, Fallen',
  place: 'Level 14, the wards that dropped',
  cls: 'Class 4',
  passive: false,
  seed: 7779,
  description: 'Wards cut off mid-corridor. A canyon runs between them and a crevice opens along the theatre wing; the beds stand on the lip of both. Rain pours through the operating theatre.',
  intro: 'Collect three medical kits from the wall cabinets, then find the exit. A whole wing has fallen away. Find the long route around the edge.',
  spawn: [16, 16],
  fall: true,
  ambientLight: [0.0564, 0.0652, 0.0652],
  bounce: 0.32,
  lightRange: 18,
  fog: { color: 0x8f9694, density: 0.0216 },
  sky: {
    top: 0xaab6c0,
    horizon: 0xd8dedc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.95,
  },
  tuning: { grimeScale: 1.8, wetScale: 0.54 },
  corrupt: 0.35,
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
      deadChance: 0.2,
      flickerChance: 0.14,
      strobeChance: 0.02,
      dyingChance: 0.08,
      darkZones: 0.42,
      featureWeights: { pool: 0, glass: 0.8, collapse: 1.48, exit: 0.8, blackout: 1, leak: 1.6 },
      props: 'hospital',
      missingTileChance: 0.06,
      overgrown: 0.5,
      cracked: 0.7,
      damp: 0.55,
      cuts: [
        {
          kind: 'canyon',
          axis: 'z',
          mid: 8,
          length: 62,
          offset: -20,
          width: 5,
          wobble: 10,
          bridges: 2,
          bridgeSpan: 4,
          jag: 3,
        },
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 54,
          offset: 22,
          runs: 2,
          spacing: 17,
          width: 1,
          wobble: 8,
        },
      ],
    },
  },
  stages: [
    {
      text: 'Collect the medical kits',
      goal: 'medkit',
      count: 3,
      dist: [25, 55],
    },
    {
      text: 'Find the hospital exit',
      goal: 'door_exit',
      dist: [50, 70],
      final: true,
    },
  ],
  entities: [
    ['wretch', 3, null],
    ['clump', 1, null],
    ['faceling', 1, null],
    ['mut_splice', 2],
  ],
  rare: [['whisperer', 0.49], ['mut_sprawl', 0.35]],
  loot: { keys: 9, water: 4, batteries: 4 },
});
