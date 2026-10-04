(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/phobia/models_a.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
const { Rig: Rig, skinMat: skinMat, glowMat: glowMat, canvasTex: canvasTex, paintTex: paintTex, limbGeo: limbGeo, latheGeo: latheGeo, ellipsoid: ellipsoid, xf: xf, merge: merge, poseHand: poseHand, animateBiped: animateBiped, animateQuad: animateQuad, animateSpider: animateSpider, clamp: clamp, lerp: lerp, NOISE: NOISE } = __mod['src/entities/rig.js'];
const { BUILDERS: BUILDERS, HELPERS: HELPERS } = __mod['src/entities/models.js'];
const { organic: organic, cloth: cloth, fleshMat: fleshMat, buildBody: buildBody, headOn: headOn, headLift: headLift, face: face, result: result, HUMAN: HUMAN, noiseFill: noiseFill, srgbHex: srgbHex, tex: tex, sm: sm, mix3: mix3 } = HELPERS;
// The Phobia Wing, part one: procedurally built bodies for the things that
// live in the fear levels. Same conventions as entities/models.js - every
// builder returns { rig, root, mats, glows, kind, height, radius, eyeY,
// animate(st, dt) } - plus optional `anchors(key)` for the field-guide sketch
// and `sketchPose(st)` when the default walk pose would not read well.

const V = () => new THREE.Vector3();

// ------------------------------------------------------------------ shared pieces
/** Eyeball texture: sclera, veins, iris and pupil centred on the sphere's +z. */
function eyeTex(iris = '#3a5a2a', opts = {}) {
  return tex('eye' + iris + (opts.slit ? 's' : '') + (opts.milky ? 'm' : ''), () => canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = opts.milky ? '#d8d6cc' : '#efe9dc'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(160,30,30,0.45)'; g.lineWidth = 1;
    for (let i = 0; i < 26; i++) {
      let x = Math.random() * w, y = Math.random() * h;
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 6; k++) { x += (w * 0.25 - x) * 0.12 + (Math.random() - 0.5) * 8; y += (h * 0.5 - y) * 0.12 + (Math.random() - 0.5) * 8; g.lineTo(x, y); }
      g.stroke();
    }
    const cx = w * 0.25, cy = h * 0.5;
    const rg = g.createRadialGradient(cx, cy, 2, cx, cy, w * 0.07);
    rg.addColorStop(0, iris); rg.addColorStop(0.7, iris); rg.addColorStop(1, '#101010');
    g.fillStyle = rg; g.beginPath(); g.ellipse(cx, cy, w * 0.065, h * 0.13, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = opts.milky ? 'rgba(220,220,210,0.7)' : '#050505';
    if (opts.slit) { g.beginPath(); g.ellipse(cx, cy, w * 0.008, h * 0.11, 0, 0, Math.PI * 2); g.fill(); }
    else { g.beginPath(); g.ellipse(cx, cy, w * 0.025, h * 0.05, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(cx - w * 0.02, cy - h * 0.04, 3, 0, Math.PI * 2); g.fill();
  }));
}

function eyeball(r, iris, opts) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), skinMat('#ffffff', { map: eyeTex(iris, opts), rough: 0.12 }));
  m.castShadow = false;
  return m;
}

/** A soft additive halo card (glow around lures, eyes, cores). */
function haloMat(color, alpha = 0.35) {
  return glowMat(color, {
    map: tex('halo2', () => canvasTex(128, 128, (g, w) => {
      const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.3, 'rgba(255,255,255,0.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r; g.fillRect(0, 0, w, w);
    })), additive: true, transparent: true, depthWrite: false, opacity: alpha,
  });
}

function sprite(map, color, size, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color, transparent: true, opacity, depthWrite: false }));
  s.scale.setScalar(size);
  return s;
}

/** Simple tail / tendril: a chain of tapering segments; returns the groups. */
function chain(parent, n, len, r0, r1, mat, dir = [0, 0, -1]) {
  const segs = [];
  let p = parent;
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group();
    if (i > 0) g.position.set(dir[0] * len, dir[1] * len, dir[2] * len);
    p.add(g);
    const r = lerp(r0, r1, i / Math.max(1, n - 1));
    const geo = new THREE.CylinderGeometry(r * 0.85, r, len * 1.08, 7);
    if (dir[2] !== 0) geo.rotateX(Math.PI / 2 * Math.sign(-dir[2]));
    geo.translate(dir[0] * len / 2, dir[1] * len / 2, dir[2] * len / 2);
    const m = new THREE.Mesh(geo, mat); m.castShadow = true; g.add(m);
    segs.push(g); p = g;
  }
  return segs;
}

