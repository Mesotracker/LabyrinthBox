// Regenerate levels/<pack>/<level>.js from the data extracted out of the pre-split bundle,
// applying the Corruption and Playground content updates:
//
//   Corruption  canyons, crevices and block cuts (a level that failed to load a piece of
//               itself) plus the broken-file glitch amount, `corrupt`.
//   Playground  stair levels become one continuous climb in one narrow stair shaft, and
//               slide levels keep their old stages (the slides themselves are the engine's).
import fs from 'node:fs';
import path from 'node:path';
import { readBundle, runModule, stubMods, ROOT } from './bundle.mjs';
import { beforeFile } from './before.mjs';

const OUT = path.join(ROOT, 'levels');
const DATA = path.join(ROOT, 'tools/levelcheck/data');
const load = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const CUTS = load('cuts.json');
const GLITCH = load('glitch.json');
const CONTENT = load('content.json');
const TEXT = load('text.json');

// the original single-file game, used only as the source of the level data
const { html, mods } = readBundle(beforeFile());

const M = stubMods();
M['src/world/gen/lobby.js'] = { makeLobbyGen: (o) => ({ id: 'lobby', params: JSON.parse(JSON.stringify(o)) }) };
M['src/world/gen/forest.js'] = { makeForestGen: (o) => ({ id: 'forest', params: JSON.parse(JSON.stringify(o || {})) }) };
M['src/world/gen/open.js'] = { makeOpenGen: (mode, o) => ({ id: 'open', mode, params: JSON.parse(JSON.stringify(o || {})) }) };
M['src/world/props.js'] = { PROP_SETS: {} };
M['src/game/loot.js'] = { ITEM_NAMES: {} };

const exported = {};
for (const name of ['src/levels/phobia.js', 'src/levels/index.js', 'src/levels/packs.js']) {
  exported[name] = runModule(mods.get(name).body, M, {});
  M[name] = exported[name];
}
const RAW_LEVELS = exported['src/levels/index.js'].LEVELS;
const RAW_PACKS = exported['src/levels/packs.js'].PACKS;

// ---------------------------------------------------------------- helpers
const COLOR_KEYS = new Set(['color', 'top', 'horizon', 'glow']);
const num = (n) => {
  if (Number.isInteger(n)) return String(n);
  const r = parseFloat(n.toPrecision(12));
  return String(r);
};
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
const slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'level';

function isPlain(v) { return v && typeof v === 'object' && !Array.isArray(v); }
const MAX_INLINE = 72;
/** One-line form of a value, or null when any part of it does not fit on one line. */
function inline(v, key) {
  if (typeof v === 'string') return q(v);
  if (typeof v === 'number') {
    if (COLOR_KEYS.has(String(key).split('.').pop()) && Number.isInteger(v) && v >= 0 && v <= 0xffffff) return '0x' + v.toString(16).padStart(6, '0');
    return num(v);
  }
  if (typeof v === 'boolean' || v === null) return JSON.stringify(v);
  if (v === undefined) return 'undefined';
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    const parts = [];
    for (const x of v) {
      const s = inline(x, key);
      if (s === null) return null;
      parts.push(s);
    }
    const body = parts.join(', ');
    return body.length <= MAX_INLINE ? '[' + body + ']' : null;
  }
  if (isPlain(v)) {
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    const parts = [];
    for (const k of keys) {
      const s = inline(v[k], (key || '') + '.' + k);
      if (s === null) return null;
      parts.push(k + ': ' + s);
    }
    const body = parts.join(', ');
    return body.length <= MAX_INLINE ? '{ ' + body + ' }' : null;
  }
  return null;
}
function fmt(v, indent = 0, key = '') {
  const one = inline(v, key);
  if (one !== null) return one;
  const pad = '  '.repeat(indent), pad2 = '  '.repeat(indent + 1);
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[\n' + v.map((x) => pad2 + fmt(x, indent + 1, key)).join(',\n') + ',\n' + pad + ']';
  }
  const keys = Object.keys(v);
  if (!keys.length) return '{}';
  return '{\n' + keys.map((k) => pad2 + k + ': ' + fmt(v[k], indent + 1, (key || '') + '.' + k)).join(',\n') + ',\n' + pad + '}';
}

