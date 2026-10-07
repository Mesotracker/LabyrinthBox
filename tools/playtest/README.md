# tools/playtest — run the game without a browser

These scripts boot **the real `index.html`** in Node: the same module bundle, the
same `levels/` and `entities/` files, the same world generator. Only the browser
is fake — a small DOM, a 2D canvas that accepts writes, and a WebGL renderer
stub that counts draw calls instead of drawing. Everything else is the game's own
code, so a crash here is a crash in the game.

They need nothing installed: `node` 18+ and this repository.

```
node tools/playtest/menu.mjs          # start screen, pack dock, level grid, enter + quit
node tools/playtest/play.mjs          # enter two levels of every pack and play them through
node tools/playtest/play.mjs pg02     # one level
node tools/playtest/play.mjs corruption   # one pack
node tools/playtest/play.mjs all      # all 135 levels (slow: ~20 s each)
node tools/playtest/stairs.mjs        # climb every Playground stair shaft to the door at the top
node tools/playtest/studios.mjs       # other/level-studio.html, entity-studio.html, entity-viewer.html
```

Each script exits non-zero if it found a problem, so they can be chained:

```
node tools/levelcheck/check.mjs && node tools/playtest/menu.mjs && node tools/playtest/play.mjs
```

## What each one does

| script | what it exercises |
| --- | --- |
| `menu.mjs` | boot, the start screen, installing every bonus pack from the dock, the level grid of each pack (one card per level), entering a level from the menu and quitting back |
| `play.mjs` | `game.enter()` for real — world generation, lighting bake, loot planning, goal placement, entities — then walks the objective chain: stand at each goal, use it, wait for the stage to finish, and report anything thrown in a frame, a timer or an await |
| `stairs.mjs` | walks every stair shaft from the bottom landing to the door at the top, one short step at a time, and checks the player actually gains `flights x rise` metres |
| `studios.mjs` | opens the two studios and the entity viewer, clicks every preset, and loads what they print back in (a level file has to register through `LabLevels.add`, an entity file has to evaluate against the game's entity code) |

`play.mjs` cannot solve puzzles that need real input — keypad codes, valves in a
colour order, "pick the safe slide", "pick the window that leads home". Those
stages are reported as `puzz … note: … (puzzle input)` and are not failures.

## The pieces

| file | what it is |
| --- | --- |
| `dom.mjs` | the fake browser: elements, ids, classes, `innerHTML` parsing, a 2D canvas, and `stubRenderer()` for `THREE.WebGLRenderer` |
| `globals.mjs` | `Audio`, `AudioContext`, `localStorage`, … and the clock: nothing moves until `clock.pump(frames)` says so, so tests run as fast as the machine can generate a world |
| `page.mjs` | runs a page's `<script>` tags in document order, **including scripts written with `document.write()`** — which is how `levels/loader.js` and `entities/loader.js` work |
| `boot.mjs` | boots `index.html` and hands back `{ game, clock, LEVELS, PACKS, problems }` |

## What it cannot see

No GPU: shaders are never compiled and nothing is rasterised, so this will not
catch a broken shader or something being drawn in the wrong place. It catches
the other kind of bug — the one that throws. Two real examples it found:

* `levels/loader.js` read `window.LabLevels` in the same script that wrote the
  `<script>` tag for it, which can never work; the game started with no levels.
* `Goal.build` never called `buildStructure` for `stairshaft`, so the Playground
  stair shafts had no geometry and opening the door threw.
* The flights of those shafts were then built with the wrong sign, outside the
  shaft walls: the stairwell was empty and the door at the top unreachable.
