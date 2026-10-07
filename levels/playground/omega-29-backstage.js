// --------------------------------------------------------------------------
// Ω-29 - Backstage  (id: pg29, Playground)
// The park as it looks with the lights off: concrete corridors, cable runs, costume racks and a hundred heads on a hundred pegs.
//
// Scene: 15 generator settings, 4 entity groups, 2 rare spawns, loot keys 10/water 5/batteries 3
//    1. Throw the backstage breakers  [breaker x3]
//    2. Raise the loading dock gate  [door_shutter (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg29',
  name: 'Ω-29',
  subtitle: 'Backstage',
  place: 'Staff only',
  cls: 'Class 5',
  seed: 10363,
  description: 'The park as it looks with the lights off: concrete corridors, cable runs, costume racks and a hundred heads on a hundred pegs.',
  intro: 'Throw three backstage breakers and leave by the loading dock. Nothing here is dressed for the party.',
  spawn: [16, 16],
  hum: 0.07,
  ambientLight: [0.016, 0.014, 0.012],
  bounce: 0.3,
  lightRange: 15,
  fog: { color: 0x14100c, density: 0.04 },
  gen: {
    type: 'lobby',
    params: {
      height: 3.2,
      wallMat: 'concrete_painted',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_cold',
      frameMat: 'metal_grey',
      fixtureColor: [0.88, 0.94, 1],
      fixtureIntensity: 3,
      density: [0.25, 0.55],
      roomChance: 0.4,
      deadChance: 0.12,
      flickerChance: 0.1,
      darkZones: 0.3,
      featureWeights: { pool: 0.2, glass: 0.4, collapse: 0.4, exit: 0.8, blackout: 1.2 },
      props: 'industrial',
    },
  },
  stages: [
    {
      text: 'Throw the backstage breakers',
      goal: 'breaker',
      count: 3,
      dist: [22, 50],
    },
    {
      text: 'Raise the loading dock gate',
      goal: 'door_shutter',
      dist: [44, 62],
      from: 'prev',
      final: true,
    },
  ],
  entities: [['pg_mascot', 1], ['pg_attendant', 2], ['mannequin', 3], ['smiler', 2]],
  rare: [['pg_ringmaster', 0.4], ['stature', 0.3]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
