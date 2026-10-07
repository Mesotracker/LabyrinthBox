// The cut maths, loaded out of the game itself, so a tool and the game always agree
// about where a hole in the floor is. The lobby generator is evaluated with a
// permissive stub for everything it imports: only `inCut` / `cutsOf` are used here.
import fs from 'node:fs';
import path from 'node:path';
import { readBundle, runModule, ROOT } from './bundle.mjs';

const magic = new Proxy(function () {}, {
  get(t, k) { if (k === 'then') return undefined; return magic; },
  apply() { return magic; },
  construct() { return magic; },
});
const real = {};
const permissive = new Proxy(real, {
  get: (t, k) => (typeof k === 'string' ? (k in t ? t[k] : magic) : undefined),
  has: () => true,
});

let cached = null;

export function loadCutTools() {
  if (cached) return cached;
  const { mods } = readBundle(path.join(ROOT, 'index.html'));
  const win = {};
  new Function('window', fs.readFileSync(path.join(ROOT, 'lib/rng.js'), 'utf8'))(win);
  const rng = win.__mod['src/core/rng.js'];
  real['src/core/rng.js'] = rng;
  const lobby = runModule(mods.get('src/world/gen/lobby.js').body, permissive, {});
  cached = { inCut: lobby.inCut, cutsOf: lobby.cutsOf, hashStr: rng.hashStr };
  return cached;
}

/** The world object the game hands the generator, for the cell space around a level. */
export function worldOf(def, S = 2, N = 16) {
  const { hashStr } = loadCutTools();
  return { seed: def.seed >>> 0, levelSalt: hashStr('level:' + def.id), S, N };
}

/** How many cells around the spawn are void, how close the nearest void cell is, and a map. */
export function cutSurvey(def, W = 32) {
  const { inCut, cutsOf } = loadCutTools();
  const gen = def.gen || {};
  if (gen.type !== 'lobby') return null;
  const cuts = cutsOf(gen.params || {});
  if (!cuts) return null;
  const world = worldOf(def);
  const sg = [Math.floor(def.spawn[0] / 2), Math.floor(def.spawn[1] / 2)];
  const rows = [];
  let voidCells = 0, near = 0, nearest = Infinity;
  for (let dz = -W; dz <= W; dz += 2) {
    let row = '';
    for (let dx = -W; dx <= W; dx++) {
      const gx = sg[0] + dx, gz = sg[1] + dz;
      const v = inCut(world, gen.params, gx, gz) ? 1 : 0;
      if (v) {
        voidCells++;
        nearest = Math.min(nearest, Math.hypot(dx, dz));
      }
      if (Math.abs(dx) <= 4 && Math.abs(dz) <= 4) near += v;
      row += v ? '#' : '.';
    }
    rows.push(row);
  }
  const cells = (W * 2 + 1) * (W + 1);
  return {
    cuts,
    kinds: cuts.map((c) => (c.kind || 'rift') + (c.bridges ? '+br' : '')).join(','),
    rows,
    voidPct: 100 * voidCells / cells,
    nearest: nearest === Infinity ? null : nearest,
    spawnCut: near > 0,
    fall: !!def.fall,
  };
}