// ------------------------------------------------------------------ quadruped kit (dogs, cats)
/**
 * A true four-legged animal: barrel chest, hips, a neck and skull, legs in
 * three segments (digitigrade), a tail chain. o: dimensions and materials.
 */
function quadKit(rig, o) {
  const body = new THREE.Group(); body.position.y = o.hipY; rig.root.add(body);
  const add = (g, m = o.skin, parent = body) => { const me = new THREE.Mesh(g, m); me.castShadow = true; parent.add(me); return me; };
  // torso: chest, belly, hips
  add(xf(ellipsoid(o.chestR * 0.9, o.chestR, o.chestR * 1.05), { z: o.len * 0.3, y: 0.03 }));
  add(xf(ellipsoid(o.chestR * 0.72, o.chestR * 0.72, o.len * 0.45), { z: o.len * 0.02, y: 0.02 + (o.tuck || 0) }));
  add(xf(ellipsoid(o.hipR * 0.95, o.hipR, o.hipR * 1.05), { z: -o.len * 0.3 }));
  if (o.spineBumps) for (let i = 0; i < 9; i++) add(xf(ellipsoid(0.02, 0.018, 0.03), { y: o.chestR * 0.92 - Math.abs(i - 4) * 0.008, z: o.len * (0.35 - i * 0.08) }));
  if (o.ribs) for (let i = 0; i < 5; i++) add(xf(new THREE.TorusGeometry(o.chestR * 0.88, 0.008, 5, 16, Math.PI), { z: o.len * (0.38 - i * 0.06), ry: Math.PI / 2, rz: Math.PI / 2, sy: 1.05 }));
  // neck and head
  const neck = new THREE.Group(); neck.position.set(0, o.chestR * 0.45, o.len * 0.48); body.add(neck);
  add(xf(limbGeo(o.neckLen, o.chestR * 0.55, o.chestR * 0.42), { rx: -Math.PI / 2 - 0.9 }), o.skin, neck);
  const head = new THREE.Group(); head.position.set(0, Math.sin(0.9) * o.neckLen, Math.cos(0.9) * o.neckLen); neck.add(head);
  // legs
  const legs = [];
  const frontReach = o.legA + o.legB + o.legC;
  const rearReach = o.legA * Math.cos(0.45) + o.legB * Math.cos(0.5) + o.legC * Math.cos(0.1);
  const mk = (front, s) => {
    const hip = new THREE.Group(); hip.position.set(s * (front ? o.chestR * 0.62 : o.hipR * 0.6), front ? -0.02 : -0.02 - (frontReach - rearReach), front ? o.len * 0.32 : -o.len * 0.32); body.add(hip);
    const a = o.legA, b = o.legB, c = o.legC;
    add(limbGeo(a, o.legR * 1.3, o.legR, o.legR * 0.4, 0.3, 10), o.skin, hip);
    const knee = new THREE.Group(); knee.position.y = -a; hip.add(knee);
    add(limbGeo(b, o.legR * 0.8, o.legR * 0.55, 0, 0.3, 8), o.skin, knee);
    const ank = new THREE.Group(); ank.position.y = -b; knee.add(ank);
    add(limbGeo(c, o.legR * 0.55, o.legR * 0.5, 0, 0.3, 8), o.skin, ank);
    const paw = add(xf(ellipsoid(o.legR * 0.9, o.legR * 0.5, o.legR * 1.4), { y: -c, z: o.legR * 0.6 }), o.pawMat || o.skin, ank);
    if (o.claws) for (let k = 0; k < 4; k++) add(xf(new THREE.ConeGeometry(0.006, o.claws, 5), { x: (k - 1.5) * o.legR * 0.45, y: -c - 0.01, z: o.legR * 1.8, rx: Math.PI / 2 + 0.6 }), o.clawMat || o.skin, ank);
    legs.push({ hip, knee, ank, paw, front, s, ph: (front ? 0 : Math.PI) + (s > 0 ? 0 : Math.PI * 0.5) });
  };
  mk(true, 1); mk(true, -1); mk(false, 1); mk(false, -1);
  const tailRoot = new THREE.Group(); tailRoot.position.set(0, o.hipR * 0.5, -o.len * 0.42); body.add(tailRoot);
  const tail = chain(tailRoot, o.tailN, o.tailSeg, o.tailR, o.tailR * 0.35, o.tailMat || o.skin);
  return { body, neck, head, legs, tail, add };
}

