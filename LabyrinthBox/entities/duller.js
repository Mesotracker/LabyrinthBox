// =============================================================================
//  Duller   (entity id: 'duller')
//
//  One self-contained entity file:
//    - the three.js model builder
//    - its stats / field-guide entry
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const { buildBody, face, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, ellipsoid, limbGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/** Duller (Entity 6): long, dark, wrinkled, torn open to purple muscle, leaking grey. */
function buildDuller() {
  const p = { ...HUMAN, hipH: 1.12, thigh: 0.54, shin: 0.52, spine: 0.27, chestH: 0.38, neck: 0.2, shoulderW: 0.38, upperArm: 0.46, foreArm: 0.46, chestW: 0.3, armR: 0.66, legR: 0.6, headR: 0.11 };
  const rig = new Rig(p);
  const t = organic('duller', { base: '#1c1a1f', dark: '#09080a', light: '#33303a', veins: 0.4, vein: '#3a1a40', pores: 0.3, wrinkle: 0.9, wrinkleF: 90, mottle: 0.5, tears: 0.9, tearF: 4, extra: '#5a2a68', drips: 0.8 });
  const skin = fleshMat(t, { rough: 0.45, bumpScale: 2.6 });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.15, claws: 0.02, chestDepth: 0.52, neckR: 0.75, footLen: 0.28, fingerVar: true });
  // elongated head, concave cavities instead of a face
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(p.headR * 0.95, p.headR * 1.55, p.headR * 1.05, 22, 18), { y: hl + 0.04 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.025 });
  const cav = skinMat('#030203', { rough: 0.25 });
  for (const [x, y, rx, ry] of [[-0.04, 0.06, 0.03, 0.04], [0.045, 0.05, 0.025, 0.035], [0.0, -0.05, 0.04, 0.05]]) {
    rig.attach(rig.head, xf(ellipsoid(rx, ry, 0.02), { x, y: hl + y, z: p.headR * 0.92 }), cav, { rigid: true, shadow: false });
  }
  // a mutation: a withered third arm growing out of the back
  const extra = rig.joint(rig.chest, -0.06, p.chestH * 0.7, -0.12);
  const ex2 = rig.joint(extra, 0, -0.32, 0);
  extra.rotation.set(-2.3, 0.4, 0.5);
  rig.attach(extra, limbGeo(0.32, 0.03, 0.022, 0.006), skin, { parent: rig.chest, child: ex2, bw: 0.04 });
  rig.attach(ex2, limbGeo(0.3, 0.022, 0.014, 0.004), skin, { parent: extra, bw: 0.03 });
  rig.attach(ex2, xf(ellipsoid(0.025, 0.05, 0.012), { y: -0.33 }), skin, { parent: ex2, axis: [0, -1, 0], len: 1 });
  return result(rig, {
    kind: 'biped', height: 2.15, radius: 0.32, eyeY: 2.0, drips: true,
    animate(st, dt) {
      st.lean = 0.18; st.hunch = 0.28; st.stride = 1.6; st.armSwing = 0.5; st.grip = 0.6;
      st.tilt = Math.sin(st.t * 0.45) * 0.4; st.sway = 0.07;
      animateBiped(rig, st, dt);
      ex2.rotation.x = Math.sin(st.t * 1.9) * 0.4 - 0.6;
      extra.rotation.z = 0.5 + Math.sin(st.t * 1.3) * 0.2;
    },
  });
}



__mod['src/entities/registry.js'].BUILDERS.duller = buildDuller;

ENTITY_DEFS.duller = { name: 'Duller', speed: 1.0, chase: 3.3, detect: 11, dmg: 32, reach: 1.7, cd: 1.3, memory: 9, duller: true, rare: true, darkSense: true,
  num: 'Entity 6', cls: 'Hostile', size: '2.15 m',
  desc: 'A long, dark, wrinkled humanoid torn open to purple muscle, leaking grey liquid. Hollows where a face should be.',
  notes: 'Navigates perfectly in total darkness and can reach through thin walls. Colour drains from the world around it. Some carry extra limbs.',
  tips: ['Keep lights on — darkness doubles how far it senses you.', 'Do not hide behind thin walls.', 'If colours fade, it is close.'] };
})();
