// ============================================================================
// A fake browser, small enough to read: just enough DOM, canvas and WebGL for
// index.html to boot in Node. three.js itself runs fine outside a browser as
// long as nothing asks for a real GL context, so the renderer is a stub that
// counts draw calls and everything else is the game's own code.
//
// Used by play.mjs, menu.mjs and studios.mjs - see tools/playtest/README.md.
// ============================================================================
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function fakeContext(cv) {
  const c = {
    canvas: cv,
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h }),
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h }),
    measureText: (s) => ({ width: String(s).length * 6 }),
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
    createPattern: () => ({}),
    getContextAttributes: () => ({}),
    putImageData() {}, drawImage() {}, fillRect() {}, clearRect() {}, strokeRect() {}, beginPath() {}, closePath() {},
    moveTo() {}, lineTo() {}, arc() {}, arcTo() {}, ellipse() {}, rect() {}, fill() {}, stroke() {}, clip() {},
    save() {}, restore() {}, translate() {}, rotate() {}, scale() {}, setTransform() {}, transform() {},
    quadraticCurveTo() {}, bezierCurveTo() {}, fillText() {}, strokeText() {}, setLineDash() {},
  };
  return new Proxy(c, {
    get(t, k) {
      if (k in t) return t[k];
      if (typeof k === 'string' && /^(fillStyle|strokeStyle|font|textAlign|textBaseline|lineWidth|lineCap|lineJoin|globalAlpha|globalCompositeOperation|shadowBlur|shadowColor|filter|imageSmoothingEnabled|miterLimit|lineDashOffset)$/.test(k)) return t['_' + k];
      return () => undefined;
    },
    set(t, k, v) { t['_' + String(k)] = v; t[k] = v; return true; },
  });
}

function fakeCanvas(w = 1, h = 1) {
  const cv = { tagName: 'CANVAS', width: w, height: h, style: {} };
  cv.getContext = () => cv._ctx || (cv._ctx = fakeContext(cv));
  cv.addEventListener = () => {};
  cv.removeEventListener = () => {};
  cv.toDataURL = () => 'data:,';
  return cv;
}

export function installDom() {
  const g = globalThis;
  if (g.__domInstalled) return;
  g.__domInstalled = true;
  const el = (tag = 'div') => ({
    tagName: String(tag).toUpperCase(), style: {}, dataset: {}, children: [], value: '', textContent: '', innerHTML: '',
    className: '', width: 1, height: 1, appendChild(c) { this.children.push(c); return c; }, removeChild() {},
    setAttribute() {}, getAttribute: () => null, addEventListener() {}, removeEventListener() {}, remove() {},
    querySelector: () => null, querySelectorAll: () => [], focus() {}, click() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
    insertBefore(c) { this.children.push(c); return c; }, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  });
  const document = {
    createElement: (tag) => (String(tag).toLowerCase() === 'canvas' ? fakeCanvas() : el(tag)),
    createElementNS: (ns, tag) => (String(tag).toLowerCase() === 'canvas' ? fakeCanvas() : el(tag)),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}, removeEventListener() {},
    body: el('body'),
    documentElement: el('html'),
    currentScript: { src: 'file://' + ROOT + '/x.js' },
    fonts: { ready: Promise.resolve() },
    exitFullscreen() {},
  };
  g.document = document;
  g.window = g;
  g.self = g;
  try { Object.defineProperty(g, 'navigator', { value: { userAgent: 'node', clipboard: { writeText() {} } }, configurable: true, writable: true }); } catch (e) { /* already there */ }
  try { Object.defineProperty(g, 'location', { value: { search: '', hash: '', href: 'file://' + ROOT + '/index.html', reload() {} }, configurable: true, writable: true }); } catch (e) { /* already there */ }
  g.devicePixelRatio = 1;
  g.requestAnimationFrame = () => 0;
  g.cancelAnimationFrame = () => {};
  g.performance = g.performance || { now: () => Date.now() };
  g.ImageData = function (w, h) { return { data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h }; };
  g.AudioContext = undefined;
  g.addEventListener = () => {};
  g.removeEventListener = () => {};
  g.URL = g.URL || { createObjectURL: () => 'blob:', revokeObjectURL() {} };
  g.Blob = g.Blob || function () {};
  g.localStorage = { getItem: () => null, setItem() {}, removeItem() {}, length: 0 };
  g.WebGLRenderingContext = function () {};
}


