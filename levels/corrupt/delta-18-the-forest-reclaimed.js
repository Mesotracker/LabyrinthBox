// --------------------------------------------------------------------------
// Δ-18 - The Forest, Reclaimed  (id: cor18, Corruption)
// The trees have closed the way. Roots have lifted the ground and the moon is a pale smear in the canopy.
//
// Scene: 1 generator settings, 5 entity groups, 2 rare spawns, loot keys 8/water 5/batteries 4, file corruption 0.5
//    1. Light the lanterns  [lantern x3]
//    2. Find the cabin  [cabin (final)]
//
// One level per file: change anything here and reload the game. Field list:
// levels/README.md  -  build levels without code: other/level-studio.html
// --------------------------------------------------------------------------
LabLevels.add('corrupt', {
  id: 'cor18',
  name: 'Δ-18',
  subtitle: 'The Forest, Reclaimed',
  place: 'Level 13.1, where the trees won',
  cls: 'Class 5',
  passive: false,
  seed: 7738,
  description: 'The trees have closed the way. Roots have lifted the ground and the moon is a pale smear in the canopy.',
  intro: 'Light three lanterns to mark the trail, then find the cabin. The woods are denser, and the howling comes from more than one throat.',
  spawn: [16, 16],
  ambience: 'forest',
  hum: 0,
  ambientLight: [0.06425, 0.07675, 0.10175],
  bounce: 0.2,
  lightRange: 16,
  fog: { color: 0x3a4546, density: 0.056 },
  tuning: { grimeScale: 0.3, wetScale: 0.675 },
  corrupt: 0.5,
  gen: { type: 'forest', params: { treeChance: 0.14 } },
  stages: [
    { text: 'Light the lanterns', goal: 'lantern', count: 3, dist: [25, 60] },
    { text: 'Find the cabin', goal: 'cabin', dist: [60, 80], final: true },
  ],
  entities: [
    ['hound', 3, null],
    ['mut_drowned', 1, null],
    ['deathmoth', 2, null],
    ['mut_drowned', 1],
    ['mut_sprawl', 1],
  ],
  rare: [['worm', 0.49], ['mut_thicket', 0.42]],
  loot: { keys: 8, water: 5, batteries: 4 },
});
