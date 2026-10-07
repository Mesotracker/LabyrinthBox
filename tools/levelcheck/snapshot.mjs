// Snapshot the level data out of the ORIGINAL single-file game (the commit before the
// levels were split into files) so the split and any later change can be compared with
// what the game used to build. Writes tools/levelcheck/data/original-*.json.
//
//   node tools/levelcheck/snapshot.mjs [path/to/original-index.html]
//   LB_BEFORE=... node tools/levelcheck/snapshot.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readBundle, runModule, stubMods, ROOT } from './bundle.mjs';
import { beforeFile } from './before.mjs';

const DATA = path.join(ROOT, 'tools/levelcheck/data');
const before = beforeFile(process.argv[2]);
const { mods } = readBundle(before);

const M = stubMods();
M['src/world/gen/lobby.js'] = { makeLobbyGen: (o) => ({ id: 'lobby', params: JSON.parse(JSON.stringify(o)) }) };
M['src/world/gen/forest.js'] = { makeForestGen: (o) => ({ id: 'forest', params: JSON.parse(JSON.stringify(o || {})) }) };
M['src/world/gen/open.js'] = { makeOpenGen: (kind, o) => ({ id: 'open', kind, params: JSON.parse(JSON.stringify(o || {})) }) };
M['src/world/props.js'] = { PROP_SETS: {} };
M['src/game/loot.js'] = { ITEM_NAMES: {}, __itemNames: null };

const props = M['src/world/props.js'].PROP_SETS;
const items = M['src/game/loot.js'].ITEM_NAMES;
const exported = {};

const order = ['src/levels/phobia.js', 'src/levels/index.js', 'src/levels/packs.js'];
for (const name of order) {
  const src = mods.get(name);
  if (!src) throw new Error('missing module ' + name);
  exported[name] = runModule(src.body, M, {});
  M[name] = exported[name];   // later modules import each other through __mod
}

const LEVELS = exported['src/levels/index.js'].LEVELS;
const PACKS = exported['src/levels/packs.js'].PACKS;

// Turn the runtime level objects into plain data, resolving gen descriptors by
// calling the generator factories (the stubs make that cheap and pure).
function plain(v, seen = new Set()) {
  if (v === null || typeof v !== 'object') return v;
  if (typeof v === 'function') return '<fn>';
  if (seen.has(v)) return '<cycle>';
  seen.add(v);
  if (Array.isArray(v)) return v.map((x) => plain(x, seen));
  const out = {};
  for (const k of Object.keys(v)) out[k] = plain(v[k], seen);
  seen.delete(v);
  return out;
}

const levels = LEVELS.map((l) => {
  const lv = plain(l);
  lv.gen = plain(l.gen());            // { id: 'lobby'|'forest', params } | { id:'open', kind, params }
  if (typeof l.surface === 'function') lv.surface = '<fn>';
  return lv;
});

fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA, 'original-levels.json'), JSON.stringify(levels, null, 1));
fs.writeFileSync(path.join(DATA, 'original-packs.json'), JSON.stringify(plain(PACKS), null, 1));
fs.writeFileSync(path.join(DATA, 'original-extras.json'), JSON.stringify({ props: plain(props), items: plain(items) }, null, 1));
console.log('levels', levels.length, 'packs', PACKS.map((p) => p.id).join(','));
console.log('tracks', JSON.stringify(levels.reduce((a, l) => (a[l.track] = (a[l.track] || 0) + 1, a), {})));
console.log('level ids', levels.filter((l) => l.track === 'corruption').slice(0, 3).map((l) => l.id).join(','));
const bad = levels.filter((l) => !l.gen || !l.gen.id);
console.log('levels with unreadable gen:', bad.map((l) => l.id).join(',') || 'none');