const noop = () => {};

export function installBrowser() {
  installDom();
  const g = globalThis;
  if (g.__browserInstalled) return g.__dom;
  g.__browserInstalled = true;

  const byId = new Map();
  const all = [];

  function makeEl(tag = 'div', id = '') {
    const el = {
      tagName: String(tag).toUpperCase(),
      id,
      style: new Proxy({}, { get: (t, k) => (k === 'setProperty' ? noop : (k === 'removeProperty' ? noop : t[k] || '')), set: (t, k, v) => { t[k] = v; return true; } }),
      dataset: {},
      children: [],
      childNodes: [],
      parentNode: null,
      value: '',
      checked: false,
      textContent: '',
      _html: '',
      width: 1920,
      height: 1080,
      scrollTop: 0, scrollHeight: 100, clientHeight: 100, offsetWidth: 100, offsetHeight: 100,
      classList: {
        _s: new Set(),
        add(...c) { c.forEach((x) => this._s.add(x)); },
        remove(...c) { c.forEach((x) => this._s.delete(x)); },
        toggle(c, f) { if (f === undefined) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); } else if (f) this._s.add(c); else this._s.delete(c); },
        contains(c) { return this._s.has(c); },
      },
      appendChild(c) { this.children.push(c); this.childNodes.push(c); c.parentNode = this; return c; },
      insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
      prepend(...cs) { cs.forEach((c) => { if (c && typeof c === 'object') { this.children.unshift(c); c.parentNode = this; } }); },
      append(...cs) { cs.forEach((c) => { if (c && typeof c === 'object') { this.children.push(c); c.parentNode = this; } }); },
      removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
      remove() { if (this.parentNode) this.parentNode.removeChild(this); },
      replaceChildren() { this.children.length = 0; },
      setAttribute(k, v) { if (k === 'id') { this.id = v; byId.set(v, this); } this[k] = v; },
      getAttribute(k) { return this[k] === undefined ? null : this[k]; },
      removeAttribute(k) { delete this[k]; },
      hasAttribute(k) { return this[k] !== undefined; },
      addEventListener(t, f) { (this._ev = this._ev || {})[t] = (this._ev[t] || []).concat(f); },
      removeEventListener: noop,
      dispatchEvent(e) { ((this._ev || {})[e && e.type] || []).forEach((f) => f(e)); return true; },
      click() { this.dispatchEvent({ type: 'click', target: this, preventDefault: noop, stopPropagation: noop }); },
      focus: noop, blur: noop, scrollIntoView: noop, animate: () => ({ finished: Promise.resolve(), cancel: noop }),
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 }),
      querySelector(sel) { return queryAll(this, sel)[0] || null; },
      querySelectorAll(sel) { return queryAll(this, sel); },
      closest() { return null; },
      cloneNode() { return makeEl(tag); },
      requestPointerLock: noop,
      requestFullscreen: () => Promise.resolve(),
      play: () => Promise.resolve(), pause: noop, load: noop,
      getContext: () => fake2d(),
      toDataURL: () => 'data:,',
    };
    Object.defineProperty(el, 'className', {
      get() { return [...this.classList._s].join(' '); },
      set(v) { this.classList._s = new Set(String(v).split(/\s+/).filter(Boolean)); },
    });
    Object.defineProperty(el, 'innerHTML', {
      get() { return this._html; },
      set(v) { this._html = String(v); this.children.length = 0; parseInto(this, String(v)); },
    });
    Object.defineProperty(el, 'firstChild', { get() { return this.children[0] || null; } });
    Object.defineProperty(el, 'firstElementChild', { get() { return this.children[0] || null; } });
    Object.defineProperty(el, 'lastElementChild', { get() { return this.children[this.children.length - 1] || null; } });
    Object.defineProperty(el, 'lastChild', { get() { return this.children[this.children.length - 1] || null; } });
    Object.defineProperty(el, 'children', { value: el.children, writable: true });
    all.push(el);
    if (id) byId.set(id, el);
    return el;
  }

  // innerHTML: a small tag-stack parser, enough for the UI code's templates.
  const VOID = new Set(['input', 'br', 'hr', 'img', 'meta', 'link', 'source', 'area', 'col', 'embed']);
  function parseInto(parent, html) {
    const stack = [parent];
    const re = /<(\/?)([\w-]+)([^>]*?)(\/?)>|([^<]+)/g;
    let m;
    while ((m = re.exec(html))) {
      const top = stack[stack.length - 1];
      if (m[5] !== undefined) {
        const text = m[5];
        if (text.trim()) top.textContent = (top.textContent || '') + text;
        continue;
      }
      const close = m[1] === '/';
      const tag = m[2].toLowerCase();
      if (close) {
        for (let i = stack.length - 1; i > 0; i--) if (stack[i].tagName === tag.toUpperCase()) { stack.length = i; break; }
        continue;
      }
      const attrs = m[3] || '';
      const child = makeEl(tag);
      const id = /\bid\s*=\s*["']([^"']+)["']/.exec(attrs);
      const cls = /\bclass\s*=\s*["']([^"']*)["']/.exec(attrs);
      const val = /\bvalue\s*=\s*["']([^"']*)["']/.exec(attrs);
      const type = /\btype\s*=\s*["']([^"']*)["']/.exec(attrs);
      const data = [...attrs.matchAll(/\bdata-([\w-]+)\s*=\s*["']([^"']*)["']/g)];
      if (id) { child.id = id[1]; byId.set(id[1], child); }
      if (cls) { child.className = cls[1]; cls[1].split(/\s+/).filter(Boolean).forEach((c) => child.classList.add(c)); }
      if (val) child.value = val[1];
      if (type) child.type = type[1];
      if (/\bchecked\b/.test(attrs)) child.checked = true;
      if (/\bselected\b/.test(attrs)) child.selected = true;
      for (const d of data) child.dataset[d[1].replace(/-(\w)/g, (x, c) => c.toUpperCase())] = d[2];
      child.parentNode = top;
      top.children.push(child);
      if (!close && !VOID.has(tag) && m[4] !== '/') stack.push(child);
    }
  }

  function matches(el, sel) {
    sel = sel.trim();
    if (sel.startsWith('#')) return el.id === sel.slice(1);
    if (sel.startsWith('.')) return sel.slice(1).split('.').every((c) => el.classList.contains(c));
    if (/^\[data-([\w-]+)\]$/.test(sel)) return el.dataset[RegExp.$1.replace(/-(\w)/g, (x, c) => c.toUpperCase())] !== undefined;
    return el.tagName === sel.toUpperCase();
  }

  function queryAll(root, sel) {
    const part = String(sel).split(',').map((s) => s.trim().split(/\s+/).pop());
    const out = [];
    const walk = (n) => { for (const c of n.children || []) { if (part.some((p) => matches(c, p))) out.push(c); walk(c); } };
    walk(root);
    return out;
  }

  function fake2d() {
    return new Proxy({ canvas: { width: 1, height: 1 }, measureText: (s) => ({ width: String(s).length * 6 }),
      createImageData: (w, h) => ({ data: new Uint8ClampedArray(Math.max(4, w * h * 4)), width: w, height: h }),
      getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(4, w * h * 4)), width: w, height: h }),
      createLinearGradient: () => ({ addColorStop: noop }), createRadialGradient: () => ({ addColorStop: noop }),
      createPattern: () => ({}) }, {
      get(t, k) { return k in t ? t[k] : () => undefined; },
      set(t, k, v) { t[k] = v; return true; },
    });
  }

  const doc = g.document;
  const body = makeEl('body', 'body');
  const html = makeEl('html');
  html.appendChild(body);
  doc.body = body;
  doc.documentElement = html;
  doc.head = makeEl('head');
  doc.createElement = (tag) => makeEl(tag);
  doc.createElementNS = (ns, tag) => makeEl(tag);
  doc.createTextNode = (t) => ({ nodeType: 3, textContent: t });
  doc.createDocumentFragment = () => makeEl('fragment');
  doc.getElementById = (id) => byId.get(id) || null;
  doc.getElementsByClassName = (c) => queryAll(html, '.' + c);
  doc.querySelector = (s) => queryAll(html, s)[0] || (s.startsWith('#') ? doc.getElementById(s.slice(1)) : null);
  doc.querySelectorAll = (s) => queryAll(html, s);
  doc.pointerLockElement = null;
  doc.fullscreenElement = null;
  doc.hidden = false;
  doc.visibilityState = 'visible';
  doc.readyState = 'loading';

  g.__dom = { makeEl, byId, all, body, queryAll, parseInto };
  return g.__dom;
}