// Canonical field order so every level file reads the same way.
const ORDER = ['id', 'name', 'subtitle', 'place', 'cls', 'passive', 'seed', 'description', 'intro',
  'spawn', 'wet', 'wade', 'outdoor', 'fall', 'dark', 'adrenaline', 'puzzle', 'cover', 'leviathan',
  'ambience', 'hum', 'flashes', 'fogBanks', 'dayNight', 'envLamps', 'surface', 'ambientLight', 'bounce',
  'lightRange', 'fog', 'sky', 'tuning', 'current', 'phobia', 'corrupt', 'gen', 'stages', 'entities', 'rare', 'loot'];

const PACK_META = {
  main: { folder: 'base', label: 'Base campaign', prefix: null },
  phobia: { folder: 'phobia', label: 'The Phobia Wing', prefix: 'phi' },
  corruption: { folder: 'corrupt', label: 'Corruption', prefix: 'delta' },
  playground: { folder: 'playground', label: 'Playground', prefix: 'omega' },
};

// ---------------------------------------------------------------- content updates
// What changed in a level, as paths, so the checker can tell an intended change from a
// mistake. `before` is the level as extracted from the old single-file game.
const intended = {};
function changedPaths(before, after, prefix, out = []) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  for (const k of keys) {
    const b = before ? before[k] : undefined, a = after ? after[k] : undefined;
    const at = prefix ? prefix + '.' + k : k;
    if (b && a && typeof b === 'object' && typeof a === 'object' && !Array.isArray(b) && !Array.isArray(a)) changedPaths(b, a, at, out);
    else if (JSON.stringify(b) !== JSON.stringify(a)) out.push(at);
  }
  return out;
}

const notes = [];       // lines printed after the run

function applyContent(lv) {
  const before = JSON.parse(JSON.stringify(lv));
  const g = lv.gen || {};

  // --- Corruption: cuts in the floor and the broken-file glitch amount ----------------
  if (CUTS[lv.id]) {
    g.params = g.params || {};
    if (g.params.cliff) {
      // the old single rift becomes an explicit canyon: same shape, plus bridges
      const c = g.params.cliff;
      delete g.params.cliff;
      g.params.cuts = [{ kind: 'canyon', axis: c.axis, mid: c.mid, length: c.length, offset: c.offset, width: c.width, wobble: c.wobble, bridges: 2, bridgeSpan: 4, jag: 3 }, ...CUTS[lv.id]];
    } else {
      g.params.cuts = CUTS[lv.id];
    }
    lv.fall = true;                    // a cut has no bottom: falling into one is fatal
  }
  if (GLITCH[lv.id] !== undefined) lv.corrupt = GLITCH[lv.id];
  // the description has to describe what is actually there (canyons, crevices, holes)
  const t = TEXT[lv.id];
  if (t) for (const k of Object.keys(t)) lv[k] = t[k];

  // --- Playground: one stairwell per stair level, and the text to match --------------
  const c = CONTENT[lv.id];
  if (c) {
    if (c.stagesKeep !== undefined) {
      lv.stages = lv.stages.slice(0, c.stagesKeep).concat(JSON.parse(JSON.stringify(c.stagesAdd || [])));
    }
    for (const k of Object.keys(c)) {
      if (k === 'genParams') { Object.assign(lv.gen.params, c.genParams); continue; }
      if (k === 'stagesKeep' || k === 'stagesAdd') continue;
      lv[k] = JSON.parse(JSON.stringify(c[k]));
    }
  }

  const paths = changedPaths(before, JSON.parse(JSON.stringify(lv)), '');
  if (paths.length) intended[lv.id] = paths;
  return lv;
}

// ---------------------------------------------------------------- level files
const manifest = {};
let written = 0;

