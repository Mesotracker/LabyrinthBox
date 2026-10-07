// Regression check: load the levels the way the browser does and compare every field
// with the snapshot of the original single-file game (data/original-*.json, written by
// snapshot.mjs). Runs in a few hundred ms.
//   node tools/levelcheck/verify.mjs
// Load the game's levels the way the browser does (levels/loader.js ->
// levels/core.js + levels/packs.js + every level file -> bundle module) and
// compare the result with the snapshot taken before the split.
import fs from 'node:fs';
import path from 'node:path';
import { readBundle, runModule, stubMods, ROOT } from './bundle.mjs';

const DATA = path.join(ROOT, 'tools/levelcheck/data');
const { mods } = readBundle(path.join(ROOT, 'index.html'));

// ------------------------------------------------------------------ the page
const warnings = [];
const errors = [];
const documentStub = {
  currentScript: { src: 'file://' + ROOT + '/levels/loader.js' },
  createElement: () => ({ style: {}, appendChild() {}, textContent: '', setAttribute() {} }),
  getElementById: () => null,
  body: { appendChild() {} },
};
const win = { console: { warn: (m) => warnings.push(String(m)), error: (m) => errors.push(String(m)), log: () => {} } };
win.window = win;
win.document = documentStub;

function runScript(body, name) {
  const fn = new Function('window', 'document', 'console', 'LabLevels', body + '\n//# sourceURL=' + name);
  fn(win, documentStub, win.console, win.LabLevels);
}

for (const f of ['core.js', 'packs.js']) runScript(fs.readFileSync(path.join(ROOT, 'levels', f), 'utf8'), 'levels/' + f);
const LL = win.LabLevels;
const packs = LL.packs.map((p) => ({ ...p }));
win.LabLevels = LL;

let levelFiles = 0;
const loaded = [];
for (const p of packs) {
  const dir = p.folder || p.id;
  for (const f of p.files || []) {
    const file = path.join(ROOT, 'levels', dir, f);
    if (!fs.existsSync(file)) { loaded.push('MISSING ' + dir + '/' + f); continue; }
    try {
      runScript(fs.readFileSync(file, 'utf8'), 'levels/' + dir + '/' + f);
      levelFiles++;
    } catch (e) {
      loaded.push('ERROR ' + dir + '/' + f + ': ' + e.message);
    }
  }
}

// ------------------------------------------------------------------ the game
const M = stubMods();
M['src/world/gen/lobby.js'] = { makeLobbyGen: (o) => ({ id: 'lobby', params: JSON.parse(JSON.stringify(o)) }) };
M['src/world/gen/forest.js'] = { makeForestGen: (o) => ({ id: 'forest', params: JSON.parse(JSON.stringify(o || {})) }) };
M['src/world/gen/open.js'] = { makeOpenGen: (mode, o) => ({ id: 'open', mode, params: JSON.parse(JSON.stringify(o || {})) }) };
M['src/world/props.js'] = { PROP_SETS: {} };
M['src/gfx/materials.js'] = { MATS: {} };
M['src/game/loot.js'] = { ITEM_NAMES: {} };

const indexMod = runModule(mods.get('src/levels/index.js').body, M, { window: win, document: documentStub, console: win.console });
const packsMod = runModule(mods.get('src/levels/packs.js').body, { ...M, 'src/levels/index.js': indexMod }, { window: win, document: documentStub, console: win.console });

const LEVELS = indexMod.LEVELS;

// ------------------------------------------------------------------ compare
const before = JSON.parse(fs.readFileSync(path.join(DATA, 'original-levels.json'), 'utf8'));
const beforePacks = JSON.parse(fs.readFileSync(path.join(DATA, 'original-packs.json'), 'utf8'));
// the snapshot harness named the open generator's mode "kind"; the real module calls it "mode"
for (const l of before) if (l.gen && l.gen.id === 'open') { l.gen.mode = l.gen.kind; delete l.gen.kind; }

