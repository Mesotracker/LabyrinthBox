// Split the game bundle in index.html into its modules so the level data can be
// evaluated (with stubs) outside a browser.
import fs from 'node:fs';

import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export function readBundle(path = ROOT + 'index.html') {
  const html = fs.readFileSync(path, 'utf8');
  const re = /\n__mod\['([^']+)'\] = \(function \(\) \{\n  const __e = \{\};\n/g;
  const marks = [];
  let m;
  while ((m = re.exec(html))) marks.push({ name: m[1], start: m.index, bodyStart: re.lastIndex });
  const endMarker = '\n  return __e;\n})();';
  const mods = new Map();
  for (let i = 0; i < marks.length; i++) {
    const name = marks[i].name;
    let end = html.indexOf(endMarker, marks[i].bodyStart);
    if (end < 0) throw new Error('no end for ' + name);
    const body = html.slice(marks[i].bodyStart, end + 1) + '\nreturn __e;';
    mods.set(name, { name, body, start: marks[i].start, end: end + endMarker.length });
  }
  return { html, mods };
}

/** Run a module body with a controlled `__mod` and capture its exports. */
export function runModule(body, __mod, extra = {}) {
  const fn = new Function('__mod', '__e', 'window', 'document', 'console', body);
  const __e = {};
  const win = extra.window || {};
  fn(__mod, __e, win, extra.document || {}, extra.console || console);
  return __e;
}

export function stubMods() {
  const mods = {};
  return new Proxy(mods, {
    get(t, k) {
      if (typeof k !== 'string') return undefined;
      if (!(k in t)) throw new Error('module not stubbed: ' + k);
      return t[k];
    },
    has(t, k) { return k in t; },
    set(t, k, v) { t[k] = v; return true; },
  });
}
