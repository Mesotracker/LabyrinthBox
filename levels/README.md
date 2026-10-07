# Levels

Every level is one small file. The game reads the folders below at startup and
builds the level list out of them, so **editing a level file is all it takes** —
there is nothing to compile and nothing to paste into `index.html`.

```
levels/
  core.js        the tiny registry every level file talks to (do not edit)
  loader.js      loads core.js, packs.js and every level file (do not edit)
  packs.js       one entry per pack: name, blurb, and the list of level files
  base/          the base campaign        (31 levels)
  phobia/        The Phobia Wing          (44 levels + _pack.js)
  corrupt/       Corruption               (30 levels)
  playground/    Playground               (30 levels + _pack.js)
```

A pack folder can also hold a `_pack.js` file with anything the pack's levels
need beyond the base game — furniture sets, item names, materials. Look at
`phobia/_pack.js` for an example.

## The fastest way in

* **Making a level:** open `other/level-studio.html` in a browser. Pick a preset,
  move the sliders, press *Download*, drop the file in the pack folder and add its
  name to that pack's `files: [...]` list in `packs.js`. The studio prints the
  exact line to add.
* **Looking at a level's shape:** `node tools/levelcheck/cutcheck.mjs corrupt`
  prints a map of the holes in the floor of every Corruption level.
* **Checking a whole pack:** `node tools/levelcheck/check.mjs`.

## A level file

```js
LabLevels.add('base', {          // the folder this level belongs to
  id: 'level0',                  // short, unique, no spaces
  name: 'Level 0',
  subtitle: 'The Lobby',
  cls: 'Class 1',
  seed: 1001,                    // change this for a different layout
  description: 'One line for the level list.',
  intro: 'One or two lines shown when the level starts.',
  spawn: [16, 16],               // where the player starts, in metres
  ...
  gen: { type: 'lobby', params: { ... } },   // how the level is built
  stages: [ { text: 'Find the exit door', goal: 'door_exit', final: true } ],
  entities: [['weaver', 5]],     // who is in it: [id, how many]
  rare: [['crawler', 0.2]],      // rare spawns: [id, chance]
  loot: { keys: 7, water: 4, batteries: 2 },
});
```

Only `id`, `name`, `description`, `intro`, `seed`, `stages` and `gen` are
required. Everything else has a sensible default.

### Fields you will actually touch

| field | what it does |
| --- | --- |
| `name`, `subtitle`, `place` | what the level is called |
| `cls` | the class shown in the level list (`Class 1` … `Class ∞`) |
| `description` | the line under the name in the list |
| `intro` | the text on the loading screen |
| `seed` | every random choice in the level follows it — change it for a new layout |
| `spawn` | `[x, z]` start position in metres |
| `gen` | the generator (see below) |
| `stages` | what the player has to do (see below) |
| `entities`, `rare` | who is in the level, and who might be |
| `loot` | how much loot the level spawns |
| `fall` | `true` = falling off the level kills you instead of being rescued |
| `wet`, `wade` | wet floor look; `wade` = water depth in metres |
| `outdoor`, `dark`, `dayNight`, `ambience` | light and sky |
| `corrupt` | 0–1, how badly the level's "file" is damaged (Corruption pack) |
| `tuning` | `{ grimeScale, wetScale }` — how dirty/wet the materials look |

The other fields (`adrenaline`, `puzzle`, `cover`, `leviathan`, `fogBanks`,
`envLamps`, `surface`, `ambientLight`, `bounce`, `lightRange`, `fog`, `sky`,
`current`, `phobia`, `hum`, `flashes`, `passive`) are documented by the level
next to you: open any file in `levels/base/` and read the value.

### `gen`: how the level is built

| type | what it makes | main params |
| --- | --- | --- |
| `lobby` | indoor rooms and corridors, lamps, props, holes in the ceiling | `height`, `wallMat`, `floorMat`, `ceilMat`, `fixtureMat`, `frameMat`, `fixtureColor`, `fixtureIntensity`, `density`, `roomChance`, `pillarChance`, `doorwayChance`, `deadChance`, `flickerChance`, `strobeChance`, `dyingChance`, `darkZones`, `missingTileChance`, `props`, `corridor`, `flood`, `overgrown`, `cracked`, `damp`, `decals`, `featureWeights`, `allDark`, `cuts` |
| `forest` | trees, bushes, a lamp or two | `treeChance`, `lampChance` |
| `open` | one of the outdoor places | `mode` = `suburbs`, `city`, `field`, `cave`, `hills`, `courtyard`, `heights`, `lot`, `ocean`; `style`, `broken` |

Material names (`wallMat`, `props`, …) are the ones in `other/level-studio.html`'s
dropdowns — the studio only offers names that exist.

