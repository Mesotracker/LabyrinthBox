(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/entities/rig.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
const { mergeGeometries: mergeGeometries } = __mod['vendor/three/examples/jsm/utils/BufferGeometryUtils.js'];
const { patchWorldMaterial: patchWorldMaterial, setBakedUniform: setBakedUniform } = __mod['src/gfx/shaderpatch.js'];
// Procedural creature construction.
//
// Every creature is a real skeleton (THREE.Bone hierarchy: hips > spine >
// chest > neck > head, shoulder > elbow > wrist > finger joints, hip > knee >
// ankle) wrapped in ONE continuous skinned mesh per material. Each body part is
// modelled around its bone, then merged; vertices near a joint are weighted
// between the two bones that meet there, so elbows, knees, shoulders and the
// neck bend as a single surface instead of separate pieces pivoting in space.
//
// Conventions: a creature faces +z, joints hang their limbs along -y, and a
// negative x rotation swings a limb forward. Materials go through the same
// world shader patch as everything else, lit by a per-entity light sample.

const V2 = THREE.Vector2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

// ------------------------------------------------------------------ procedural noise (CPU, for textures)
function makeNoise(seed = 1) {
  const p = new Uint8Array(512);
  let s = seed >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
  const base = new Uint8Array(256);
  for (let i = 0; i < 256; i++) base[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = base[i]; base[i] = base[j]; base[j] = t; }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  const val = new Float32Array(256);
  for (let i = 0; i < 256; i++) val[i] = rnd();
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  /** Periodic value noise: period px, py (integers) so textures tile. */
  function n2(x, y, px = 256, py = 256) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const x0 = ((xi % px) + px) % px, x1 = (x0 + 1) % px;
    const y0 = ((yi % py) + py) % py, y1 = (y0 + 1) % py;
    const h = (a, b) => val[p[(p[a & 255] + b) & 511] & 255];
    const u = fade(xf), v = fade(yf);
    return lerp(lerp(h(x0, y0), h(x1, y0), u), lerp(h(x0, y1), h(x1, y1), u), v);
  }
  function fbm(u, v, f = 4, oct = 5, rep = [1, 1]) {
    let a = 0.5, sum = 0, norm = 0, fx = f, fy = f;
    for (let o = 0; o < oct; o++) {
      sum += a * n2(u * fx, v * fy, Math.max(1, Math.round(fx * rep[0])), Math.max(1, Math.round(fy * rep[1])));
      norm += a; a *= 0.5; fx *= 2; fy *= 2;
    }
    return sum / norm;
  }
  function ridged(u, v, f = 4, oct = 4) {
    let a = 0.5, sum = 0, norm = 0, fq = f;
    for (let o = 0; o < oct; o++) {
      const n = 1 - Math.abs(n2(u * fq, v * fq, Math.round(fq), Math.round(fq)) * 2 - 1);
      sum += a * n * n; norm += a; a *= 0.5; fq *= 2;
    }
    return sum / norm;
  }
  /** Cellular (worley) distance, periodic. */
  function cell(u, v, f = 8) {
    const x = u * f, y = v * f;
    const xi = Math.floor(x), yi = Math.floor(y);
    let d1 = 9, d2 = 9;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const cx = xi + i, cy = yi + j;
      const wx = ((cx % f) + f) % f, wy = ((cy % f) + f) % f;
      const hx = val[p[(p[wx & 255] + wy) & 511] & 255], hy = val[p[(p[(wx + 31) & 255] + wy * 7) & 511] & 255];
      const dx = cx + hx - x, dy = cy + hy - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    return [d1, d2];
  }
  return { n2, fbm, ridged, cell, rnd };
}

const NOISE = makeNoise(9173);

/**
 * Paint a texture per pixel. fn(u, v, N) -> [r, g, b] (0..1, sRGB) and may set
 * out.h (height 0..1) to produce a matching bump map.
 */
