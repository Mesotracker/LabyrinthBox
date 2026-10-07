// --------------------------------------------------------------------------
// Φ-27 - Decidophobia  (id: phobia27, The Phobia Wing)
// Corridors that fork, and fork again. Windows that show somewhere else. Every one of them looks like the right way.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 11/water 5/batteries 3
//    1. Choose a window  [portal_window x4]
//    2. Choose again  [portal_window x4 (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia27',
  name: 'Φ-27',
  subtitle: 'Decidophobia',
  place: 'The Crossroads',
  cls: 'Class 4',
  seed: 5999,
  description: 'Corridors that fork, and fork again. Windows that show somewhere else. Every one of them looks like the right way.',
  intro: 'Two windows lead on. Read the notes, pick one, climb through. Do not stand still: the scales are weighing you.',
  spawn: [16, 16],
  puzzle: true,
  ambientLight: [0.028, 0.024, 0.02],
  bounce: 0.32,
  lightRange: 17,
  fog: { color: 0x1d1810, density: 0.032 },
  tuning: { grimeScale: 0.9, wetScale: 0.3 },
  phobia: { meters: ['indecision'] },
  gen: {
    type: 'lobby',
    params: {
      height: 2.8,
      wallMat: 'drywall_peach',
      floorMat: 'carpet_office',
      ceilMat: 'l0_ceiling',
      fixtureMat: 'fixture_troffer',
      frameMat: 'metal_white',
      fixtureColor: [1, 0.92, 0.78],
      fixtureIntensity: 3.4,
      density: [0.3, 0.65],
      roomChance: 0.4,
      doorwayChance: 0.15,
      deadChance: 0.06,
      flickerChance: 0.06,
      darkZones: 0.25,
      featureWeights: { pool: 0.4, glass: 0.6, collapse: 0.6, exit: 0.8, blackout: 0.8 },
      props: 'lobby',
    },
  },
  stages: [
    {
      text: 'Choose a window',
      hint: 'Read the note first',
      goal: 'portal_window',
      count: 4,
      choose: 'lobby',
      dist: [18, 40],
      clueDist: [3, 8],
      clueTitle: 'A note on the floor',
      chooseClue: 'Four windows. One onto blue water, one onto red, one onto trees, one onto nothing at all.\nThe fifth colour is the right one: yellow, the colour of where we started.\nDo not stand here thinking about it.',
    },
    {
      text: 'Choose again',
      hint: 'Find the second note',
      goal: 'portal_window',
      count: 4,
      choose: 'pool',
      dist: [20, 40],
      from: 'prev',
      clueDist: [3, 9],
      clueTitle: 'Another note',
      final: true,
      chooseClue: 'This time the way on is wet.\nBlue and white tile, water you can wade.\nDecide. Then go.',
    },
  ],
  entities: [['arbiter', 1]],
  rare: [['faceling', 0.3]],
  loot: { keys: 11, water: 5, batteries: 3 },
});