/** Replace THREE.WebGLRenderer with something that pretends to draw. */
export function stubRenderer(THREE) {
  if (!THREE || THREE.__stubbed) return;
  THREE.__stubbed = true;
  const dom = globalThis.__dom;
  class StubRenderer {
    constructor(opts = {}) {
      this.domElement = opts.canvas || (dom ? dom.makeEl('canvas') : { style: {} });
      this.domElement.style = this.domElement.style || {};
      this.info = { render: { calls: 0, triangles: 0 }, memory: { geometries: 0, textures: 0 }, programs: [], autoReset: true, reset: noop };
      this.capabilities = { isWebGL2: true, maxTextureSize: 4096, getMaxAnisotropy: () => 16, maxTextures: 16, precision: 'highp' };
      this.shadowMap = { enabled: false, type: 0, autoUpdate: true, needsUpdate: false };
      this.extensions = { get: () => ({}), has: () => true };
      this.properties = { get: () => ({}) };
      this.state = { buffers: { depth: { setMask: noop } }, reset: noop, setBlending: noop };
      this.xr = { enabled: false, addEventListener: noop, isPresenting: false, getSession: () => null };
      this.outputColorSpace = '';
      this.toneMapping = 0;
      this.toneMappingExposure = 1;
      this.autoClear = true;
      this.localClippingEnabled = false;
      this.debug = { checkShaderErrors: false };
      this.isWebGLRenderer = true;
    }
    setSize() {} setPixelRatio() {} getPixelRatio() { return 1; }
    getSize(t) { if (t) { t.width = 1920; t.height = 1080; return t; } return { width: 1920, height: 1080 }; }
    getDrawingBufferSize(t) { return this.getSize(t); }
    setViewport() {} setScissor() {} setScissorTest() {} setClearColor() {} setClearAlpha() {}
    clear() {} clearDepth() {} clearColor() {} clearStencil() {}
    render() { this.info.render.calls++; }
    compile() {} dispose() {} forceContextLoss() {}
    setRenderTarget() {} getRenderTarget() { return null; } copyFramebufferToTexture() {} readRenderTargetPixels() {}
    setAnimationLoop(fn) { this._loop = fn; }
    getContext() { return { getExtension: () => null, getParameter: () => 0, canvas: this.domElement }; }
    getClearColor(t) { if (t && t.setRGB) { t.setRGB(0, 0, 0); return t; } return { r: 0, g: 0, b: 0 }; }
    getClearAlpha() { return 1; }
    getActiveCubeFace() { return 0; }
    getActiveMipmapLevel() { return 0; }
    setOpaqueSort() {} setTransparentSort() {}
    initTexture() {} resetState() {}
  }
  THREE.WebGLRenderer = StubRenderer;
}