function paintTex(w, h, fn, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const img = g.createImageData(w, h);
  const bumpC = opts.bump ? document.createElement('canvas') : null;
  let bimg = null, bg = null;
  if (bumpC) { bumpC.width = w; bumpC.height = h; bg = bumpC.getContext('2d'); bimg = bg.createImageData(w, h); }
  const out = { h: 0.5, a: 1 };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    out.h = 0.5; out.a = 1;
    const col = fn(x / w, y / h, NOISE, out);
    const i = (x + y * w) * 4;
    img.data[i] = clamp(col[0], 0, 1) * 255;
    img.data[i + 1] = clamp(col[1], 0, 1) * 255;
    img.data[i + 2] = clamp(col[2], 0, 1) * 255;
    img.data[i + 3] = clamp(out.a, 0, 1) * 255;
    if (bimg) { const hv = clamp(out.h, 0, 1) * 255; bimg.data[i] = bimg.data[i + 1] = bimg.data[i + 2] = hv; bimg.data[i + 3] = 255; }
  }
  g.putImageData(img, 0, 0);
  if (opts.post) opts.post(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
  let bump = null;
  if (bg) {
    bg.putImageData(bimg, 0, 0);
    bump = new THREE.CanvasTexture(bumpC);
    bump.colorSpace = THREE.NoColorSpace;
    bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
    if (opts.repeat) bump.repeat.set(opts.repeat[0], opts.repeat[1]);
  }
  return { map: t, bump, canvas: c };
}

// ------------------------------------------------------------------ materials
function skinMat(color, o = {}) {
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: o.rough ?? 0.72,
    metalness: o.metal ?? 0,
    map: o.map || null,
    transparent: !!o.transparent,
    opacity: o.opacity ?? 1,
    side: o.side ?? THREE.FrontSide,
    alphaTest: o.alphaTest ?? 0,
  });
  if (o.emissive) {
    m.emissive = new THREE.Color(o.emissive);
    m.emissiveIntensity = o.emissiveIntensity ?? 1;
    if (o.emissiveMap) m.emissiveMap = o.emissiveMap;
  }
  if (o.bump) { m.bumpMap = o.bump; m.bumpScale = o.bumpScale ?? 1; }
  if (o.roughMap) m.roughnessMap = o.roughMap;
  if (o.depthWrite === false) m.depthWrite = false;
  patchWorldMaterial(m, { bake: 'uniform', layeredFog: true });
  return m;
}

/** Unlit glow (eyes, grins) that bloom picks up. */
function glowMat(color, o = {}) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    map: o.map || null,
    transparent: o.transparent ?? !!o.map,
    opacity: o.opacity ?? 1,
    depthWrite: o.depthWrite ?? !o.map,
    blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    fog: o.fog ?? true,
    toneMapped: false,
    side: o.side ?? THREE.FrontSide,
  });
}

function setLight(mats, r, g, b) {
  for (const m of mats) setBakedUniform(m, r, g, b);
}

function canvasTex(w, h, draw, opts = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}

// ------------------------------------------------------------------ geometry
/**
 * Limb hanging from its joint along -y: rounded ends, linear taper from r0 to
 * r1 and an optional muscle bulge (a gaussian at `at`, 0 = top, 1 = bottom).
 * `flat` squashes the cross-section front-to-back (forearms, shins).
 */
function limbGeo(len, r0, r1, bulge = 0, at = 0.35, radial = 12, flat = 1) {
  const pts = [];
  const cb = Math.min(r1 * 0.95, len * 0.25), ct = Math.min(r0 * 0.95, len * 0.25);
  for (let i = 0; i <= 4; i++) {
    const a = (i / 4) * Math.PI / 2;
    pts.push(new V2(Math.max(0.0005, Math.sin(a) * r1), -len - Math.cos(a) * cb * 0.6));
  }
  const n = 12;
  for (let i = 1; i < n; i++) {
    const u = 1 - i / n; // 1 at the bottom
    const r = lerp(r0, r1, u) + bulge * Math.exp(-Math.pow(((1 - u) - at) / 0.22, 2));
    pts.push(new V2(r, -len * u));
  }
  for (let i = 0; i <= 4; i++) {
    const a = (1 - i / 4) * Math.PI / 2;
    pts.push(new V2(Math.max(0.0005, Math.sin(a) * r0), Math.cos(a) * ct * 0.6));
  }
  const g = new THREE.LatheGeometry(pts, radial);
  if (flat !== 1) g.scale(1, 1, flat);
  return g;
}

/** Torso-like solid of revolution from (y, radius) pairs, squashed in z. */
function latheGeo(profile, depth = 1, radial = 16) {
  const pts = profile.map(([y, r]) => new V2(Math.max(0.0005, r), y));
  const g = new THREE.LatheGeometry(pts, radial);
  if (depth !== 1) g.scale(1, 1, depth);
  return g;
}

function ellipsoid(rx, ry, rz, ws = 18, hs = 14) {
  const g = new THREE.SphereGeometry(1, ws, hs);
  g.scale(rx, ry, rz);
  return g;
}

/** A spherical cap facing +z: used as a face plate for painted faces. */
function facePlate(r, width = 1.6, height = 1.5, ws = 22, hs = 18) {
  return new THREE.SphereGeometry(r, ws, hs, Math.PI / 2 - width / 2, width, Math.PI / 2 - height / 2, height);
}