const norm = (v) => {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(norm);
  const o = {};
  for (const k of Object.keys(v)) { const x = norm(v[k]); if (!(Array.isArray(x) && !x.length && v[k] === undefined)) o[k] = x; }
  return o;
};
const intended = JSON.parse(fs.readFileSync(path.join(DATA, 'intended.json'), 'utf8'));
const diffs = [];
const skipped = [];
function allow(where) {
  if (intended._packs && intended._packs.includes(where)) return true;
  // a path recorded by regen.mjs as an intended content update is not a difference
  const parts = where.split('.');
  const id = parts[0];
  const list = intended[id];
  if (!list) return false;
  const path = parts.slice(1).join('.');
  return list.some((it) => path === it || path.startsWith(it + '.'));
}
function eq(a, b, where) {
  if (where !== 'PACKS' && a === '<cycle>') { skipped.push(where); return; }      // snapshot placeholder
  if (where.endsWith('.builtin') && a === undefined && b === false) return;      // main is builtin, the rest are bonus
  if (allow(where)) { skipped.push(where); return; }                             // intended content update

  if (typeof a === 'number' && typeof b === 'number') {
    if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a))) diffs.push(`${where}: ${a} != ${b}`);
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) { if (!allow(where)) diffs.push(`${where}: length ${a.length} != ${b.length}`); return; }
    for (let i = 0; i < a.length; i++) eq(a[i], b[i], where + '[' + i + ']');
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const av = a[k], bv = b[k];
      if ((av === undefined && Array.isArray(bv) && !bv.length) || (bv === undefined && Array.isArray(av) && !av.length)) continue;
      if (av === undefined || bv === undefined) {
        const at = where + '.' + k;
        const builtinDefault = at.endsWith('.builtin') && av === undefined && bv === false;
        if (!builtinDefault && !allow(at)) diffs.push(`${at}: ${JSON.stringify(av)} != ${JSON.stringify(bv)}`);
        continue;
      }
      eq(av, bv, where + '.' + k);
    }
    return;
  }
  if (a !== b && !(allow(where) && !a && (b === undefined || (Array.isArray(b) && !b.length)))) diffs.push(`${where}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
}

if (LEVELS.length !== before.length) diffs.push(`LEVELS.length ${LEVELS.length} != ${before.length}`);
for (let i = 0; i < Math.min(LEVELS.length, before.length); i++) {
  const after = JSON.parse(JSON.stringify({ ...LEVELS[i], gen: LEVELS[i].gen(), surface: LEVELS[i].surface ? '<fn>' : undefined }, (k, v) => (typeof v === 'function' ? '<fn>' : v)));
  eq(norm(before[i]), norm(after), before[i].id);
}
const afterPacks = JSON.parse(JSON.stringify(packsMod.PACKS));
eq(beforePacks, afterPacks, 'PACKS');

console.log('level files loaded:', levelFiles, '/', packs.reduce((a, p) => a + (p.files || []).length, 0));
console.log('levels in LEVELS :', LEVELS.length, 'snapshot:', before.length);
console.log('packs            :', afterPacks.map((p) => p.id).join(','));
console.log('tracks           :', JSON.stringify(LEVELS.reduce((a, l) => (a[l.track] = (a[l.track] || 0) + 1, a), {})));
if (loaded.length) console.log('file problems:\n  ' + loaded.join('\n  '));
if (skipped.length) console.log('intended content changes ignored:', new Set(skipped.map((s2) => s2.split('.').slice(0, 2).join('.'))).size, 'paths in', new Set(skipped.map((s2) => s2.split('.')[0])).size, 'levels');
if (diffs.length) {
  console.log('DIFFERENCES (' + diffs.length + '):');
  for (const d of diffs.slice(0, 40)) console.log('  ' + d);
  process.exitCode = 1;
} else console.log('OK: every level and pack field matches the pre-split data');
if (warnings.length) console.log('warnings:\n  ' + warnings.join('\n  '));
if (errors.length) console.log('errors:\n  ' + errors.join('\n  '));
