// ============================================================================
// Runs a page's <script> tags in document order, the way a browser would -
// including scripts written with document.write(), which is how
// entities/loader.js and levels/loader.js pull their file lists in.
//
// The markup of the page is parsed into the fake DOM first, so getElementById
// finds the real elements and returns null for the ones the game creates.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { installBrowser, ROOT } from './dom.mjs';

/** Every <script> in the html, in order, as { src } or { code }. */
export function scriptsOf(html) {
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1] || '';
    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const onerror = /\bonerror\s*=\s*"([^"]*)"/i.exec(attrs);
    out.push(src ? { src: src[1], onerror: onerror ? onerror[1] : null } : { code: m[2] });
  }
  return out;
}

/**
 * Load one page of the repo.
 *   file         path relative to the repo root (default index.html)
 *   afterScript  called after every script, e.g. to stub the renderer
 * Returns { errors, missing, fire } - fire('DOMContentLoaded') starts the game.
 */
export function runPage({ file = 'index.html', log = () => {}, onMissing = null, afterScript = null } = {}) {
  installBrowser();
  const g = globalThis;
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');

  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html);
  if (body && g.__dom && g.__dom.parseInto) g.__dom.parseInto(g.document.body, body[1].replace(/<script[\s\S]*?<\/script\s*>/gi, ''));

  const queue = scriptsOf(html);
  const errors = [];
  const missing = [];
  let writeSink = null;

  g.document.write = (s) => {
    if (!writeSink) throw new Error('document.write outside of script execution');
    writeSink.push(...scriptsOf(s));
  };
  g.document.writeln = g.document.write;

  const listeners = {};
  g.document.addEventListener = (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); };
  g.addEventListener = (type, fn) => { (listeners['win:' + type] = listeners['win:' + type] || []).push(fn); };

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    const writes = [];
    writeSink = writes;
    const where = item.src || `inline #${i}`;
    try {
      if (item.src) {
        const rel = item.src.replace(/^file:\/\//, '');
        const abs = path.isAbsolute(rel) ? rel : path.resolve(path.dirname(path.join(ROOT, file)), rel);
        if (!fs.existsSync(abs)) {
          missing.push(item.src);
          if (item.onerror) { try { new Function(item.onerror).call({}); } catch (e) { /* the page's own handler */ } }
          if (onMissing) onMissing(item.src);
          writeSink = null;
          continue;
        }
        g.document.currentScript = { src: 'file://' + abs };
        log('load ' + item.src);
        new Function('window', 'document', 'console', fs.readFileSync(abs, 'utf8'))(g, g.document, console);
      } else {
        g.document.currentScript = null;
        new Function('window', 'document', 'console', item.code)(g, g.document, console);
      }
    } catch (e) {
      errors.push({ where, error: e });
    }
    writeSink = null;
    if (afterScript) { try { afterScript(where); } catch (e) { errors.push({ where: 'afterScript ' + where, error: e }); } }
    if (writes.length) queue.splice(i + 1, 0, ...writes);   // document.write lands right here
  }

  return { errors, missing, listeners, fire: (type) => (listeners[type] || []).forEach((f) => f({ type })) };
}