function xf(g, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1 } = {}) {
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, 'XYZ')),
    new THREE.Vector3(sx, sy, sz));
  g.applyMatrix4(m);
  return g;
}

function prep(g) {
  let n = g.index ? g : g;
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  if (!n.attributes.normal) n.computeVertexNormals();
  for (const k of Object.keys(n.attributes)) if (!['position', 'normal', 'uv', 'skinIndex', 'skinWeight'].includes(k)) n.deleteAttribute(k);
  if (!n.index) {
    const idx = []; for (let i = 0; i < n.attributes.position.count; i++) idx.push(i);
    n.setIndex(idx);
  }
  return n;
}

function merge(list) {
  return mergeGeometries(list.map(prep), false);
}

/** A rigid hand (palm plus fingers) hanging along -y; used by props/items. */
function handGeo(scale = 1, fingerLen = 0.07, claws = 0) {
  const s = scale;
  const parts = [xf(new THREE.BoxGeometry(0.075 * s, 0.085 * s, 0.03 * s, 1, 1, 1), { y: -0.045 * s })];
  for (let i = 0; i < 4; i++) {
    const x = (-0.027 + i * 0.018) * s;
    const L = fingerLen * s * (i === 0 || i === 3 ? 0.85 : 1);
    parts.push(xf(limbGeo(L, 0.009 * s, 0.007 * s, 0, 0.4, 6), { x, y: -0.088 * s, rx: 0.15 }));
    if (claws) parts.push(xf(new THREE.ConeGeometry(0.006 * s, claws * s, 5), { x, y: -0.088 * s - L - claws * s * 0.45, rx: Math.PI + 0.3, z: 0.004 }));
  }
  parts.push(xf(limbGeo(fingerLen * 0.7 * s, 0.011 * s, 0.008 * s, 0, 0.4, 6), { x: 0.04 * s, y: -0.03 * s, z: 0.01 * s, rz: 0.7 }));
  return merge(parts);
}

/** A foot pointing +z from the ankle joint: heel, arch, ball and toes. */
function footGeo(len = 0.25, w = 0.05, h = 0.06) {
  const g = limbGeo(len, w * 0.9, w, 0.012, 0.75, 12);
  xf(g, { rx: -Math.PI / 2 });
  g.scale(1, h / (w * 2), 1);
  // raise the arch: vertices in the middle third lift slightly
  const pa = g.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const z = pa.getZ(i), y = pa.getY(i);
    const t = z / len;
    if (y < 0) pa.setY(i, y * (1 - 0.35 * Math.exp(-Math.pow((t - 0.45) / 0.18, 2))));
  }
  g.computeVertexNormals();
  g.translate(0, -h * 0.55, -0.05);
  return g;
}

// ------------------------------------------------------------------ skeleton
/**
 * spec: hipH, hipW, thigh, shin, footH, spine, chestH, neck, shoulderW, shoulderY,
 * upperArm, foreArm.
 */
class Rig {
  constructor(spec) {
    this.spec = spec;
    this.root = new THREE.Group();
    this.bones = [];
    this.parts = [];
    this.meshes = [];
    this.body = this.joint(this.root, 0, 0, 0);
    this.hips = this.joint(this.body, 0, spec.hipH, 0);
    this.spine = this.joint(this.hips, 0, 0.03, 0);
    this.chest = this.joint(this.spine, 0, spec.spine, 0);
    this.neck = this.joint(this.chest, 0, spec.chestH, spec.neckZ || 0);
    this.head = this.joint(this.neck, 0, spec.neck, 0);
    this.arms = [1, -1].map((side) => {
      const clav = this.joint(this.chest, side * spec.shoulderW * 0.12, spec.shoulderY ?? spec.chestH - 0.05, 0.01);
      const sh = this.joint(clav, side * spec.shoulderW * 0.38, 0, -0.01);
      const el = this.joint(sh, 0, -spec.upperArm, 0);
      const wr = this.joint(el, 0, -spec.foreArm, 0);
      return { clav, sh, el, wr, side, fingers: [] };
    });
    this.legs = [1, -1].map((side) => {
      const hip = this.joint(this.hips, side * spec.hipW / 2, -0.02, 0);
      const kn = this.joint(hip, 0, -spec.thigh, 0);
      const an = this.joint(kn, 0, -spec.shin, 0);
      return { hip, kn, an, side };
    });
    this.extra = [];   // creature-specific animated bones (tails, segments)
  }

