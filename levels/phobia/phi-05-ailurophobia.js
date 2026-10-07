// --------------------------------------------------------------------------
// Φ-05 - Ailurophobia  (id: phobia05, The Phobia Wing)
// Endless rooms of a single old apartment: green wallpaper, saucers of milk gone solid, scratch marks at shoulder height.
//
// Scene: 16 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 4
//    1. Find the spare key  [find roomkey]
//    2. Reach the lift  [elevator (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia05',
  name: 'Φ-05',
  subtitle: 'Ailurophobia',
  place: 'The Cat Lady\'s Flat',
  cls: 'Class 4',
  seed: 5185,
  description: 'Endless rooms of a single old apartment: green wallpaper, saucers of milk gone solid, scratch marks at shoulder height.',
  intro: 'Find the spare key to number 9, then take the lift. Turn around. Often.',
  spawn: [16, 16],
  ambientLight: [0.02, 0.024, 0.016],
  bounce: 0.3,
  lightRange: 15,
  fog: { color: 0x141810, density: 0.04 },
  tuning: { grimeScale: 1.2, wetScale: 0.3 },
  gen: {
    type: 'lobby',
    params: {
      height: 2.6,
      wallMat: 'damask_green',
      floorMat: 'carpet_green',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_bulb',
      frameMat: 'wood_dark',
      fixtureColor: [1, 0.82, 0.58],
      fixtureIntensity: 2.6,
      density: [0.35, 0.7],
      roomChance: 0.75,
      doorwayChance: 0.2,
      deadChance: 0.12,
      flickerChance: 0.08,
      darkZones: 0.35,
      featureWeights: { pool: 0, glass: 0, collapse: 0.4, exit: 0.6, blackout: 1 },
      props: 'hotel',
    },
  },
  stages: [
    {
      text: 'Find the spare key',
      hint: 'Nightstands and dressers',
      item: 'roomkey',
      dist: [35, 55],
    },
    { text: 'Reach the lift', goal: 'elevator', dist: [50, 70], final: true },
  ],
  entities: [['ninelives', 2]],
  rare: [['whisperer', 0.2]],
  loot: { keys: 10, water: 5, batteries: 4 },
});
