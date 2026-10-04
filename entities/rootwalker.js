// =============================================================================
//  The Rootwalker   (entity id: 'rootwalker')
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
const { V } = __mod['src/phobia/models_b.js'];
const { clamp, ellipsoid, glowMat, limbGeo, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { face, fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { chain } = __mod['src/phobia/models_a.js'];
const { D, ph, PL, place, spotAround, strike, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 43  THE ROOTWALKER (dendrophobia)
function buildRootwalker() {
  const rig = new Rig({ ...HUMAN });
  const bark = fleshMat(organic('treebark', { base: '#4a3a2a', dark: '#1a120a', light: '#6a5a44', wrinkle: 1, wrinkleF: 18, veins: 0.2, mottle: 0.8, pores: 0.3, repeat: [1, 3] }), { rough: 0.95, bumpScale: 4 });
  const body = new THREE.Group(); rig.root.add(body);
  const add = (g, m = bark, parent = body) => { const me = new THREE.Mesh(g, m); me.castShadow = true; parent.add(me); return me; };
  // a trunk with a hollow knot for a face
  const trunk = new THREE.Group(); trunk.position.y = 1.0; body.add(trunk);
  add(xf(new THREE.CylinderGeometry(0.2, 0.28, 2.4, 12, 6), { y: 1.2 }), bark, trunk);
  const knot = skinMat('#0a0604', { rough: 1 });
  add(xf(ellipsoid(0.06, 0.09, 0.04), { x: -0.07, y: 1.95, z: 0.18 }), knot, trunk);
  add(xf(ellipsoid(0.05, 0.07, 0.04), { x: 0.08, y: 1.98, z: 0.18 }), knot, trunk);
  add(xf(ellipsoid(0.08, 0.13, 0.04), { y: 1.7, z: 0.2 }), knot, trunk);
  for (const [x, y] of [[-0.07, 1.95], [0.08, 1.98]]) add(xf(ellipsoid(0.012, 0.012, 0.01), { x, y, z: 0.21 }), glowMat('#e0a040'), trunk);
  // branches for arms, twigs at the ends
  const arms = [];
  for (const s of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(s * 0.18, 2.0, 0); trunk.add(sh);
    const segs = chain(sh, 5, 0.32, 0.07, 0.025, bark, [0, -1, 0]);
    const tip = segs[segs.length - 1];
    for (let k = 0; k < 4; k++) { const tw = new THREE.Group(); tw.position.y = -0.3; tw.rotation.set(0.3 * (k - 1.5), 0, s * 0.4 * (k - 1.5)); tip.add(tw); add(xf(limbGeo(0.25, 0.012, 0.004), {}), bark, tw); }
    arms.push({ sh, segs, s });
  }
  // crown of dead branches
  const crown = [];
  for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; crown.push(xf(new THREE.CylinderGeometry(0.01, 0.04, 1.2, 5), { x: Math.cos(a) * 0.25, y: 2.8, z: Math.sin(a) * 0.25, rz: -Math.cos(a) * 0.6, rx: Math.sin(a) * 0.6 })); }
  add(merge(crown), bark, trunk);
  // roots for legs: they drag and plant
  const roots = [];
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * Math.PI * 2;
    const r = new THREE.Group(); r.position.set(Math.cos(a) * 0.18, 1.0, Math.sin(a) * 0.18); r.rotation.y = -a; body.add(r);
    const segs = chain(r, 4, 0.3, 0.08, 0.02, bark, [0, -1, 0]);
    roots.push({ r, segs, a, ph: k * 1.1 });
  }
  rig.finalize();
  return result(rig, {
    kind: 'tree', height: 3.6, radius: 0.45, eyeY: 2.8, body: trunk, frozenPose: true,
    animate(st, dt) {
      st.t += dt;
      const v = st.speed, moveK = clamp(v / 0.5, 0, 1);
      st.phase += v * dt * 2.2;
      trunk.rotation.z = Math.sin(st.phase) * 0.06 * moveK + Math.sin(st.t * 0.4) * 0.01;
      trunk.rotation.x = 0.05 * moveK + (st.attack || 0) * 0.3;
      trunk.position.y = 1.0 + Math.abs(Math.sin(st.phase)) * 0.06 * moveK;
      for (const R of roots) R.segs.forEach((g, i) => { g.rotation.z = (i === 0 ? 0.75 + Math.max(0, Math.sin(st.phase + R.ph)) * 0.35 * moveK : -0.22); });
      for (const A of arms) A.segs.forEach((g, i) => { g.rotation.z = A.s * (i === 0 ? 0.7 : 0.15) + Math.sin(st.t * 0.8 + i) * 0.03; g.rotation.x = -(st.attack || 0) * (i < 2 ? 0.8 : 0.2) - (st.chasing ? 0.2 : 0); });
    },
    anchors(key) { const v = V(); trunk.getWorldPosition(v); v.y += { head: 1.95, chest: 1.2, hand: 1.6, foot: -0.85 }[key] ?? 1; if (key === 'hand') v.x += 0.6; return v; },
  });
}


__mod['src/entities/registry.js'].BUILDERS.rootwalker = buildRootwalker;

// 43 --------------------------------------------------------------- THE ROOTWALKER
D.rootwalker = {
  name: 'The Rootwalker', speed: 0, chase: 1.8, detect: 999, dmg: 38, reach: 2.4, cd: 2.2, memory: 999, xray: true, noAttack: true, voice: 'creakwood', freezePose: true,
  num: 'Φ-43 · Dendrophobia', cls: 'Lethal', size: '3.6 m',
  desc: 'A dead tree, crown of bare branches, a hollow knot in the trunk. One of the knots has two faint amber lights in it. It is not where it was a minute ago.',
  notes: 'It uproots and replants itself while you are not looking, always somewhere ahead of you on your way. It looks exactly like every other dead tree. Walk close enough and the branches come down.',
  tips: ['Count the trees you pass with amber in their knots.', 'Never walk right beside a dead tree.', 'If you spot it, go around at three metres or more.'],
  sketch: [['head', 'amber in the knot'], ['hand', 'branches'], ['foot', 'roots that walk']],
  observe(m, e, looked) { return looked > 0; },
  init(m, e) { e.mode = 'plant'; e.modeT = 0; },
  frame(m, e, dt, d, looked) {
    e.modeT += dt; e.cd -= dt;
    if (d < e.def.reach + 0.4 && e.cd <= 0) { e.cd = e.def.cd; e.swingT = 0.45; m.game.audio.entity(e.type, 'attack', e.pos, PL(m)); }
    if (e.swingT > 0) { e.swingT -= dt; e.st.attack = 1 - e.swingT / 0.45; if (e.swingT <= 0.15 && !e.swung && d < e.def.reach + 0.6) { e.swung = true; strike(m, e, e.def.dmg, 5); } if (e.swingT <= 0) { e.swung = false; e.st.attack = 0; } }
    if (looked <= 0 && e.modeT > 9 && (d > 14 || d < 4)) {
      e.modeT = 0;
      const s = spotAround(m, 1, 9, 16, true, 0.5);
      if (s) { place(m, e, s[0], s[1]); e.yaw = m.rng.next() * TAU; }
    }
    e.freeze = true;
    e.threat = d < 6 ? 0.6 : 0;
    return 'static';
  },
};

})();