  joint(parent, x, y, z) {
    const b = new THREE.Bone();
    b.position.set(x, y, z);
    parent.add(b);
    this.bones.push(b);
    return b;
  }

  /**
   * Add a body part around a bone. Parts are merged into skinned meshes by
   * finalize(). opts: { rigid, child, parent, axis:[x,y,z], len, bw, shadow }
   * child/parent default to the obvious neighbours for limbs.
   */
  attach(bone, geo, mat, o = {}) {
    if (o.rigid) {
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = o.shadow ?? true;
      m.receiveShadow = false;
      bone.add(m);
      this.meshes.push(m);
      return m;
    }
    this.parts.push({ bone, geo, mat, o });
    return null;
  }

  /** Merge every queued part into one skinned mesh per material. */
  finalize() {
    if (this.done) return;
    this.done = true;
    this.root.updateMatrixWorld(true);
    const groups = new Map();
    const tmp = new THREE.Vector3();
    for (const part of this.parts) {
      const { bone, mat, o } = part;
      const g = prep(part.geo.clone());
      const pa = g.attributes.position;
      const n = pa.count;
      const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
      const bi = this.bones.indexOf(bone);
      const parent = o.parent === null ? null : (o.parent || (bone.parent && bone.parent.isBone ? bone.parent : null));
      let child = o.child === null ? null : (o.child || null);
      let axis, len;
      if (child) {
        axis = child.position.clone(); len = axis.length() || 1; axis.multiplyScalar(1 / len);
      } else {
        axis = new THREE.Vector3(...(o.axis || [0, -1, 0])).normalize();
        len = o.len ?? 0.2;
      }
      const bw = o.bw ?? 0.055;
      const pb = parent ? this.bones.indexOf(parent) : -1;
      const cb = child ? this.bones.indexOf(child) : -1;
      for (let i = 0; i < n; i++) {
        tmp.fromBufferAttribute(pa, i);
        const s = tmp.dot(axis);
        let wp = pb >= 0 && o.blendParent !== false ? (1 - smooth(-bw, bw, s)) * (o.parentK ?? 1) : 0;
        let wc = cb >= 0 ? smooth(len - bw, len + bw, s) : 0;
        if (wp + wc > 1) { const k = 1 / (wp + wc); wp *= k; wc *= k; }
        const ws = 1 - wp - wc;
        si[i * 4] = bi; sw[i * 4] = ws;
        si[i * 4 + 1] = pb >= 0 ? pb : bi; sw[i * 4 + 1] = wp;
        si[i * 4 + 2] = cb >= 0 ? cb : bi; sw[i * 4 + 2] = wc;
        si[i * 4 + 3] = bi; sw[i * 4 + 3] = 0;
      }
      g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
      g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
      g.applyMatrix4(bone.matrixWorld);
      const key = mat.uuid + (o.shadow === false ? ':ns' : '');
      if (!groups.has(key)) groups.set(key, { mat, geos: [], shadow: o.shadow ?? true });
      groups.get(key).geos.push(g);
    }
    this.skeleton = new THREE.Skeleton(this.bones);
    for (const { mat, geos, shadow } of groups.values()) {
      const merged = mergeGeometries(geos, false);
      if (!merged) continue;
      const mesh = new THREE.SkinnedMesh(merged, mat);
      mesh.castShadow = shadow;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      this.root.add(mesh);
      mesh.updateMatrixWorld(true);
      mesh.bind(this.skeleton, new THREE.Matrix4());
      this.meshes.push(mesh);
    }
    this.parts = [];
  }

  /** Vertical reach of a leg for the current joint angles. */
  legReach(L) {
    const s = this.spec;
    const a1 = L.hip.rotation.x, a2 = a1 + L.kn.rotation.x;
    return s.thigh * Math.cos(a1) * Math.cos(L.hip.rotation.z) + s.shin * Math.cos(a2) + s.footH;
  }

  /**
   * Critically damped follow of every joint toward the pose the gait just
   * wrote, so state changes (idle -> run, a lunge, dropping to all fours)
   * blend instead of snapping.
   */
  settle(dt, rate = 22) {
    const k = 1 - Math.exp(-dt * rate);
    for (const b of this.bones) {
      const r = b.rotation;
      if (!b.userData.p) { b.userData.p = [r.x, r.y, r.z]; continue; }
      const p = b.userData.p;
      p[0] += (r.x - p[0]) * k; p[1] += (r.y - p[1]) * k; p[2] += (r.z - p[2]) * k;
      r.set(p[0], p[1], p[2]);
    }
    const hp = this.hips.position;
    if (this._hy === undefined) this._hy = hp.y;
    this._hy += (hp.y - this._hy) * Math.min(1, k * 1.6);
    hp.y = this._hy;
  }
}