for (const pack of RAW_PACKS) {
  const meta = PACK_META[pack.id];
  if (!meta) throw new Error('unknown pack ' + pack.id);
  const levels = RAW_LEVELS.filter((l) => l.track === pack.id);
  const dir = path.join(OUT, meta.folder);
  fs.mkdirSync(dir, { recursive: true });
  manifest[meta.folder] = [];
  const used = new Set();

  levels.forEach((raw, index) => {
    let lv = {};
    const nn = String(index + 1).padStart(2, '0');
    const baseSlug = slug(raw.subtitle);
    let file = meta.prefix
      ? `${meta.prefix}-${nn}-${baseSlug}`
      : `${nn}-${slug(raw.id)}-${baseSlug}`;
    while (used.has(file)) file += 'x';
    used.add(file);
    file += '.js';

    // no `track` in the file: the pack folder is the track
    for (const k of ORDER) {
      if (k === 'track') continue;
      if (!(k in raw)) continue;
      let v = raw[k];
      if (k === 'gen') {
        const g = raw.gen();
        if (g.id === 'open') v = { type: 'open', mode: g.mode, params: g.params };
        else v = { type: g.id, params: g.params };
      } else if (k === 'surface' && typeof raw.surface === 'function') {
        v = raw.surface(0, 0);            // every surface in the game is a constant
      }
      lv[k] = v;
    }
    const missing = Object.keys(raw).filter((k) => k !== 'track' && !(k in lv));
    if (missing.length) throw new Error(raw.id + ' lost fields: ' + missing.join(','));
    lv = applyContent(JSON.parse(JSON.stringify(lv)));
    const extra = Object.keys(lv).filter((k) => !ORDER.includes(k));
    if (extra.length) throw new Error(raw.id + ' unknown fields: ' + extra.join(','));

    const stageLines = (lv.stages || []).map((s, i) => {
      const what = s.goal ? s.goal : (s.item ? `find ${s.item}` : 'stage');
      const n = s.count ? ` x${s.count}` : '';
      const fin = s.final ? ' (final)' : '';
      const opts = [];
      if (s.flights) opts.push(`${s.flights} flights`);
      if (s.rise) opts.push(`rise ${s.rise}`);
      const kind = s.survive ? `survive ${s.survive}s` : `${what}${n}${opts.length ? ' - ' + opts.join(', ') : ''}`;
      return `//    ${i + 1}. ${s.text}  [${kind}${fin}]`;
    }).join('\n');
    const cuts = (lv.gen.params && lv.gen.params.cuts) || [];
    const cutLine = cuts.length
      ? `, ${cuts.length} cut${cuts.length > 1 ? 's' : ''} in the floor (${cuts.map((c) => c.kind || 'rift').join(', ')})`
      : '';
    const glitch = lv.corrupt ? `, file corruption ${lv.corrupt}` : '';

    const header =
      `// ${'-'.repeat(74)}\n` +
      `// ${lv.name}${lv.subtitle ? ' - ' + lv.subtitle : ''}  (id: ${lv.id}, ${meta.label})\n` +
      `// ${lv.description}\n` +
      `//\n` +
      `// Scene: ${Object.keys(lv.gen.params || {}).length} generator settings, ${(lv.entities || []).length} entity groups, ` +
      `${(lv.rare || []).length} rare spawns, loot ${Object.entries(lv.loot).map(([k, v]) => k + ' ' + v).join('/')}${cutLine}${glitch}\n` +
      (stageLines ? stageLines + '\n' : '') +
      `//\n` +
      `// One level per file: change anything here and reload the game. Field list:\n` +
      `// levels/README.md  -  build levels without code: other/level-studio.html\n` +
      `// ${'-'.repeat(74)}\n`;

    const body = ORDER.filter((k) => k in lv)
      .map((k) => `  ${k}: ${fmt(lv[k], 1, k)},`)
      .join('\n');

    fs.writeFileSync(path.join(dir, file), header + `LabLevels.add(${q(meta.folder)}, {\n` + body + '\n});\n');
    manifest[meta.folder].push(file);
    written++;
  });
}

// the Corruption pack moved folder (levels/corruption -> levels/corrupt)
fs.rmSync(path.join(OUT, 'corruption'), { recursive: true, force: true });

// ---------------------------------------------------------------- pack extras
const seg = (from, to) => {
  const a = html.indexOf(`__mod['${from}']`);
  const b = html.indexOf(`__mod['${to}']`);
  return html.slice(a, b);
};
const phobiaSeg = seg('src/levels/phobia.js', 'src/levels/index.js');
const extrasBlock = phobiaSeg.slice(phobiaSeg.indexOf('Object.assign(PROP_SETS, {'), phobiaSeg.indexOf('\n});', phobiaSeg.indexOf('Object.assign(PROP_SETS, {')) + 4);
const innerBlock = extrasBlock.replace('Object.assign(PROP_SETS, {', '').replace(/\}\);$/, '').trim();

fs.writeFileSync(path.join(OUT, 'phobia', '_pack.js'),
`// Extra furniture sets used by the Phobia Wing levels (attic, morgue, nursery, ...).
// A pack can add anything the levels of that pack need: prop sets, item names,
// and (see levels/README.md) materials, entity spawn rates, ...
LabLevels.packExtra('phobia', {
  items: { fuse: 'Fuse', reel: 'Film Reel' },
  props: {
${innerBlock}
  },
});
`);

