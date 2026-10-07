// --------------------------------------------------------------------------
// Φ-14 - Acrophobia  (id: phobia14, The Phobia Wing)
// Steel walkways two metres wide, hung over nothing. Clouds below. Wind. Railings, mostly.
//
// Scene: 1 generator settings, 1 entity groups, 0 rare spawns, loot keys 12/water 5/batteries 2
//    1. Restart the beacon generators  [generator x2]
//    2. Find the maintenance hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('phobia', {
  id: 'phobia14',
  name: 'Φ-14',
  subtitle: 'Acrophobia',
  place: 'The Catwalks',
  cls: 'Class 4',
  seed: 5518,
  description: 'Steel walkways two metres wide, hung over nothing. Clouds below. Wind. Railings, mostly.',
  intro: 'Restart the two beacon generators on the platforms, then find the maintenance hatch. Crouch when the wind or the Updraft hits.',
  spawn: [16, 16],
  outdoor: true,
  fall: true,
  ambience: 'field',
  hum: 0,
  surface: 'carpet',
  ambientLight: [0.32, 0.34, 0.38],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xb8c0cc, density: 0.024 },
  sky: {
    top: 0x6a86a8,
    horizon: 0xc8d0dc,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.9,
  },
  tuning: { grimeScale: 0.6, wetScale: 0.4 },
  phobia: { hazards: ['gusts'] },
  gen: { type: 'open', mode: 'heights', params: { style: 'sky' } },
  stages: [
    {
      text: 'Restart the beacon generators',
      goal: 'generator',
      count: 2,
      dist: [20, 50],
    },
    {
      text: 'Find the maintenance hatch',
      goal: 'hatch',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['updraft', 2]],
  rare: [],
  loot: { keys: 12, water: 5, batteries: 2 },
});