// ------------------------------------------------------------------ hands
/**
 * Articulated hand on a wrist bone: palm, four two-segment fingers and a
 * thumb, each segment its own bone so the hand can relax, splay and grab.
 */
function buildHand(rig, A, mat, o = {}) {
  const s = o.handScale || 1, fl = o.fingerLen || 0.07, claws = o.claws || 0;
  const nf = o.fingers || 4;
  rig.attach(A.wr, xf(ellipsoid(0.04 * s, 0.05 * s, 0.017 * s, 12, 10), { y: -0.045 * s }), mat, { parent: A.el, axis: [0, -1, 0], len: 0.08 * s, bw: 0.025, shadow: false });
  for (let i = 0; i < nf; i++) {
    const t = nf === 1 ? 0.5 : i / (nf - 1);
    const x = (-0.028 + t * 0.056) * s * A.side;
    const L = fl * s * (i === 0 || i === nf - 1 ? 0.84 : 1) * (o.fingerVar ? (0.9 + 0.2 * Math.sin(i * 2.3)) : 1);
    const f1 = rig.joint(A.wr, x, -0.088 * s, 0.002);
    const f2 = rig.joint(f1, 0, -L * 0.52, 0);
    const r = 0.0095 * s * (o.fingerR || 1);
    rig.attach(f1, limbGeo(L * 0.52, r, r * 0.88, 0, 0.4, 7), mat, { parent: A.wr, child: f2, bw: 0.012, shadow: false });
    rig.attach(f2, limbGeo(L * 0.48, r * 0.88, r * 0.62, 0, 0.4, 7), mat, { parent: f1, bw: 0.012, shadow: false });
    if (claws) rig.attach(f2, xf(new THREE.ConeGeometry(r * 0.75, claws * s, 6), { y: -L * 0.48 - claws * s * 0.42, rx: Math.PI, z: 0.002 }), o.clawMat || mat, { rigid: true, shadow: false });
    A.fingers.push({ f1, f2, spread: (t - 0.5) * 0.22 });
  }
  // thumb: opposed, angled toward the front of the palm
  const t1 = rig.joint(A.wr, 0.04 * s * A.side, -0.032 * s, 0.014 * s);
  const t2 = rig.joint(t1, 0, -fl * 0.42 * s, 0);
  const tr = 0.011 * s * (o.fingerR || 1);
  rig.attach(t1, limbGeo(fl * 0.42 * s, tr, tr * 0.85, 0, 0.4, 7), mat, { parent: A.wr, child: t2, bw: 0.014, shadow: false });
  rig.attach(t2, limbGeo(fl * 0.36 * s, tr * 0.85, tr * 0.6, 0, 0.4, 7), mat, { parent: t1, bw: 0.012, shadow: false });
  A.thumb = { t1, t2 };
}

/** Finger pose: curl 0 = straight, 1 = fist; splay spreads them. */
function poseHand(A, curl, splay = 0, t = 0) {
  for (let i = 0; i < A.fingers.length; i++) {
    const F = A.fingers[i];
    const c = clamp(curl + Math.sin(t * 1.3 + i * 0.9) * 0.04, -0.2, 1.2);
    F.f1.rotation.x = -c * 1.05 - 0.08;
    F.f2.rotation.x = -c * 1.25 - 0.1;
    F.f1.rotation.z = F.spread * (1 + splay * 2.5) * A.side;
  }
  if (A.thumb) {
    A.thumb.t1.rotation.set(-0.35 - curl * 0.5, 0, A.side * (0.75 - curl * 0.35));
    A.thumb.t2.rotation.x = -0.2 - curl * 0.7;
  }
}

// ------------------------------------------------------------------ gaits
/**
 * Biped walk/run. st: { speed, phase, t, stride, lean, crouch, armSwing,
 * attack (0..1), look, hunch, armsOut, sway, grip }. Hips are lowered until the
 * planted foot touches the floor, which gives the natural vertical bob.
 */
