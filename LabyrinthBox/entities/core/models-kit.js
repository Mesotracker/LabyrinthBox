(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/entities/models.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
const { Rig: Rig, skinMat: skinMat, glowMat: glowMat, canvasTex: canvasTex, paintTex: paintTex, limbGeo: limbGeo, latheGeo: latheGeo, ellipsoid: ellipsoid, facePlate: facePlate, xf: xf, merge: merge, footGeo: footGeo, buildHand: buildHand, poseHand: poseHand, animateBiped: animateBiped, animateQuad: animateQuad, animateSpider: animateSpider, clamp: clamp, lerp: lerp, NOISE: NOISE } = __mod['src/entities/rig.js'];
// Entity models. Every creature is built procedurally on a bone skeleton with
// one continuous skinned surface (see rig.js), procedurally painted skin and
// cloth with matching bump maps, and painted faces, so the game ships without
// assets. Each builder returns { rig, mats, glows, kind, height, radius, eyeY,
// animate(st, dt) }.

// ------------------------------------------------------------------ texture helpers
const TEX = {};
function tex(name, fn) { return TEX[name] || (TEX[name] = fn()); }
const hex = (h) => { const c = new THREE.Color(h); return [Math.pow(c.r, 1), Math.pow(c.g, 1), Math.pow(c.b, 1)]; };
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

function srgbHex(h) {
  const c = new THREE.Color(h);
  c.convertLinearToSRGB();
  return [c.r, c.g, c.b];
}

/**
 * Organic skin: fbm mottling, a vein network, pores, wrinkles, optional scars
 * and stripes; returns { map, bump } that tile around lathe-built limbs.
 */
function organic(name, o) {
  return tex(name, () => {
    const base = srgbHex(o.base), dark = srgbHex(o.dark || o.base), light = srgbHex(o.light || o.base);
    const vein = srgbHex(o.vein || '#5a2a3a'), extra = o.extra ? srgbHex(o.extra) : null;
    const sz = o.size || 256;
    const r = paintTex(sz, sz, (u, v, N, out) => {
      const m = N.fbm(u + (o.seed || 0), v, 3, 5);
      const f = N.fbm(u * 1.0 + 0.37, v + 0.71, 14, 4);
      const ridge = N.ridged(u + 0.13 + (o.seed || 0), v + 0.29, 5, 4);
      const vn = sm(0.84, 0.97, ridge) * (o.veins ?? 0.5);
      const [c1] = N.cell(u, v, o.poreF || 40);
      const pore = sm(0.22, 0.08, c1) * (o.pores ?? 0.4);
      const wr = o.wrinkle ? Math.pow(Math.abs(Math.sin((v * (o.wrinkleF || 60) + N.fbm(u, v, 6, 3) * 5) * Math.PI)), 6) * o.wrinkle : 0;
      let c = mix3(base, dark, sm(0.35, 0.72, m) * (o.mottle ?? 0.6));
      c = mix3(c, light, sm(0.55, 0.85, f) * 0.35);
      c = mix3(c, vein, vn * 0.75);
      c = mix3(c, dark, wr * 0.5 + pore * 0.35);
      let h = 0.5 + (f - 0.5) * 0.35 - pore * 0.35 + vn * 0.25 - wr * 0.4;
      if (o.stripes) {
        const sx = Math.abs(Math.sin((u * o.stripes + N.fbm(u, v * 0.5, 3, 4) * 2.2 + v * 0.6) * Math.PI));
        const wid = 0.93 + N.fbm(u + 0.2, v, 6, 3) * 0.06;
        const st = sm(wid, 0.995, sx) * sm(o.stripeV0 ?? 0, (o.stripeV0 ?? 0) + 0.35, v) * sm(0.25, 0.6, N.fbm(u + 1.7, v * 0.3, 2, 3) + 0.2);
        c = mix3(c, extra || [0.6, 0.05, 0.05], st * 0.85);
        h -= st * 0.15;
      }
      if (o.tears) {
        const [d1, d2] = N.cell(u + 0.5, v + 0.2, o.tearF || 5);
        const edge = d2 - d1;
        const tear = sm(0.3, 0.22, d1) * sm(0.5, 0.75, N.fbm(u + 3.1, v, 3, 3));
        const fib = 0.75 + 0.25 * Math.sin(v * 220 + N.fbm(u, v, 9, 2) * 6);
        const meat = mix3(extra || [0.35, 0.1, 0.3], [0.15, 0.03, 0.12], 1 - fib);
        c = mix3(c, meat, tear * o.tears);
        h += tear * o.tears * (-0.35 + fib * 0.1);
        if (edge < 0.05) h += 0.05;
      }
      if (o.drips) {
        const col = N.n2(u * 40, 0, 40, 1);
        const len = N.n2(u * 40 + 7, 3, 40, 1);
        const drip = sm(0.75, 0.9, col) * sm(len, len - 0.15, v);
        c = mix3(c, [0.42, 0.42, 0.45], drip * o.drips);
        h += drip * 0.2;
      }
      if (o.patches) {
        // stitched-together skin: cells of slightly different tone with seams
        const [d1, d2] = N.cell(u, v, o.patches);
        const id = N.n2(Math.floor(u * o.patches * 3.7), Math.floor(v * o.patches * 2.3));
        c = mix3(c, mix3(dark, light, id), 0.35);
        const seam = sm(0.06, 0.0, d2 - d1);
        const stitch = seam * sm(0.4, 0.9, Math.abs(Math.sin((u + v) * 260)));
        c = mix3(c, [0.15, 0.06, 0.05], seam * 0.6 + stitch * 0.4);
        h += -seam * 0.3 + stitch * 0.3;
      }
      out.h = h;
      return c;
    }, { bump: true, repeat: o.repeat || [1, 1] });
    return r;
  });
}

/** Woven cloth with weave relief, wear and stains. */
function cloth(name, o) {
  return tex(name, () => {
    const base = srgbHex(o.base), dark = srgbHex(o.dark || o.base), stain = srgbHex(o.stain || '#3a2a1a');
    const sz = o.size || 256;
    return paintTex(sz, sz, (u, v, N, out) => {
      const F = o.weave || 90;
      const wx = Math.sin(u * F * Math.PI * 2), wy = Math.sin(v * F * Math.PI * 2);
      const over = (Math.floor(u * F * 2) + Math.floor(v * F * 2)) % 2;
      const thread = over ? wx * 0.5 + 0.5 : wy * 0.5 + 0.5;
      const m = N.fbm(u, v, 4, 5);
      const st = sm(0.6, 0.8, N.fbm(u + 0.5, v + 0.2, 3, 4)) * (o.stains ?? 0.4);
      const wear = sm(0.62, 0.8, N.fbm(u + 0.9, v + 0.4, 8, 3)) * (o.wear ?? 0.3);
      let c = mix3(base, dark, sm(0.3, 0.7, m) * 0.5 + (1 - thread) * 0.18);
      if (o.twill) { const tw = Math.abs(Math.sin((u + v) * F * 1.5 * Math.PI)); c = mix3(c, srgbHex(o.twill), tw * 0.35); }
      c = mix3(c, stain, st * 0.6);
      c = mix3(c, mix3(c, [0.9, 0.88, 0.8], 0.4), wear);
      out.h = 0.5 + (thread - 0.5) * 0.35 - st * 0.1;
      return c;
    }, { bump: true, repeat: o.repeat || [1, 1] });
  });
}

/** Painted-on background for canvas faces: an fbm fill instead of flat paint. */
function noiseFill(g, w, h, base, spots, n = 900, rmax = 6) {
  const b = srgbHex(base), s = spots.map(srgbHex);
  const img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = x / w, v = y / h;
    const m = NOISE.fbm(u, v, 5, 5);
    const k = NOISE.fbm(u + 0.4, v + 0.1, 16, 3);
    let c = mix3(b, s[0], sm(0.35, 0.75, m) * 0.6);
    if (s[1]) c = mix3(c, s[1], sm(0.6, 0.9, k) * 0.5);
    if (s[2]) c = mix3(c, s[2], sm(0.7, 0.95, NOISE.fbm(u + 0.8, v + 0.3, 9, 3)) * 0.5);
    const i = (x + y * w) * 4;
    img.data[i] = c[0] * 255; img.data[i + 1] = c[1] * 255; img.data[i + 2] = c[2] * 255; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  void n; void rmax;
}

const houndFace = () => tex('hound', () => canvasTex(256, 256, (g, w, h) => {
  noiseFill(g, w, h, '#d4cbbd', ['#a99c8c', '#e8e0d4', '#8c7f70']);
  g.fillStyle = '#060404';
  for (const x of [0.33, 0.67]) { g.beginPath(); g.ellipse(w * x, h * 0.4, w * 0.08, h * 0.1, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = 'rgba(200,190,150,0.9)';
  for (const x of [0.33, 0.67]) { g.beginPath(); g.arc(w * x, h * 0.42, 3, 0, Math.PI * 2); g.fill(); }
}));

const mothWing = () => tex('moth', () => {
  const r = paintTex(512, 256, (u, v, N, out) => {
    // wing outline in uv space, scales, veins and two eyespots
    const x = u, y = v;
    const top = 0.5 - 0.62 * Math.sin(Math.PI * Math.min(1, x * 1.05)) * (0.6 + 0.4 * x);
    const bot = 0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, x * 1.15)) * (0.9 - 0.3 * x);
    const inside = y > top && y < bot && x < 0.99;
    out.a = inside ? 1 : 0;
    const m = N.fbm(u, v, 6, 5);
    let c = mix3([0.42, 0.35, 0.26], [0.18, 0.14, 0.1], sm(0.3, 0.7, m));
    const scales = 0.85 + 0.15 * N.n2(u * 300, v * 160);
    c = c.map((k) => k * scales);
    const band = sm(0.04, 0.0, Math.abs(x - 0.55 - Math.sin(y * 9) * 0.03));
    c = mix3(c, [0.75, 0.66, 0.48], band * 0.7);
    for (const [ex, ey, er] of [[0.62, 0.42, 0.13], [0.33, 0.58, 0.08]]) {
      const d = Math.hypot((x - ex) * 2, y - ey) / er;
      if (d < 1) c = d < 0.55 ? (d < 0.2 ? [0.85, 0.78, 0.55] : [0.08, 0.05, 0.04]) : [0.88, 0.82, 0.66];
    }
    const ang = Math.atan2(y - 0.5, x + 0.02);
    const vein = sm(0.03, 0.0, Math.abs(Math.sin(ang * 7)) * (x + 0.1) * 0.6);
    c = mix3(c, [0.1, 0.07, 0.05], vein * 0.6);
    out.h = 0.5 + vein * 0.2;
    return c;
  }, { bump: true });
  return r;
});

/** Soft smoke puff for the Haze. */
const smokeTex = () => tex('smoke', () => paintTex(128, 128, (u, v, N, out) => {
  const d = Math.hypot(u - 0.5, v - 0.5) * 2;
  const n = N.fbm(u, v, 4, 5);
  out.a = clamp((1 - d) * 1.3 * sm(0.25, 0.7, n + (1 - d) * 0.35), 0, 1) * 0.85;
  const k = 0.7 + n * 0.3;
  return [0.8 * k, 0.78 * k, 0.66 * k];
}).map);

/** Skin material with procedural albedo + bump. */
function fleshMat(t, o = {}) {
  return skinMat(o.tint || '#a4a4a4', { map: t.map, bump: t.bump, bumpScale: o.bumpScale ?? 1.2, rough: o.rough ?? 0.7, ...o });
}

// ------------------------------------------------------------------ humanoid body
const HUMAN = {
  hipH: 0.95, hipW: 0.2, thigh: 0.45, shin: 0.43, footH: 0.07, spine: 0.2, chestH: 0.32, neck: 0.08,
  shoulderW: 0.4, upperArm: 0.3, foreArm: 0.27, chestW: 0.36, armR: 1, legR: 1, headR: 0.11,
};

/**
 * Standard body on a rig. mats: { skin, top, bottom, shoes, hands, arms }.
 * Every part is weighted to its own bone and blended into its neighbours.
 */
function buildBody(rig, p, mats, o = {}) {
  const ar = p.armR, lr = p.legR, cw = p.chestW;
  const belly = o.belly || 1;
  // pelvis and glutes
  rig.attach(rig.hips, ellipsoid(p.hipW * 0.8 * lr + 0.04, 0.12, 0.125 * belly), mats.bottom, { parent: null, axis: [0, 1, 0], len: 0.03, child: rig.spine, bw: 0.06 });
  // abdomen
  rig.attach(rig.spine, latheGeo([[-0.04, cw * 0.38], [p.spine * 0.5, cw * 0.36 * belly], [p.spine + 0.03, cw * 0.41]], o.chestDepth ? o.chestDepth * 1.05 : 0.66), mats.top, { parent: rig.hips, child: rig.chest, bw: 0.07 });
  // ribcage with pectorals
  rig.attach(rig.chest, latheGeo([
    [-0.03, cw * 0.41], [p.chestH * 0.3, cw * 0.48], [p.chestH * 0.7, cw * 0.52],
    [p.chestH * 0.92, cw * 0.43], [p.chestH + 0.03, 0.07 * (o.neckR || 1)],
  ], o.chestDepth || 0.6), mats.top, { parent: rig.spine, child: rig.neck, bw: 0.05 });
  if (o.ribs) {
    for (let i = 0; i < 5; i++) rig.attach(rig.chest, xf(new THREE.TorusGeometry(cw * 0.47 - i * 0.008, 0.01, 6, 20, Math.PI * 0.9), { y: p.chestH * (0.25 + i * 0.12), rx: Math.PI / 2, rz: Math.PI * 0.05, sy: (o.chestDepth || 0.6) * 1.02 }), mats.top, { parent: null });
  }
  for (const A of rig.arms) {
    // trapezius slope and deltoid
    rig.attach(A.clav, xf(ellipsoid(p.shoulderW * 0.26, 0.045 * ar, 0.055 * ar), { x: A.side * p.shoulderW * 0.17, y: -0.01 }), mats.top, { parent: rig.chest, axis: [A.side, 0, 0], len: p.shoulderW * 0.38, child: A.sh, bw: 0.05 });
    rig.attach(A.sh, xf(ellipsoid(0.068 * ar, 0.08 * ar, 0.07 * ar), { y: -0.03 }), mats.arms || mats.top, { parent: A.clav, child: A.el, bw: 0.05 });
    rig.attach(A.sh, limbGeo(p.upperArm, 0.05 * ar, 0.037 * ar, 0.013 * ar, 0.35, 12), o.sleeve ? mats.top : (mats.arms || mats.skin), { parent: A.clav, child: A.el, bw: 0.045 });
    rig.attach(A.el, limbGeo(p.foreArm, 0.041 * ar, 0.027 * ar, 0.012 * ar, 0.22, 12, 0.85), mats.arms || mats.skin, { parent: A.sh, child: A.wr, bw: 0.04 });
    buildHand(rig, A, mats.hands || mats.skin, o);
  }
  rig.attach(rig.neck, xf(new THREE.CylinderGeometry(0.043 * (o.neckR || 1), 0.054 * (o.neckR || 1), p.neck + 0.08, 12, 3), { y: p.neck / 2 }), mats.skin, { parent: rig.chest, child: rig.head, bw: 0.035 });
  for (const L of rig.legs) {
    rig.attach(L.hip, limbGeo(p.thigh, 0.082 * lr, 0.05 * lr, 0.016 * lr, 0.3, 12), mats.bottom, { parent: rig.hips, child: L.kn, bw: 0.06 });
    rig.attach(L.kn, limbGeo(p.shin, 0.053 * lr, 0.033 * lr, 0.016 * lr, 0.24, 12, 0.92), mats.legs || mats.bottom, { parent: L.hip, child: L.an, bw: 0.045 });
    rig.attach(L.an, footGeo(o.footLen || 0.25, 0.05 * lr, 0.065), mats.shoes, { parent: L.kn, axis: [0, -1, 0], len: 0.2, bw: 0.03, shadow: false });
  }
}

/** Head sits above the neck joint so turning it does not shear the skull. */
function headLift(p) { return p.headR * 0.75; }

function headOn(rig, p, mat, sx = 1, sy = 1.18, sz = 1.08) {
  const r = p.headR;
  rig.attach(rig.head, xf(ellipsoid(r * sx, r * sy, r * sz, 22, 18), { y: headLift(p) }), mat, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.025 });
  // jaw line and cheekbones break up the perfect egg
  rig.attach(rig.head, xf(ellipsoid(r * sx * 0.78, r * 0.45, r * sz * 0.8, 16, 10), { y: headLift(p) - r * 0.55, z: r * 0.12 }), mat, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
}

function face(rig, p, map, mat, o = {}) {
  const r = p.headR * (o.r || 1.03);
  const g = facePlate(r, o.w || 1.7, o.h || 1.6);
  g.scale(o.sx || 1, o.sy || 1.18, o.sz || 1.08);
  return rig.attach(rig.head, xf(g, { y: (o.y || 0) + headLift(p), z: o.z || 0 }), mat, { rigid: true, shadow: false });
}

function result(rig, extra) {
  rig.finalize();
  const mats = [];
  const glows = [];
  rig.root.traverse((o) => {
    if (!o.isMesh && !o.isSprite) return;
    const list = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of list) {
      if (m.isMeshBasicMaterial || m.isSpriteMaterial) { if (!glows.includes(m)) glows.push(m); } else if (!mats.includes(m)) mats.push(m);
    }
  });
  return { rig, root: rig.root, mats, glows, ...extra };
}

function buildModel(type, rng) {
  const b = BUILDERS[type];
  if (!b) throw new Error('Unknown entity ' + type);
  const m = b(rng);
  m.root.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
  return m;
}



const BUILDERS = __mod['src/entities/registry.js'].BUILDERS;

function buildModel(type, rng) {
  const b = BUILDERS[type];
  if (!b) throw new Error('Unknown entity ' + type);
  const m = b(rng);
  m.root.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
  return m;
}



__e['buildModel'] = buildModel;
__e['BUILDERS'] = BUILDERS;
__e['HELPERS'] = { TEX, tex, hex, mix3, sm, srgbHex, organic, cloth, noiseFill, houndFace, mothWing, smokeTex, fleshMat, HUMAN, buildBody, headLift, headOn, face, result, buildModel };
  return __e;
})();
})();
