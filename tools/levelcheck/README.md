# tools/levelcheck

Node-only checks for the level files. Nothing here needs a browser, three.js or the
game running: they read the real generator code out of `index.html`, so a tool and
the game always agree about what a level does.

```bash
node tools/levelcheck/check.mjs              # every pack: files, ids, settings, stages, spawns, cuts
node tools/levelcheck/check.mjs corrupt      # just one pack
node tools/levelcheck/cutcheck.mjs           # a map of every hole in the Corruption levels
node tools/levelcheck/cutcheck.mjs playground
node tools/levelcheck/verify.mjs             # every field still matches the original single-file game
```

`check.mjs` is the one to run before you commit a level. It reads the list of valid
materials, furniture sets, goals, entity ids and generator settings out of
`other/level-studio.html`, so if you add something to the game, add it to the studio
and the checker picks it up.

## What each tool does

| file | what it is |
| --- | --- |
| `check.mjs` | whole-tree check: pack lists, duplicate ids, generator settings, materials, props, goals, stage keys, entity ids, loot, cut shapes |
| `cutcheck.mjs` | draws the cuts of a pack's levels, prints how much of the play area is void and how close the nearest hole is to the spawn |
| `verify.mjs` | loads `levels/` the way the browser does and compares every level and pack field with the snapshot of the original single-file game |
| `snapshot.mjs` | rebuilds that snapshot from `index.html` at commit `f3ca628` (or `$LB_BEFORE`) |
| `regen.mjs` | **rewrites** `levels/corrupt/` and `levels/playground/` from `data/*.json` and the original level data. Hand edits in those two folders are lost |
| `bundle.mjs` | splits `index.html` into its modules so the generator code can run in Node |
| `levelio.mjs` | reads one level file (evaluate it with a registry stub) and writes it back in the canonical format |
| `cuts.mjs` | the cut maths, lifted out of the game, plus `cutSurvey()` for tools |
| `data/` | the generator's inputs: `cuts.json`, `glitch.json`, `content.json`, `text.json`, the golden snapshot, and `intended.json` (the paths `verify.mjs` should ignore because they were changed on purpose) |

## Regenerating Corruption and Playground

The two bonus packs were rebuilt from the original game:

* **Corruption** — cuts were authored per level in `data/cuts.json` (canyon /
  crevice / block), the broken-file amount in `data/glitch.json`, and the
  descriptions rewritten in `data/text.json` so they say what is there.
* **Playground** — the stair levels became one narrow stair shaft each, and the
  text was rewritten, in `data/content.json`.

```bash
node tools/levelcheck/regen.mjs    # writes levels/corrupt/* , levels/playground/* and packs.js
node tools/levelcheck/verify.mjs   # every other field must still match the original
```

`regen.mjs` gets the original level data out of `index.html` as it was at commit
`f3ca628`. If that commit is not in your clone, pass the file:
`LB_BEFORE=/path/to/original-index.html node tools/levelcheck/regen.mjs`.

Because `regen.mjs` owns `packs.js`, adding a level to the base or phobia packs by
hand means editing `packs.js` — and a later `regen.mjs` run will overwrite it. Run
`regen.mjs` first, then add your packs and levels.