### `stages`: what to do

Each stage is one objective. `goal` is the thing to reach or use
(`door_exit`, `stairs`, `stairshaft`, `slide`, `generator`, `valve`, `lantern`,
`medkit`, `elevator`, `keypad`, `hatch`, `cake`, `musicbox`, `terminal`, `bell`,
`breaker`, `artifact`, `anchor`, `note`, `vending`, `portal_window`, and the
doors). Useful keys:

```js
{ text: 'Take the stairwell to the midway', goal: 'stairshaft',
  flights: 6, rise: 2.8,          // how many flights, how tall each is
  dist: [40, 60],                 // how far from the spawn it may be, in metres
  final: true }                   // the last stage of the level
```

| key | meaning |
| --- | --- |
| `text` | the objective line in the HUD |
| `goal` | what to reach (see the list above) |
| `item`, `count` | collect `count` of `item` instead |
| `dist: [min, max]` | how far from the spawn the target may be placed |
| `final` | this stage finishes the level |
| `from: 'prev'`, `reuse` | place this target at the previous stage's target |
| `survive`, `rideTime`, `pickSafe`, `order`, `code`, `corridor` | special stage types — copy one from an existing level |
| `effects` | things that happen at the stage: `alarm`, `message`, `night`, `powercut`, `rage`, `spawn` |

A level whose last stage is not `final: true` never ends — the studio warns about
this.

### `entities` and `rare`

```js
entities: [['smiler', 4], ['partygoer', 6]],   // [id, how many]
rare: [['crawler', 0.2]],                      // [id, chance per spawn point]
entities: [['chase', 1, { delay: 2.5 }]],      // [id, how many, options] - options are
                                               // for special creatures; copy one that works
```

The ids are the files in `entities/` without the `.js` (`entities/smiler.js` →
`'smiler'`). Add your own with `other/entity-studio.html`.

## Holes in the floor: `cuts`

`gen.params.cuts` is an array of holes. A level with cuts should set `fall: true`
so the drop kills. Four kinds:

```js
cuts: [
  // a wide trench, torn in whole cells, with bridges of solid rock across it
  { kind: 'canyon',  axis: 'x', mid: 8, length: 64, offset: -22, width: 5, wobble: 10,
    bridges: 2, bridgeSpan: 4, jag: 3 },
  // one or more long narrow slits
  { kind: 'crevice', axis: 'z', mid: 8, length: 56, offset: 24, runs: 2, spacing: 18,
    width: 1.1, wobble: 9 },
  // a rectangular piece of the level cut straight out
  { kind: 'block',   x: 18, z: -14, w: 9, h: 10, shards: 0.12 },
  // the original single tear, still accepted under gen.params.cliff:
  { kind: 'rift',    axis: 'x', mid: 8, length: 56, offset: -20, width: 2.4, wobble: 9 },
]
```

* coordinates are grid cells (one cell = 2 m) and are measured from the level
  origin — check where your `spawn` is before you place one (`spawn: [16,16]` is
  about cell `(8, 8)`, so a cut at `mid: 8, offset: 0` would swallow it);
* `axis` is the direction the cut runs; `mid` is the cell it is centred on along
  that axis, `offset` how far off the origin it lies across it;
* `width` how wide it opens, `wobble` how far the edge wanders;
* a canyon is crossable at `bridges` even intervals, so the far side is always
  reachable on foot. Without bridges, the only way across is the long way round;
* the water of a flooded level runs away into a cut instead of floating over it,
  and the edges get a broken lip and slabs hanging in the hole.

Run `node tools/levelcheck/cutcheck.mjs corrupt` to see every cut drawn on a map,
how much of the play area it takes, and how close it comes to the spawn.

## Adding a level

1. Put `my-level.js` in the pack folder (the studio's *Download* button, or copy
   a level that is like yours and edit it).
2. Add its file name to that pack's `files: [...]` list in `levels/packs.js`.
3. Reload the game.

## Adding a pack

1. Make the folder, put the level files in it.
2. Copy the `LabLevels.pack({ ... })` block of another pack in `levels/packs.js`,
   change `folder` to the new folder name and list the files. `bonus: true` packs
   are installed from the pack dock on the start screen; `builtin: true` is
   always installed. Give it a `name`, a `tab` and a `blurb`.
3. Reload the game. The studio prints a ready-made pack block.

## Heads up: regenerated packs

The Corruption and Playground packs were rebuilt from the original game by
`tools/levelcheck/regen.mjs`, which **overwrites every file in those folders**.
If you hand-edit a Corruption or Playground level, keep your own copy: the
generator's inputs (cut shapes, glitch amounts, rewritten text) live in
`tools/levelcheck/data/*.json`.
