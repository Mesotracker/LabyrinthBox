// =============================================================================
//  The Beast of Level 5   (entity id: 'beast')
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
const THREE = __mod['vendor/three/build/three.module.js'];
const { buildBody, cloth, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, ellipsoid, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * The Beast of Level 5: tall, in a dark business suit, the head of a
 * cephalopod - a heavy mantle and a beard of tentacles. Seen mostly by those
 * already losing their minds.
 */
function buildBeast() {
  const p = { ...HUMAN, hipH: 1.15, thigh: 0.55, shin: 0.53, spine: 0.26, chestH: 0.42, neck: 0.12, shoulderW: 0.5, upperArm: 0.4, foreArm: 0.38, chestW: 0.44, armR: 1.1, legR: 1.05, headR: 0.15 };
  const rig = new Rig(p);
  const suitT = cloth('suit', { base: '#16171c', dark: '#08080a', stain: '#1e1a16', weave: 140, stains: 0.15, wear: 0.15 });
  const suit = skinMat('#9a9a9a', { map: suitT.map, bump: suitT.bump, bumpScale: 0.6, rough: 0.75 });
  const shirt = skinMat('#d8d4c8', { rough: 0.8 });
  const t = organic('beastskin', { base: '#6a5a6e', dark: '#2e2232', light: '#9a84a0', veins: 0.5, vein: '#3a1a40', pores: 0.7, poreF: 60, mottle: 0.8 });
  const skin = fleshMat(t, { rough: 0.25, bumpScale: 2.4 });
  buildBody(rig, p, { skin, top: suit, bottom: suit, arms: suit, shoes: skinMat('#050505', { rough: 0.3 }), hands: skin }, { sleeve: true, fingerLen: 0.11, chestDepth: 0.62 });
  // shirt front and tie
  rig.attach(rig.chest, xf(new THREE.PlaneGeometry(0.12, 0.32), { y: p.chestH * 0.6, z: p.chestW * 0.3 + 0.002 }), shirt, { rigid: true, shadow: false });
  rig.attach(rig.chest, xf(new THREE.BoxGeometry(0.04, 0.3, 0.01), { y: p.chestH * 0.55, z: p.chestW * 0.31 + 0.003 }), skinMat('#5a0e12', { rough: 0.5 }), { rigid: true, shadow: false });
  const hl = headLift(p);
  // mantle swept back and up, two great eyes, tentacles hanging over the collar
  rig.attach(rig.head, xf(ellipsoid(0.15, 0.3, 0.17, 22, 18), { y: hl + 0.18, z: -0.08, rx: -0.5 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
  rig.attach(rig.head, xf(ellipsoid(0.13, 0.1, 0.13), { y: hl - 0.02, z: 0.03 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
  const eyeM = skinMat('#c8a030', { rough: 0.1 });
  const pupil = skinMat('#050505', { rough: 0.1 });
  for (const s of [-1, 1]) {
    rig.attach(rig.head, xf(ellipsoid(0.035, 0.03, 0.02), { x: s * 0.1, y: hl + 0.03, z: 0.1 }), eyeM, { rigid: true, shadow: false });
    rig.attach(rig.head, xf(ellipsoid(0.03, 0.007, 0.01), { x: s * 0.1, y: hl + 0.03, z: 0.118 }), pupil, { rigid: true, shadow: false });
  }
  const tentacles = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 7 - 0.5) * 2.6;
    let parent = rig.head;
    const segs = [];
    for (let k = 0; k < 6; k++) {
      const g = new THREE.Group();
      if (k === 0) g.position.set(Math.sin(a) * 0.1, hl - 0.08, 0.04 + Math.cos(a) * 0.09); else g.position.y = -0.065;
      parent.add(g);
      const r = 0.022 - k * 0.003;
      const m = new THREE.Mesh(xf(new THREE.CylinderGeometry(r * 0.85, r, 0.07, 7), { y: -0.033 }), skin); m.castShadow = true; g.add(m);
      segs.push(g); parent = g;
    }
    tentacles.push({ segs, a });
  }
  return result(rig, {
    kind: 'biped', height: 2.35, radius: 0.4, eyeY: 2.15,
    animate(st, dt) {
      st.lean = 0.05; st.hunch = 0.08; st.stride = 1.7; st.armSwing = 0.5; st.grip = 0.3;
      animateBiped(rig, st, dt);
      for (const T of tentacles) T.segs.forEach((g, k) => {
        g.rotation.x = Math.sin(st.t * 1.6 + k * 0.7 + T.a * 3) * 0.25 + 0.1;
        g.rotation.z = Math.cos(st.t * 1.3 + k * 0.5 + T.a * 2) * 0.22;
      });
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.beast = buildBeast;

ENTITY_DEFS.beast = { name: 'The Beast of Level 5', speed: 0.9, chase: 3.1, detect: 13, dmg: 38, reach: 1.6, cd: 1.6, memory: 12, camo: true, rare: true,
  num: 'Level 5 resident (unconfirmed)', cls: 'Hostile', size: '2.35 m',
  desc: 'A tall humanoid in a dark business suit with the head of a cephalopod: a heavy mantle, golden eyes and a beard of tentacles.',
  notes: 'Reported only by wanderers already losing their grip on reality. It seems able to blend into its surroundings and is hard to see until it is close or caught in a light.',
  tips: ['Sweep rooms with your flashlight - it shows up in the beam.', 'If the jazz music stops, leave the room.'] };
})();
