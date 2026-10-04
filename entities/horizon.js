// =============================================================================
//  The Horizon Man   (entity id: 'horizon')
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
const { animateBiped, clamp, latheGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, headLift, headOn, HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, PL, place, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 17  THE HORIZON MAN (agoraphobia)
function buildHorizon() {
  const p = { ...HUMAN, hipH: 1.6, thigh: 0.78, shin: 0.78, spine: 0.3, chestH: 0.44, neck: 0.18, shoulderW: 0.42, upperArm: 0.62, foreArm: 0.62, chestW: 0.3, armR: 0.6, legR: 0.55, headR: 0.11 };
  const rig = new Rig(p);
  const black = skinMat('#050506', { rough: 0.95 });
  buildBody(rig, p, { skin: black, top: black, bottom: black, shoes: black }, { fingerLen: 0.13, sleeve: true });
  headOn(rig, p, black, 1, 1.15, 1.05);
  const hl = headLift(p);
  // long coat and a wide-brimmed hat; no face at all
  const coat = latheGeo([[-p.hipH + 0.15, 0.36], [-p.hipH * 0.5, 0.3], [0.0, 0.24], [p.spine + p.chestH * 0.8, 0.26], [p.spine + p.chestH + 0.02, 0.1]], 0.7, 20);
  const coatM = rig.attach(rig.hips, coat, black, { rigid: true });
  rig.attach(rig.head, xf(new THREE.CylinderGeometry(0.3, 0.3, 0.012, 24), { y: hl + 0.1 }), black, { rigid: true });
  rig.attach(rig.head, xf(new THREE.CylinderGeometry(0.11, 0.12, 0.16, 18), { y: hl + 0.18 }), black, { rigid: true });
  return result(rig, {
    kind: 'biped', height: 3.2, radius: 0.32, eyeY: 3.0,
    animate(st, dt) {
      st.stride = 2.6; st.armSwing = 0.15; st.lean = 0; st.hunch = 0.02; st.grip = 0.1;
      animateBiped(rig, st, dt);
      coatM.rotation.x = Math.sin(st.phase) * 0.06 * clamp(st.speed, 0, 1) + Math.sin(st.t * 0.7) * 0.02;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.horizon = buildHorizon;

// 17 --------------------------------------------------------------- THE HORIZON MAN
D.horizon = {
  name: 'The Horizon Man', speed: 2.4, chase: 2.4, detect: 999, dmg: 60, reach: 1.6, cd: 2, memory: 999, xray: true, noLeash: true, viewDist: 160, voice: 'drone', anywhere: true,
  num: 'Φ-17 · Agoraphobia', cls: 'Lethal', size: '3.2 m',
  desc: 'A black figure in a long coat and a wide hat, standing on the horizon. Every time you look up, it is standing a little closer.',
  notes: 'It only ever walks while you are out in the open, far from any wall or shelter. Stand close to something and it stops and waits. Out in the empty lot it keeps on coming, never running, never stopping.',
  tips: ['Move from shelter to shelter.', 'The longer you stay in the open, the closer it gets.', 'It is slow up close. It is not slow far away.'],
  sketch: [['head', 'no face'], ['chest', 'long coat'], ['foot', 'always walking']],
  spawnFn(m, type) { const P = PL(m).pos; const a = m.rng.next() * TAU; return m.make(type, P.x + Math.cos(a) * 55, P.z + Math.sin(a) * 55); },
  frame(m, e, dt, d) {
    const P = PL(m).pos;
    const cover = m.nav.blockedBox(P.x - 3.5, P.z - 3.5, P.x + 3.5, P.z + 3.5, 0.6);
    e.freeze = cover;
    e.threat = cover ? 0 : clamp(1 - d / 30, 0, 1);
    if (d > 70) place(m, e, P.x + (e.pos.x - P.x) / d * 55, P.z + (e.pos.z - P.z) / d * 55);
    return null;
  },
  speedFn(m, e, want, d) { return (d > 28 ? 4.8 : 2.3) * m.diff.speed; },
  think(m, e) { if (!e.freeze) chaseTo(m, e); },
};

})();
