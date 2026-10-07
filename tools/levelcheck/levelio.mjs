// Read and rewrite levels/<pack>/<level>.js files: eval the file with a registry
// stub to get the level, then write it back with the canonical formatting.
import fs from 'node:fs';

export const COLOR_KEYS = new Set(['color', 'top', 'horizon', 'glow']);
export const ORDER = ['id', 'name', 'subtitle', 'place', 'cls', 'passive', 'seed', 'description', 'intro',
  'spawn', 'wet', 'wade', 'outdoor', 'fall', 'dark', 'adrenaline', 'puzzle', 'cover', 'leviathan',
  'ambience', 'hum', 'flashes', 'fogBanks', 'dayNight', 'envLamps', 'surface', 'ambientLight', 'bounce',
  'lightRange', 'fog', 'sky', 'tuning', 'current', 'phobia', 'corrupt', 'gen', 'stages', 'entities', 'rare', 'loot'];

export const PACK_META = {
  base: { label: 'Base campaign', prefix: null },
  phobia: { label: 'The Phobia Wing', prefix: 'phi' },
  corrupt: { label: 'Corruption', prefix: 'delta' },
  corruption: { label: 'Corruption', prefix: 'delta' },
  playground: { label: 'Playground', prefix: 'omega' },
};

export const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
export const slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'level';
export const num = (n) => (Number.isInteger(n) ? String(n) : String(parseFloat(n.toPrecision(12))));
export const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v);
const MAX_INLINE = 72;

export function inline(v, key) {
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
    for (const x of v) { const s = inline(x, key); if (s === null) return null; parts.push(s); }
    const body = parts.join(', ');
    return body.length <= MAX_INLINE ? '[' + body + ']' : null;
  }
  if (isPlain(v)) {
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    const parts = [];
    for (const k of keys) { const s = inline(v[k], (key || '') + '.' + k); if (s === null) return null; parts.push(k + ': ' + s); }
    const body = parts.join(', ');
    return body.length <= MAX_INLINE ? '{ ' + body + ' }' : null;
  }
  return null;
}

export function fmt(v, indent = 0, key = '') {
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

/** The comment block every generated level file starts with. */
export function header(lv, folder) {
  const meta = PACK_META[folder] || { label: folder };
  const stageLines = (lv.stages || []).map((s, i) => {
    const what = s.goal ? s.goal : (s.item ? `find ${s.item}` : 'stage');
    const n = s.count ? ` x${s.count}` : '';
    const fin = s.final ? ' (final)' : '';
    const kind = s.survive ? `survive ${s.survive}s` : `${what}${n}`;
    return `//    ${i + 1}. ${s.text}  [${kind}${fin}]`;
  }).join('\n');
  const cuts = (lv.gen && lv.gen.params && lv.gen.params.cuts) || [];
  return `${'// ' + '-'.repeat(74)}\n` +
    `// ${lv.name}${lv.subtitle ? ' - ' + lv.subtitle : ''}  (id: ${lv.id}, ${meta.label})\n` +
    `// ${lv.description}\n` +
    `//\n` +
    `// Scene: ${Object.keys((lv.gen && lv.gen.params) || {}).length} generator settings, ` +
    `${(lv.entities || []).length} entity groups, ${(lv.rare || []).length} rare spawns, ` +
    `loot ${Object.entries(lv.loot || {}).map(([k, v]) => k + ' ' + v).join('/')}` +
    `${cuts.length ? `, ${cuts.length} cut(s) in the floor` : ''}${lv.corrupt ? `, file corruption ${lv.corrupt}` : ''}\n` +
    (stageLines ? stageLines + '\n' : '') +
    `//\n` +
    `// One level per file: change anything here and reload the game. Field list:\n` +
    `// levels/README.md  -  build levels without code: other/level-studio.html\n` +
    `${'// ' + '-'.repeat(74)}\n`;
}

/** Read one level file: the definition is the object handed to LabLevels.add. */
export function readLevel(file) {
  const src = fs.readFileSync(file, 'utf8');
  let captured = null;
  const LabLevels = { add: (folder, def) => { captured = { folder, def }; }, pack: () => {}, packExtra: () => {} };
  new Function('LabLevels', 'window', 'document', 'console', src)(LabLevels, {}, {}, { warn: () => {}, log: console.log, error: console.error });
  if (!captured) throw new Error('no LabLevels.add in ' + file);
  return captured;                        // { folder, def }
}

export function writeLevel(file, folder, def) {
  const fields = ORDER.filter((k) => k in def);
  const unknown = Object.keys(def).filter((k) => !ORDER.includes(k));
  if (unknown.length) throw new Error(def.id + ': unknown fields ' + unknown.join(','));
  const body = fields.map((k) => `  ${k}: ${fmt(def[k], 1, k)},`).join('\n');
  fs.writeFileSync(file, header(def, folder) + `LabLevels.add(${q(folder)}, {\n` + body + '\n});\n');
}

export function listLevels(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.js') && !f.startsWith('_')).sort();
}
