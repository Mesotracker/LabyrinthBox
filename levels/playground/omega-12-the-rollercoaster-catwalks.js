// --------------------------------------------------------------------------
// Ω-12 - The Rollercoaster Catwalks  (id: pg12, Playground)
// A ride's service walkways hung in blue sky, rails going everywhere, a track with no train on it.
//
// Scene: 1 generator settings, 1 entity groups, 1 rare spawns, loot keys 10/water 5/batteries 3
//    1. Start the lift motors  [generator x2]
//    2. Find the station hatch  [hatch (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('playground', {
  id: 'pg12',
  name: 'Ω-12',
  subtitle: 'The Rollercoaster Catwalks',
  place: 'Lift hill',
  cls: 'Class 4',
  seed: 9564,
  description: 'A ride\'s service walkways hung in blue sky, rails going everywhere, a track with no train on it.',
  intro: 'Start the two lift motors on the platforms, then find the station hatch. The wind is not part of the ride.',
  spawn: [16, 16],
  outdoor: true,
  fall: true,
  ambience: 'field',
  hum: 0.01,
  surface: 'carpet',
  ambientLight: [0.34, 0.36, 0.4],
  bounce: 0.3,
  lightRange: 18,
  fog: { color: 0xcfe0f2, density: 0.018 },
  sky: {
    top: 0x5a9ae8,
    horizon: 0xd8e8f8,
    glow: 0x000000,
    stars: 0,
    moon: false,
    clouds: 0.9,
  },
  tuning: { grimeScale: 0.2, wetScale: 0.3 },
  gen: { type: 'open', mode: 'heights', params: { style: 'sky' } },
  stages: [
    {
      text: 'Start the lift motors',
      goal: 'generator',
      count: 2,
      dist: [20, 48],
    },
    {
      text: 'Find the station hatch',
      goal: 'hatch',
      dist: [40, 60],
      final: true,
    },
  ],
  entities: [['updraft', 2]],
  rare: [['pg_mascot', 0.2]],
  loot: { keys: 10, water: 5, batteries: 3 },
});
