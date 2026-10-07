// --------------------------------------------------------------------------
// Level ! - Run For Your Life  (id: level7, Base campaign)
// One endless hallway under red lights. It is right behind you. It never stops.
//
// Scene: 18 generator settings, 1 entity groups, 0 rare spawns, loot keys 6/water 3/batteries 1/region -1,-1,7,1
//    1. RUN. Reach the exit at the end of the hall  [door_exit (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('base', {
  id: 'level7',
  name: 'Level !',
  subtitle: 'Run For Your Life',
  cls: 'Deadzone',
  seed: 1708,
  description: 'One endless hallway under red lights. It is right behind you. It never stops.',
  intro: 'RUN.',
  spawn: [16, 16],
  adrenaline: true,
  hum: 0.04,
  ambientLight: [0.02, 0.004, 0.003],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0x1a0504, density: 0.035 },
  tuning: { grimeScale: 1.3, wetScale: 0.5 },
  gen: {
    type: 'lobby',
    params: {
      height: 3,
      wallMat: 'concrete_painted',
      floorMat: 'concrete_floor',
      ceilMat: 'ceiling_dirty',
      fixtureMat: 'fixture_red',
      frameMat: 'metal_dark',
      fixtureColor: [1, 0.16, 0.1],
      fixtureIntensity: 3.6,
      density: [0.3, 0.6],
      corridor: true,
      pillarChance: 0.2,
      deadChance: 0.05,
      flickerChance: 0.2,
      strobeChance: 0.1,
      dyingChance: 0.02,
      darkZones: 0,
      featureWeights: { pool: 0, glass: 0, collapse: 0.4, exit: 1.5, blackout: 0 },
      props: 'industrial',
    },
  },
  stages: [
    {
      text: 'RUN. Reach the exit at the end of the hall',
      goal: 'door_exit',
      dist: [210, 210],
      angle: 0,
      corridor: true,
      final: true,
    },
  ],
  entities: [['chase', 1, { delay: 2.5 }]],
  loot: { keys: 6, water: 3, batteries: 1, region: [-1, -1, 7, 1] },
});