function animateQuadKit(K, st, dt, o) {
  st.t += dt;
  const v = st.speed;
  const run = clamp((v - 2.0) / 3, 0, 1);
  const moveK = clamp(v / 0.4, 0, 1);
  st.phase += v * dt * (o.gait || 3.2) * (1 - run * 0.25);
  const ph = st.phase;
  const crouch = st.crouch || 0, leap = st.leap || 0;
  K.body.position.y = o.hipY * (1 - crouch * 0.35) + Math.abs(Math.sin(ph)) * 0.03 * moveK + leap * 0.5;
  K.body.rotation.x = -leap * 0.25 + crouch * 0.05 + Math.sin(ph * 2) * 0.02 * moveK;
  K.body.rotation.z = Math.sin(ph) * 0.03 * moveK;
  for (const L of K.legs) {
    const gallop = run > 0.3 ? (L.front ? 0 : Math.PI * 0.85) + (L.s > 0 ? 0.25 : 0) : L.ph;
    const p = ph + gallop;
    const sw = Math.sin(p) * (0.45 + run * 0.35) * moveK;
    const lift = Math.max(0, Math.cos(p)) * moveK;
    if (L.front) {
      L.hip.rotation.x = -sw - leap * 1.1 + crouch * 0.5;
      L.knee.rotation.x = lift * 0.4 + crouch * 0.4;
      L.ank.rotation.x = -lift * 0.9 - crouch * 0.6 - leap * 0.4;
    } else {
      L.hip.rotation.x = -sw * 0.9 - 0.45 - crouch * 0.5 + leap * 0.9;
      L.knee.rotation.x = 0.95 + lift * 0.3 + crouch * 0.7;
      L.ank.rotation.x = -0.6 - lift * 0.4 - crouch * 0.3;
    }
  }
  const att = st.attack || 0;
  K.neck.rotation.x = (st.headDown || 0) + crouch * 0.5 - att * 0.4 + Math.sin(ph * 2) * 0.04 * moveK;
  K.neck.rotation.y = clamp(st.look || 0, -0.9, 0.9) * 0.6;
  K.head.rotation.y = clamp(st.look || 0, -0.9, 0.9) * 0.4;
  K.tail.forEach((g, i) => {
    g.rotation.y = Math.sin(st.t * (o.tailWag || 2) - i * 0.5) * (o.tailSwing || 0.25) * (st.chasing ? 1.6 : 1);
    g.rotation.x = (o.tailLift || 0) * (i === 0 ? 1 : 0.1) + (st.chasing ? -0.08 : 0.05);
  });
}

/** Long hanging hair: strands from a crown ring, merged into one mesh. */
function hairCurtain(len, n, rad, col, frontLen) {
  const strands = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const front = Math.cos(a) > 0.1;
    const L = (front ? frontLen : len) * (0.85 + Math.sin(i * 7.3) * 0.15);
    const geo = new THREE.ConeGeometry(0.012, L, 3, 1); geo.translate(0, -L / 2, 0);
    xf(geo, { x: Math.sin(a) * rad, z: Math.cos(a) * rad * 1.05 + 0.01, rx: Math.cos(a) * 0.25 + 0.05, rz: -Math.sin(a) * 0.2 });
    strands.push(geo);
  }
  return new THREE.Mesh(merge(strands), skinMat(col, { rough: 0.55 }));
}

__e['eyeTex'] = eyeTex;
__e['eyeball'] = eyeball;
__e['haloMat'] = haloMat;
__e['chain'] = chain;
__e['hairCurtain'] = hairCurtain;
__e['quadKit'] = quadKit;
__e['animateQuadKit'] = animateQuadKit;
__e['V'] = V;
__e['sprite'] = sprite;
  return __e;
})();
})();