const theater = innerBlock.slice(innerBlock.indexOf('  theater: {'), innerBlock.indexOf('\n  },', innerBlock.indexOf('  theater: {')) + 5);
const nursery = innerBlock.slice(innerBlock.indexOf('  nursery: {'), innerBlock.indexOf('\n  },', innerBlock.indexOf('  nursery: {')) + 5);
fs.writeFileSync(path.join(OUT, 'playground', '_pack.js'),
`// The Playground levels use two furniture sets that live in the Phobia Wing pack
// file; a level pack is self-contained, so they are repeated here.
LabLevels.packExtra('playground', {
  items: { ticket: 'Ride Ticket', token: 'Arcade Token' },
  props: {
${nursery}
${theater}
  },
});
`);

// ---------------------------------------------------------------- pack manifest
const P = (i) => RAW_PACKS[i];
const packFile =
`// ===========================================================================
// PACKS. One entry per level pack. The folder on disk is \`folder\`; the id is
// what the save file, the pack dock and the unlock chain use (they are usually
// the same; the Corruption pack keeps its old id so saved games still load).
// \`files\` is the load order of levels/<folder>/ - add a level by dropping the
// file in that folder and listing its file name here (other/level-studio.html
// prints the line for you).
//
//   id           save-file key ('main' is the campaign, always installed)
//   folder       the folder under levels/
//   name / tab   what the pack is called on the start screen
//   blurb        the line under the name in the pack dock
//   win          the two lines shown when the pack is finished
//   builtin      true = never needs installing
//   bonus        true = installed from the pack dock
//   size         the size shown in the pack dock
// ===========================================================================
LabLevels.pack({
  id: 'main',
  folder: 'base',
  name: ${q(P(0).name)},
  tab: ${q(P(0).tab)},
  builtin: true,
  blurb: ${q(P(0).blurb)},
  win: ${fmt(P(0).win)},
  files: [
${manifest.base.map((f) => `    ${q(f)},`).join('\n')}
  ],
});
LabLevels.pack({
  id: 'phobia',
  folder: 'phobia',
  name: ${q(P(1).name)},
  tab: ${q(P(1).tab)},
  size: ${q(P(1).size)},
  blurb: ${q(P(1).blurb)},
  win: ${fmt(P(1).win)},
  files: [
    '_pack.js',
${manifest.phobia.map((f) => `    ${q(f)},`).join('\n')}
  ],
});
LabLevels.pack({
  id: 'corruption',
  folder: 'corrupt',
  name: ${q(P(2).name)},
  tab: ${q(P(2).tab)},
  size: ${q(P(2).size)},
  bonus: true,
  blurb: ${q('Thirty of the original levels, left to rot for a thousand years. Canyons torn through the floors, crevices you can fall into, strong currents, and things that grew too many limbs. Some of them no longer load properly.')},
  win: ${fmt(P(2).win)},
  files: [
${manifest.corrupt.map((f) => `    ${q(f)},`).join('\n')}
  ],
});
LabLevels.pack({
  id: 'playground',
  folder: 'playground',
  name: ${q(P(3).name)},
  tab: ${q(P(3).tab)},
  size: ${q(P(3).size)},
  bonus: true,
  blurb: ${q('Thirty bright, loud places: waterslides of opaque plastic where only one in four lets you live, one narrow stairwell after another, and every ride the park ever built.')},
  win: ${fmt(P(3).win)},
  files: [
    '_pack.js',
${manifest.playground.map((f) => `    ${q(f)},`).join('\n')}
  ],
});
`;
fs.writeFileSync(path.join(OUT, 'packs.js'), packFile);

fs.writeFileSync(path.join(DATA, 'manifest.json'), JSON.stringify(manifest, null, 1));
// pack-level content: the Corruption and Playground blurbs were rewritten with the packs
intended._packs = ['PACKS[2].blurb', 'PACKS[3].blurb'];
fs.writeFileSync(path.join(DATA, 'intended.json'), JSON.stringify(intended, null, 1));
console.log('wrote', written, 'level files');
for (const k of Object.keys(manifest)) console.log(' ', k, manifest[k].length);
console.log('levels with intended content changes:', Object.keys(intended).length);
for (const id of Object.keys(intended)) console.log('  ' + id + ':', intended[id].join(', '));
for (const n of notes) console.log('note:', n);