function animateBiped(rig, st, dt) {
  const v = st.speed;
  const runK = clamp((v - 1.8) / 2.6, 0, 1);
  const moveK = clamp(v / 0.5, 0, 1);
  const stride = (st.stride || 1.4) * (1 + runK * 0.55);
  st.phase += (v / stride) * Math.PI * 2 * dt;
  st.t += dt;
  const ph = st.phase;
  const crouch = st.crouch || 0;
  const thighAmp = (0.42 + runK * 0.48) * moveK;
  const kneeAmp = (0.85 + runK * 0.8) * moveK;
  const armAmp = (0.3 + runK * 0.62) * moveK * (st.armSwing ?? 1);
  const idle = 1 - moveK;

  let reach = 0;
  for (const L of rig.legs) {
    const p = L.side > 0 ? ph : ph + Math.PI;
    const s = Math.sin(p), c = Math.cos(p);
    // swing phase (c > 0) lifts the knee; stance keeps a small loading flex at heel strike
    const swing = Math.max(0, c);
    const load = Math.max(0, -c) * Math.max(0, s) * 0.35 * moveK;
    const weight = idle * (L.side > 0 ? 0.12 : -0.04) * Math.sin(st.t * 0.31) ;
    const thigh = -s * thighAmp - crouch * 0.6 - runK * 0.14 * moveK - Math.max(0, weight) * 0.4;
    const knee = 0.05 + kneeAmp * Math.pow(swing, 1.35) + load * 0.5 + crouch * 1.1 + runK * 0.22 * moveK + Math.max(0, weight) * 0.8;
    L.hip.rotation.x = thigh;
    L.hip.rotation.z = -L.side * (0.03 + (st.splay || 0));
    L.hip.rotation.y = L.side * 0.04;
    L.kn.rotation.x = knee;
    // keep the sole level, then heel strike (toes up) and toe-off (heel up)
    const heel = 0.22 * Math.max(0, s) * Math.max(0, -c) * moveK;
    const toeOff = 0.38 * Math.max(0, -s) * Math.max(0, -c) * moveK;
    L.an.rotation.x = -(thigh + knee) * 0.94 - heel + toeOff;
    reach = Math.max(reach, rig.legReach(L));
  }
  rig.hips.position.y = reach;
  rig.hips.position.x = -0.024 * moveK * Math.cos(ph) + idle * Math.sin(st.t * 0.31) * 0.03;
  rig.hips.rotation.y = Math.sin(ph) * 0.11 * moveK;
  rig.hips.rotation.z = Math.cos(ph) * 0.045 * moveK + idle * Math.sin(st.t * 0.31) * 0.04;

  const breathe = Math.sin(st.t * (1.6 + runK * 1.8)) * (0.012 + runK * 0.02);
  const att = st.attack || 0;
  const strike = Math.sin(Math.min(1, att) * Math.PI);
  const lean = (st.lean || 0) + runK * 0.28 * moveK + crouch * 0.35;
  rig.spine.rotation.x = lean + breathe + strike * 0.35;
  rig.spine.rotation.y = -Math.sin(ph) * 0.17 * moveK;
  rig.spine.rotation.z = (st.sway ? Math.sin(st.t * 0.9) * st.sway : 0) - rig.hips.rotation.z * 0.6;
  rig.chest.rotation.x = (st.hunch || 0) - breathe * 0.5;
  rig.chest.rotation.y = -Math.sin(ph) * 0.06 * moveK;
  const bs = 1 + breathe * 0.6;
  rig.chest.scale.set(bs, 1, bs);
  // the head stays level and keeps looking where it wants while the body rolls
  rig.neck.rotation.x = -(lean + (st.hunch || 0)) * 0.72 + Math.sin(ph * 2) * 0.02 * moveK + (st.nod || 0);
  rig.neck.rotation.y = -(rig.spine.rotation.y + rig.hips.rotation.y + rig.chest.rotation.y) * 0.8;
  const lookNoise = idle * Math.sin(st.t * 0.43) * Math.sin(st.t * 0.17) * 0.6;
  rig.head.rotation.y = clamp((st.look || 0) + lookNoise, -1.2, 1.2);
  rig.head.rotation.z = (st.tilt || 0) - rig.spine.rotation.z * 0.5;
  rig.head.rotation.x = Math.sin(ph * 2 + 0.6) * 0.02 * moveK;

  for (const A of rig.arms) {
    const p = A.side > 0 ? ph : ph + Math.PI;
    const s = Math.sin(p);
    // shoulder swing leads, the forearm trails it (secondary motion)
    const lag = Math.sin(p - 0.55);
    let sh = s * armAmp + (st.armsOut || 0) * -0.9;
    let el = -(0.2 + runK * 0.95 * moveK + armAmp * 0.35 * (1 + lag) * 0.6);
    let clav = 0;
    if (att > 0) {
      const k = Math.min(1, att * 3);
      sh = lerp(sh, -1.5 - strike * 0.35, k);
      el = lerp(el, -0.2 + strike * 0.25, k);
      clav = -0.15 * k;
    }
    A.clav.rotation.x = clav + Math.sin(p) * 0.03 * moveK;
    A.clav.rotation.z = A.side * (0.02 + breathe * 0.4);
    A.sh.rotation.x = sh;
    A.sh.rotation.z = A.side * (0.08 + (st.armsOut || 0) * 0.22) + Math.sin(st.t * 1.3 + A.side) * 0.015;
    A.sh.rotation.y = -A.side * 0.12 * moveK * runK;
    A.el.rotation.x = el;
    A.el.rotation.y = A.side * 0.15;
    A.wr.rotation.x = -0.12 - lag * 0.08 * moveK;
    A.wr.rotation.z = A.side * 0.05;
    const grip = att > 0 ? (att < 0.4 ? -0.15 : 1.0) : (st.grip ?? (0.25 + runK * 0.35));
    if (A.fingers.length) poseHand(A, grip, att > 0 && att < 0.4 ? 1 : 0, st.t);
  }
  if (rig.tick) rig.tick(st, dt);
  rig.settle(dt, st.rate || 22);
}

