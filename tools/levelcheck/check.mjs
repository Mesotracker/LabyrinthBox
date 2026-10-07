// Check the whole levels/ tree: files listed in packs, ids, generator settings,
// materials, props, goals, stages, spawns who is in the level, and the shape of every
// cut. The list of names that count as valid (materials, props, goals, entity ids,
// items, stage keys, cut fields) is read out of other/level-studio.html, so the studio
// and this checker can never drift apart.
//
//   node tools/levelcheck/check.mjs            every pack
//   node tools/levelcheck/check.mjs corrupt    one pack
import fs from 'node:fs';
import path from 'node:path';
import { readLevel, listLevels, ORDER } from './levelio.mjs';
import { cutSurvey } from './cuts.mjs';
import { ROOT } from './bundle.mjs';

// ------------------------------------------------------------------ the studio's data
const studioFile = path.join(ROOT, 'other/level-studio.html');
const studio = fs.readFileSync(studioFile, 'utf8');
const dataStart = studio.indexOf('const GAME = ') + 'const GAME = '.length;
const GAME = JSON.parse(studio.slice(dataStart, studio.indexOf(';\n', dataStart)));
// The entity ids the game really registers: the ones the studio knows, plus every id
// declared in entities/ (creatures, and the mutated variants the bonus packs add).
function entityIds() {
  const ids = new Set(GAME.entities);
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) { walk(full); continue; }
      if (!f.name.endsWith('.js')) continue;
      const src = fs.readFileSync(full, 'utf8');
      for (const m of src.matchAll(/\bvariant\(\s*'([^']+)'/g)) ids.add(m[1]);
      for (const m of src.matchAll(/\bBUILDERS\s*(?:\.([A-Za-z_$][\w$]*)|\[\s*'([^']+)'\s*\])\s*=/g)) ids.add(m[1] || m[2]);
      for (const m of src.matchAll(/\bENTITY_DEFS\s*(?:\.([A-Za-z_$][\w$]*)|\[\s*'([^']+)'\s*\])\s*=/g)) ids.add(m[1] || m[2]);
    }
  };
  walk(path.join(ROOT, 'entities'));
  return ids;
}

const SETS = {
  mat: new Set(GAME.mats),
  prop: new Set(GAME.props),
  goal: new Set(GAME.goals),
  entity: entityIds(),
  item: new Set(GAME.items),
  cls: new Set(GAME.classes),
  param: new Set([].concat(GAME.params || [], GAME.stageKeys || [],
    Object.keys(GAME.paramDocs), Object.keys(GAME.defaults.lobby))),
};
const STAGE_KEYS = new Set(['text', 'goal', 'item', 'count', 'dist', 'final', 'from', 'reuse', 'effects',
  'survive', 'rideTime', 'pickSafe', 'order', 'code', 'corridor', 'hint', 'clue', 'clueDist', 'clueTitle',
  'choose', 'chooseClue', 'revert', 'angle', 'start', 'flights', 'rise']);
const MAT_KEYS = ['wallMat', 'floorMat', 'ceilMat', 'fixtureMat', 'frameMat', 'waterMat'];
const OPEN_MODES = new Set(GAME.presets.map((p) => p.gen.mode).filter(Boolean)
  .concat(['suburbs', 'city', 'field', 'cave', 'hills', 'courtyard', 'heights', 'lot', 'ocean']));

// ------------------------------------------------------------------ the packs
function loadPacks() {
  const src = fs.readFileSync(path.join(ROOT, 'levels/packs.js'), 'utf8');
  const packs = [];
  const LabLevels = { pack: (p) => packs.push(p), add() {}, packExtra() {} };
  new Function('LabLevels', 'window', 'document', 'console', src)(LabLevels, {}, {}, console);
  return packs;
}

const problems = [];
const warnings = [];
const seenIds = new Map();
const only = process.argv[2];
const packs = loadPacks().filter((p) => !only || p.folder === only || p.id === only);

if (!packs.length) { console.error('no pack matches "' + only + '"'); process.exit(2); }

let levelCount = 0;
for (const pack of packs) {
  const dir = path.join(ROOT, 'levels', pack.folder);
  if (!fs.existsSync(dir)) { problems.push('pack ' + pack.id + ': no folder levels/' + pack.folder); continue; }
  if (!pack.name) warnings.push('pack ' + pack.id + ': has no name');
  if (!pack.blurb) warnings.push('pack ' + pack.id + ': has no blurb for the pack dock');

  const onDisk = listLevels(dir).concat(fs.existsSync(path.join(dir, '_pack.js')) ? ['_pack.js'] : []);
  for (const f of pack.files || []) {
    if (!fs.existsSync(path.join(dir, f))) { problems.push('pack ' + pack.id + ': lists ' + f + ' but levels/' + pack.folder + '/' + f + ' does not exist'); continue; }
    if (f === '_pack.js') continue;
    const { def } = readLevel(path.join(dir, f));
    levelCount++;
    const where = pack.folder + '/' + f;
    const id = def.id;

    // --- identity
    if (!id || !/^[a-z0-9][a-z0-9_-]*$/.test(id)) problems.push(where + ': bad id ' + JSON.stringify(id));
    if (seenIds.has(id)) problems.push(where + ': id "' + id + '" is already used by ' + seenIds.get(id));
    else seenIds.set(id, where);
    for (const k of ['name', 'description', 'intro']) if (!def[k]) warnings.push(where + ': no ' + k);
    if (typeof def.seed !== 'number') problems.push(where + ': seed must be a number');
    if (!Array.isArray(def.spawn) || def.spawn.length !== 2 || !def.spawn.every((n) => typeof n === 'number')) problems.push(where + ': spawn must be [x, z]');
    for (const k of Object.keys(def)) if (!ORDER.includes(k)) problems.push(where + ': unknown field "' + k + '"');

    // --- generator
    const gen = def.gen || {};
    if (!['lobby', 'forest', 'open'].includes(gen.type)) problems.push(where + ': unknown generator type "' + gen.type + '"');
    if (gen.type === 'open' && !OPEN_MODES.has(gen.mode)) problems.push(where + ': unknown open mode "' + gen.mode + '"');
    if (gen.type !== 'open' && gen.mode) warnings.push(where + ': mode is only used by the open generator');
    for (const [k, v] of Object.entries(gen.params || {})) {
      if (!SETS.param.has(k)) problems.push(where + ': generator setting "' + k + '" does not exist');
      if (k === 'props' && v && !SETS.prop.has(v)) problems.push(where + ': no furniture set called "' + v + '"');
      if (MAT_KEYS.includes(k) && v && !SETS.mat.has(v)) problems.push(where + ': no material called "' + v + '"');
      if (k === 'wallMat' && Array.isArray(v) && v.length > 2 && v.length % 2 === 1) problems.push(where + ': wallMat runs need pairs of cells');
    }
    if (gen.type === 'lobby') {
      for (const k of ['height', 'density', 'wallMat', 'floorMat']) if (gen.params[k] === undefined) warnings.push(where + ': lobby levels usually set ' + k);
      if (gen.params.density && !Array.isArray(gen.params.density)) problems.push(where + ': density is a [min, max] pair');
      if (gen.params.cuts !== undefined && !Array.isArray(gen.params.cuts)) problems.push(where + ': cuts must be an array');
    }
    if (gen.params && gen.params.cuts) {
      for (const c of gen.params.cuts) {
        if (!c || typeof c !== 'object') { problems.push(where + ': a cut is not an object'); continue; }
        const kind = c.kind || 'rift';
        if (!['canyon', 'crevice', 'block', 'rift'].includes(kind)) problems.push(where + ': unknown cut kind "' + kind + '"');
        for (const [k, v] of Object.entries(c)) {
          if (k === 'kind') continue;
          if (k === 'axis') { if (!['x', 'z'].includes(v)) problems.push(where + ': a cut axis is "x" or "z"'); continue; }
          if (typeof v !== 'number') problems.push(where + ': cut field ' + k + ' should be a number');
        }
        if (kind === 'block' && !(c.w > 0 && c.h > 0)) problems.push(where + ': a block cut needs w and h');
        if (kind !== 'block' && !(c.length > 0)) problems.push(where + ': a ' + kind + ' cut needs a length');
      }
      if (!def.fall) warnings.push(where + ': has cuts but not fall: true, so falling in is survivable');
    }

    // --- stages
    if (!Array.isArray(def.stages) || !def.stages.length) problems.push(where + ': no stages');
    else {
      def.stages.forEach((s, i) => {
        const at = where + ' stage ' + (i + 1);
        for (const k of Object.keys(s)) if (!STAGE_KEYS.has(k)) problems.push(at + ': unknown key "' + k + '"');
        if (!s.text) warnings.push(at + ': no text');
        if (s.goal && !SETS.goal.has(s.goal)) problems.push(at + ': no goal called "' + s.goal + '"');
        if (!s.goal && !s.item && !s.survive && !s.reuse && !s.from) warnings.push(at + ': neither a goal nor an item, and it does not reuse the last one');
        if (s.item && !SETS.item.has(s.item)) problems.push(at + ': no item called "' + s.item + '"');
        if (s.dist && (!Array.isArray(s.dist) || s.dist.length !== 2 || s.dist[0] > s.dist[1])) problems.push(at + ': dist should be [min, max]');
        if (s.goal === 'stairshaft' && !(s.flights > 0)) warnings.push(at + ': a stairshaft stage needs flights (and usually rise)');
      });
      if (!def.stages[def.stages.length - 1].final) problems.push(where + ': the last stage is not final, so the level cannot be finished');
      if (def.stages.filter((s) => s.final).length > 1) problems.push(where + ': more than one final stage');
    }

    // --- who is in it, and the loot
    for (const [list, what] of [[def.entities, 'entities'], [def.rare, 'rare']]) {
      if (list === undefined) continue;
      if (!Array.isArray(list)) { problems.push(where + ': ' + what + ' must be an array of [id, n]'); continue; }
      for (const e of list) {
        if (!Array.isArray(e) || !e.length) { problems.push(where + ': ' + what + ' entry ' + JSON.stringify(e) + ' should be ["id", n]'); continue; }
        if (!SETS.entity.has(e[0])) problems.push(where + ': no entity called "' + e[0] + '" (see entities/ or other/entity-studio.html)');
        if (typeof e[1] !== 'number' || e[1] <= 0) problems.push(where + ': ' + what + ' entry for ' + e[0] + ' needs a positive number (how many / how likely)');
        if (e.length > 2 && (typeof e[2] !== 'object' || Array.isArray(e[2]))) problems.push(where + ': the third value of an entities entry (' + e[0] + ') is an options object');
        if (e.length > 3) warnings.push(where + ': ' + what + ' entry for ' + e[0] + ' has more values than [id, n, options]');
        if (what === 'rare' && e[1] > 1) warnings.push(where + ': rare chance for ' + e[0] + ' is above 1');
      }
    }
    if (def.loot) for (const [k, v] of Object.entries(def.loot)) {
      if (!['keys', 'water', 'batteries', 'region'].includes(k)) problems.push(where + ': unknown loot kind "' + k + '"');
      const ok = typeof v === 'number' ? v >= 0 : (k === 'region' && Array.isArray(v) && v.length === 4 && v.every((n) => typeof n === 'number'));
      if (!ok) problems.push(where + ': loot ' + k + ' should be a number' + (k === 'region' ? ' or [x, z, w, h]' : ''));
    }
    if (def.cls && !SETS.cls.has(def.cls)) warnings.push(where + ': class "' + def.cls + '" is not one the game shows');

    // --- the shape of the holes
    const survey = cutSurvey(def);
    if (survey) {
      if (survey.spawnCut) problems.push(where + ': a cut covers the spawn point');
      if (survey.voidPct > 35) warnings.push(where + ': ' + survey.voidPct.toFixed(0) + '% of the area around the spawn is void');
      if (survey.cuts.some((c) => (c.kind || 'rift') === 'canyon') && survey.cuts.some((c) => (c.kind || 'rift') === 'canyon' && !c.bridges)) {
        problems.push(where + ': a canyon with no bridges cannot be crossed');
      }
    }
  }
  for (const f of onDisk) {
    if (f === '_pack.js') continue;
    if (!(pack.files || []).includes(f)) warnings.push('levels/' + pack.folder + '/' + f + ' is not listed in packs.js, so the game never loads it');
  }
}

for (const w of warnings) console.log('warning: ' + w);
for (const p of problems) console.log('PROBLEM: ' + p);
console.log('\n' + levelCount + ' level(s) in ' + packs.length + ' pack(s): ' + problems.length + ' problem(s), ' + warnings.length + ' warning(s)');
process.exitCode = problems.length ? 1 : 0;
