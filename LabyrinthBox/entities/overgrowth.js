// =============================================================================
//  The Overgrowth   (entity id: 'overgrowth')
//
//  One self-contained entity file:
//    - the three.js model builder
//    - its stats / field-guide entry and AI hooks
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateBiped, ellipsoid, glowMat, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, ph, PL, place } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 41  THE OVERGROWTH (botanophobia)
function buildOvergrowth() {
  const p = { ...HUMAN, hipH: 1.05, chestW: 0.38, armR: 1.0, legR: 1.0, upperArm: 0.42, foreArm: 0.42, headR: 0.14 };
  const rig = new Rig(p);
  const vine = fleshMat(organic('vine', { base: '#3a4a1e', dark: '#141a08', light: '#6a7a3a', wrinkle: 0.95, wrinkleF: 30, veins: 0.3, mottle: 0.7, repeat: [1, 4] }), { rough: 0.75, bumpScale: 3 });
  buildBody(rig, p, { skin: vine, top: vine, bottom: vine, shoes: vine }, { fingerLen: 0.2, fingerR: 0.8, fingerVar: true, chestDepth: 0.6 });
  // twisted vines spiralling around every limb, leaves and thorns
  const leafM = skinMat('#2e4a14', { rough: 0.6, side: THREE.DoubleSide });
  const thornM = skinMat('#2a1a0a', { rough: 0.4 });
  const spiral = (len, r) => { const pts = []; for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 5; pts.push(new THREE.Vector3(Math.cos(a) * r, -i / 30 * len, Math.sin(a) * r)); } return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.012, 5); };
  const decorate = (bone, len, r) => {
    rig.attach(bone, spiral(len, r), vine, { rigid: true });
    const lv = [], th = [];
    for (let i = 0; i < 4; i++) { const a = i * 1.9; lv.push(xf(new THREE.CircleGeometry(0.06, 6), { x: Math.cos(a) * (r + 0.03), y: -len * (0.2 + i * 0.2), z: Math.sin(a) * (r + 0.03), sx: 0.5, ry: a, rx: 0.5 })); th.push(xf(new THREE.ConeGeometry(0.005, 0.03, 4), { x: Math.cos(a + 1) * (r + 0.01), y: -len * (0.1 + i * 0.22), z: Math.sin(a + 1) * (r + 0.01), rz: -Math.cos(a + 1) * 1.5, rx: Math.sin(a + 1) * 1.5 })); }
    rig.attach(bone, merge(lv), leafM, { rigid: true, shadow: false });
    rig.attach(bone, merge(th), thornM, { rigid: true, shadow: false });
  };
  for (const A of rig.arms) { decorate(A.sh, p.upperArm, 0.06); decorate(A.el, p.foreArm, 0.05); }
  for (const L of rig.legs) { decorate(L.hip, p.thigh, 0.09); decorate(L.kn, p.shin, 0.065); }
  decorate(rig.chest, p.chestH, 0.2);
  // no head: a knot of leaves with two seed-pod eyes glowing in it
  const hl = headLift(p);
  const knot = []; for (let i = 0; i < 14; i++) { const a = i * 2.4, b = i * 1.1; knot.push(xf(new THREE.CircleGeometry(0.09, 6), { x: Math.cos(a) * 0.1, y: hl + Math.sin(b) * 0.08, z: Math.sin(a) * 0.1, ry: a, rx: b, sx: 0.55 })); }
  rig.attach(rig.head, merge(knot), leafM, { rigid: true });
  for (const s of [-1, 1]) rig.attach(rig.head, xf(ellipsoid(0.02, 0.028, 0.015), { x: s * 0.045, y: hl + 0.02, z: 0.1 }), glowMat('#d8f070'), { rigid: true, shadow: false });
  return result(rig, {
    kind: 'biped', height: 2.1, radius: 0.36, eyeY: 1.95,
    animate(st, dt) {
      st.lean = 0.1; st.hunch = 0.2; st.stride = 1.1; st.armSwing = 0.5; st.grip = 0.7; st.tilt = Math.sin(st.t * 0.4) * 0.3; st.sway = 0.08;
      animateBiped(rig, st, dt);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.overgrowth = buildOvergrowth;

// 41 --------------------------------------------------------------- THE OVERGROWTH
D.overgrowth = {
  name: 'The Overgrowth', speed: 0.9, chase: 2.4, detect: 14, dmg: 20, reach: 1.6, cd: 1.3, memory: 10, voice: 'rustle',
  num: 'Φ-41 · Botanophobia', cls: 'Hostile', size: '2.1 m',
  desc: 'A walking knot of vines, thorns and leaves in the shape of a person, two seed-pod eyes glowing in the place a head should be.',
  notes: 'It is slow. It does not need to be fast. Roots burst up out of the floor wherever it is looking, snaring whatever stands there, and creeping vines grow over the floors it walks.',
  tips: ['When the floor under you rustles, jump or sprint off the spot.', 'Vine-covered floor slows you to a crawl — go around.', 'It roots slowly: keep moving and it can never catch you.'],
  sketch: [['head', 'seed-pod eyes'], ['chest', 'vines and thorns'], ['foot', 'roots under the floor']],
  frame(m, e, dt, d) {
    e.vineT = (e.vineT || 0) - dt;
    if (e.vineT <= 0 && e.speed > 0.2 && ph(m)) { e.vineT = 1.4; ph(m).vinePatch(e.pos.x, e.pos.z); }
    e.snareT = (e.snareT || 4) - dt;
    if (e.state === 'chase' && d < 11 && e.snareT <= 0 && ph(m)) { e.snareT = 6 + m.rng.next() * 3; const P = PL(m).pos; ph(m).rootSnare(P.x, P.z, e); }
    return null;
  },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