/** Crouched four-limbed trot (hounds, crawling wretches). Diagonal pairs move together. */
function animateQuad(rig, st, dt) {
  const v = st.speed;
  const runK = clamp((v - 1.5) / 2.5, 0, 1);
  const moveK = clamp(v / 0.4, 0, 1);
  const stride = (st.stride || 1.1) * (1 + runK * 0.7);
  st.phase += (v / stride) * Math.PI * 2 * dt;
  st.t += dt;
  const ph = st.phase;
  const pitch = st.pitch ?? 1.18;
  const amp = (0.35 + runK * 0.42) * moveK;
  const gallop = runK > 0.6 ? 0.5 * (runK - 0.6) / 0.4 : 0;

  rig.hips.position.y = rig.spec.hipH * (st.hipK ?? 0.78) + Math.abs(Math.sin(ph)) * 0.045 * moveK;
  rig.hips.rotation.x = 0;
  rig.hips.rotation.z = Math.cos(ph) * 0.05 * moveK;
  // the spine flexes and extends with a bounding stride and snakes side to side
  rig.spine.rotation.x = pitch + Math.sin(ph * 2) * (0.05 + gallop * 0.12) * moveK + Math.sin(st.t * 2.2) * 0.012;
  rig.spine.rotation.y = Math.sin(ph) * 0.09 * moveK;
  rig.spine.rotation.z = Math.cos(ph) * 0.06 * moveK;
  rig.chest.rotation.x = 0.06 - Math.sin(ph * 2) * gallop * 0.1;
  rig.chest.rotation.y = -Math.sin(ph) * 0.08 * moveK;
  rig.neck.rotation.x = -pitch * 0.82 + (st.headUp || 0) - Math.sin(ph * 2) * 0.05 * moveK;
  rig.head.rotation.y = clamp(st.look || 0, -0.9, 0.9) - rig.spine.rotation.y;
  rig.head.rotation.x = Math.sin(ph * 2) * 0.05 * moveK;

  for (const L of rig.legs) {
    const p = (L.side > 0 ? ph : ph + Math.PI) + gallop;
    const s = Math.sin(p), c = Math.cos(p);
    const hip = -0.75 - s * amp;
    const knee = 1.35 + Math.max(0, c) * 0.75 * moveK;
    L.hip.rotation.x = hip;
    L.hip.rotation.z = -L.side * (0.06 + (st.splay || 0));
    L.kn.rotation.x = knee;
    L.an.rotation.x = -(hip + knee) * 0.9 - 0.15 + Math.max(0, -s) * Math.max(0, -c) * 0.4 * moveK;
  }
  const att = st.attack || 0;
  const strike = Math.sin(Math.min(1, att) * Math.PI);
  for (const A of rig.arms) {
    const p = (A.side > 0 ? ph + Math.PI : ph);
    const s = Math.sin(p), c = Math.cos(p);
    let sh = -pitch - 0.12 - s * amp * 1.1;
    let el = 0.25 + Math.max(0, c) * 0.9 * moveK;
    if (att > 0) { sh -= strike * (A.side > 0 ? 0.95 : 0.6); el -= strike * 0.35; }
    A.clav.rotation.x = -Math.max(0, -s) * 0.12 * moveK; // shoulder blades roll with each step
    A.sh.rotation.x = sh;
    A.sh.rotation.z = A.side * (0.12 + (st.splay || 0));
    A.el.rotation.x = el;
    A.wr.rotation.x = -(pitch + sh + el) - 1.25 + Math.max(0, c) * 0.6 * moveK;
    if (A.fingers.length) poseHand(A, att > 0 ? 0.9 : (Math.max(0, c) * 0.6 * moveK + 0.05), att > 0 ? 0.6 : 0, st.t);
  }
  if (rig.tick) rig.tick(st, dt);
  rig.settle(dt, st.rate || 24);
}

