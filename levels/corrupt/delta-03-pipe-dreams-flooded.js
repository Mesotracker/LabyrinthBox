// --------------------------------------------------------------------------
// Δ-03 - Pipe Dreams, Flooded  (id: cor03, Corruption)
// The steam lines burst long ago and the corridors became channels. The water has somewhere to be, and it takes you with it. A crevice runs the length of the plant, and one pump hall is missing from the file entirely.
//
// Scene: 25 generator settings, 4 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 4, 2 cuts in the floor (crevice, block), file corruption 0.3
//    1. Shut the steam valves in order  [valve x3]
//    2. Climb out through the maintenance hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor03',
  name: 'Δ-03',
  subtitle: 'Pipe Dreams, Flooded',
  place: 'The maintenance level, drowned',
  cls: 'Class 4',
  passive: false,
  seed: 7123,
  description: 'The steam lines burst long ago and the corridors became channels. The water has somewhere to be, and it takes you with it. A crevice runs the length of the plant, and one pump hall is missing from the file entirely.',
  intro: 'The steam lines are open. Find the maintenance log: the valves must be shut in the right order. The current is strong: it will carry you off the line you meant to walk. Brace, and cut across it.',
  spawn: [16, 16],
  wet: true,
  wade: true,
  fall: true,
  puzzle: true,
  ambience: 'water',
  hum: 0.07,
  ambientLight: [0.033, 0.043, 0.0455],
  bounce: 0.3,
  lightRange: 19,
  fog: { color: 0x35403d, density: 0.0448 },
  tuning: { grimeScale: 2.025, wetScale: 1.89 },
  current: { power: 2.4, rate: 0.35, dir: 0.6, swirl: 1.1 },
  corrupt: 0.3,
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'wall_tile',
      floorMat: 'pool_tile',
      ceilMat: 'concrete_painted',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_white',
      fixtureColor: [0.86, 0.94, 0.98],
      fixtureIntensity: 3,
      density: [0.1, 0.34],
      roomChance: 0.4,
      doorwayChance: 0.1,
      missingTileChance: 0.08,
      deadChance: 0.2,
      flickerChance: 0.12,
      strobeChance: 0.02,
      dyingChance: 0.07,
      darkZones: 0.42,
      featureWeights: {
        pool: 2.4,
        glass: 0.3,
        collapse: 1.3,
        exit: 0.6,
        blackout: 0.9,
        leak: 1.8,
      },
      props: 'sewer',
      overgrown: 0.4,
      cracked: 0.7,
      damp: 0.55,
      flood: 0.3,
      waterMat: 'water',
      cuts: [
        {
          kind: 'crevice',
          axis: 'x',
          mid: 8,
          length: 70,
          offset: 18,
          runs: 2,
          spacing: 16,
          width: 1,
          wobble: 9,
        },
        { kind: 'block', x: -16, z: 18, w: 8, h: 10, shards: 0.08 },
      ],
    },
  },
  stages: [
    {
      text: 'Shut the steam valves in order',
      hint: 'Read the maintenance log',
      goal: 'valve',
      count: 3,
      order: ['yellow', 'red', 'blue'],
      dist: [24, 50],
      clueDist: [6, 18],
      clueTitle: 'Maintenance log',
    },
    {
      text: 'Climb out through the maintenance hatch',
      goal: 'hatch',
      dist: [45, 70],
      final: true,
    },
  ],
  entities: [
    ['faceling', 2, null],
    ['hound', 1, null],
    ['mut_chorus', 2, null],
    ['mut_drowned', 1],
  ],
  rare: [['duller', 0.49], ['worm', 0.28]],
  loot: { keys: 8, water: 5, batteries: 4 },
});
