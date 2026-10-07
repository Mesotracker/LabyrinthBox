// ============================================================================
// Boots index.html in the fake browser and hands back the running game.
// ============================================================================
import { installBrowser, stubRenderer } from './dom.mjs';
import { installGlobals } from './globals.mjs';
import { runPage } from './page.mjs';

/** Boot the game. Returns { game, clock, LEVELS, PACKS, problems, warnings, page }. */
export function bootGame({ quiet = true } = {}) {
  installBrowser();
  const clock = installGlobals();
  const g = globalThis;

  const problems = [];
  const warnings = [];
  console.error = (...a) => problems.push({ kind: 'console.error', msg: a.map(String).join(' ') });
  console.warn = (...a) => warnings.push(a.map(String).join(' '));
  clock.onError((kind, e) => problems.push({ kind, msg: (e && e.stack || String(e)).split('\n').slice(0, 5).join(' | ') }));

  const page = runPage({
    afterScript() {
      const THREE = g.__mod && g.__mod['vendor/three/build/three.module.js'];
      if (THREE) stubRenderer(THREE);
    },
  });
  for (const e of page.errors) problems.push({ kind: 'script ' + e.where, msg: (e.error && e.error.stack || String(e.error)).split('\n').slice(0, 5).join(' | ') });
  for (const f of page.missing) problems.push({ kind: 'missing file', msg: f });

  g.document.readyState = 'complete';
  page.fire('DOMContentLoaded');

  const levels = g.__mod && g.__mod['src/levels/index.js'];
  if (!quiet) console.log('booted: ' + (levels ? levels.LEVELS.length : 0) + ' levels');
  return {
    game: g.game,
    clock,
    page,
    problems,
    warnings,
    LEVELS: levels ? levels.LEVELS : [],
    PACKS: levels ? levels.PACKS : [],
    input: g.__mod && g.__mod['src/core/input.js'] && g.__mod['src/core/input.js'].input,
    save: g.__mod && g.__mod['src/game/save.js'] && g.__mod['src/game/save.js'].save,
    dom: g.__dom,
  };
}
