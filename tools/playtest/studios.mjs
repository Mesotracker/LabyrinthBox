// ============================================================================
// STUDIO TEST. Opens other/level-studio.html, other/entity-studio.html and
// other/entity-viewer.html in the fake browser, clicks through every preset in
// the two studios, and loads what they print back in: a level file has to
// register through LabLevels.add, an entity file has to evaluate against the
// game's own entity code.
//
//   node tools/playtest/studios.mjs
// ============================================================================
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { installBrowser, stubRenderer } from './dom.mjs';
import { installGlobals } from './globals.mjs';
import { runPage } from './page.mjs';

const PAGES = ['other/level-studio.html', 'other/entity-studio.html', 'other/entity-viewer.html'];

// Each page gets its own process: one fake DOM per page, like one browser tab.
if (!process.argv[2]) {
  let bad = 0;
  for (const page of PAGES) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), page], { stdio: 'inherit' });
    if (r.status !== 0) bad++;
  }
  console.log(`\n${PAGES.length - bad}/${PAGES.length} page(s) clean`);
  process.exit(bad ? 1 : 0);
}

installBrowser();
const clock = installGlobals();
const g = globalThis;

const noise = [];
console.error = (...a) => noise.push('console.error: ' + a.map(String).join(' '));
console.warn = (...a) => noise.push('console.warn: ' + a.map(String).join(' '));
clock.onError((kind, e) => noise.push(kind + ': ' + (e && e.stack || String(e)).split('\n').slice(0, 3).join(' | ')));

let failed = 0;

for (const file of [process.argv[2]]) {
  noise.length = 0;
  const page = runPage({ file, afterScript() { const T = g.__mod && g.__mod['vendor/three/build/three.module.js']; if (T) stubRenderer(T); } });
  g.document.readyState = 'complete';
  page.fire('DOMContentLoaded');
  clock.pump(20);

  const byId = g.__dom.byId;
  const $ = (id) => byId.get(id);
  const outputs = [];
  // the level studio picks presets from a <select>, the entity studio from a row of buttons
  const select = $('preset');
  const buttons = $('presets');
  const options = select ? select.children.filter((o) => o.value) : (buttons ? buttons.children.filter((b) => b.tagName === 'BUTTON') : []);

  for (const o of options) {
    if (select) { select.value = o.value; select.dispatchEvent({ type: 'change', target: select }); }
    else o.click();
    clock.pump(4);
    const out = $('file');
    outputs.push({ label: o.value || o.textContent, text: out ? out.textContent : '' });
  }
  if (/level-studio/.test(file)) for (const id of ['addcut', 'addstage', 'addent', 'addrare']) { const el = $(id); if (el) { el.click(); clock.pump(2); } }
  if (/studio/.test(file)) { const out = $('file'); outputs.push({ label: 'after edits', text: out ? out.textContent : '' }); }

  let broken = 0;
  for (const o of outputs) {
    if (!o.text || !o.text.trim()) { console.log('  EMPTY output for ' + o.label); broken++; continue; }
    try {
      if (/level-studio/.test(file)) {
        const reg = { added: [], pack() {}, packExtra() {} , add(folder, def) { this.added.push(def); } };
        new Function('LabLevels', o.text)(reg);
        const def = reg.added[reg.added.length - 1];
        if (!def || !def.id || !def.gen || !def.stages) { console.log('  INCOMPLETE level from ' + o.label); broken++; }
      } else {
        new Function('__mod', 'window', 'document', o.text)(g.__mod, g, g.document);
      }
    } catch (e) { console.log('  BROKEN output from ' + o.label + ': ' + e.message); broken++; }
  }

  const errs = page.errors.length + page.missing.length + noise.length;
  console.log(`${errs || broken ? 'FAIL' : 'ok  '} ${file.padEnd(32)} ${options.length} preset(s), ${outputs.length} file(s) written, ${broken} broken`);
  for (const e of page.errors) console.log('      script ' + e.where + ': ' + (e.error && e.error.stack || '').split('\n').slice(0, 3).join(' | '));
  for (const m of page.missing) console.log('      missing file: ' + m);
  for (const n of [...new Set(noise)].slice(0, 8)) console.log('      ' + n.slice(0, 260));
  if (errs || broken) failed++;
}

process.exit(failed ? 1 : 0);