/**
 * Low, splayed "spider" crawl: limbs abducted sideways, elbows and knees high,
 * each limb lifts out and reaches forward in a four-beat sequence.
 */
function animateSpider(rig, st, dt) {
  const v = st.speed;
  const moveK = clamp(v / 0.4, 0, 1);
  const runK = clamp((v - 2) / 3, 0, 1);
  const stride = (st.stride || 1.0) * (1 + runK * 0.6);
  st.phase += (v / stride) * Math.PI * 2 * dt;
  st.t += dt;
  const ph = st.phase;
  const amp = (0.42 + runK * 0.3) * moveK;
  rig.hips.position.y = rig.spec.hipH * (st.hipK ?? 0.5) + Math.abs(Math.sin(ph * 2)) * 0.02 * moveK;
  rig.spine.rotation.x = (st.pitch ?? 1.42) + Math.sin(st.t * 1.7) * 0.015;
  rig.spine.rotation.y = Math.sin(ph) * 0.14 * moveK;
  rig.spine.rotation.z = Math.cos(ph * 2) * 0.03 * moveK;
  rig.chest.rotation.x = 0.04;
  rig.chest.rotation.y = -Math.sin(ph) * 0.12 * moveK;
  rig.neck.rotation.x = -(st.pitch ?? 1.42) * 0.9 + (st.headUp || 0);
  rig.head.rotation.y = clamp(st.look || 0, -1.1, 1.1) - rig.spine.rotation.y - rig.chest.rotation.y;
  rig.head.rotation.z = Math.sin(st.t * 3.1) * 0.12 * (st.twitch || 0);
  const seq = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]; // RL, RR?, FL, FR four-beat
  rig.legs.forEach((L, i) => {
    const p = ph + seq[i * 2];
    const s = Math.sin(p), c = Math.cos(p);
    const lift = Math.max(0, c) * moveK;
    L.hip.rotation.x = -1.0 - s * amp;
    L.hip.rotation.z = -L.side * (0.95 + lift * 0.35);
    L.kn.rotation.x = 1.9 - lift * 0.4;
    L.kn.rotation.z = L.side * 0.2;
    L.an.rotation.x = -0.9;
  });
  const att = st.attack || 0;
  const strike = Math.sin(Math.min(1, att) * Math.PI);
  rig.arms.forEach((A, i) => {
    const p = ph + seq[i * 2 + 1];
    const s = Math.sin(p), c = Math.cos(p);
    const lift = Math.max(0, c) * moveK;
    A.sh.rotation.x = -1.5 - s * amp * 1.1 - strike * 0.7;
    A.sh.rotation.z = A.side * (1.0 + lift * 0.4) - strike * A.side * 0.6;
    A.el.rotation.x = -0.2;
    A.el.rotation.z = -A.side * (1.6 - lift * 0.5 - strike * 0.9);
    A.wr.rotation.z = A.side * 0.4;
    A.wr.rotation.x = -0.5;
    if (A.fingers.length) poseHand(A, att > 0 ? 1.0 : 0.15 + lift * 0.25, 0.8, st.t * 3);
  });
  if (rig.tick) rig.tick(st, dt);
  rig.settle(dt, st.rate || 26);
}

/** Idle-only rest pose helper for statues (mannequins hold their last pose). */
function freezePose() { /* no-op: joints keep their rotations */ }

__e['skinMat'] = skinMat;
__e['glowMat'] = glowMat;
__e['setLight'] = setLight;
__e['canvasTex'] = canvasTex;
__e['paintTex'] = paintTex;
__e['makeNoise'] = makeNoise;
__e['NOISE'] = NOISE;
__e['limbGeo'] = limbGeo;
__e['latheGeo'] = latheGeo;
__e['ellipsoid'] = ellipsoid;
__e['facePlate'] = facePlate;
__e['xf'] = xf;
__e['merge'] = merge;
__e['handGeo'] = handGeo;
__e['footGeo'] = footGeo;
__e['buildHand'] = buildHand;
__e['poseHand'] = poseHand;
__e['animateBiped'] = animateBiped;
__e['animateQuad'] = animateQuad;
__e['animateSpider'] = animateSpider;
__e['freezePose'] = freezePose;
__e['Rig'] = Rig;
__e['clamp'] = clamp;
__e['lerp'] = lerp;
__e['smooth'] = smooth;
  return __e;
})();
})();
