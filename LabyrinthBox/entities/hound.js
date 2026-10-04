// =============================================================================
//  Hound   (entity id: 'hound')
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
const { buildBody, face, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateQuad, ellipsoid, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * Hound: a gaunt grey humanoid on all fours, mangy skin scratched raw, a
 * dog-like skull hidden behind a curtain of long black hair, blank white eyes
 * and an enormous mouth of knife-like teeth.
 */
function buildHound() {
  // Adjusted skeletal parameters for smoother joint blending and tapered limb connections
  const p = { ...HUMAN, hipH: 0.78, thigh: 0.42, shin: 0.4, spine: 0.3, chestH: 0.3, neck: 0.16, shoulderW: 0.32, upperArm: 0.38, foreArm: 0.36, chestW: 0.28, armR: 0.65, legR: 0.68, headR: 0.10 };
  const rig = new Rig(p);
  const t = organic('houndskin2', { base: '#8c8a86', dark: '#4c4a46', light: '#a9a6a0', veins: 0.4, vein: '#5a3a40', wrinkle: 0.4, pores: 0.45, mottle: 0.7, tears: 0.75, tearF: 6, extra: '#a8524c' });
  const skin = fleshMat(t, { rough: 0.7, bumpScale: 2.0 });

  // Smoother body proportions with subtle segmentations
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { 
    fingerLen: 0.07, 
    claws: 0.045, 
    chestDepth: 0.55, 
    ribs: true, 
    clawMat: skinMat('#1c1a18', { rough: 0.3 }) 
  });

  const hl = headLift(p);

  // Refined multi-piece dog-like skull for smoother transitions
  rig.attach(rig.head, xf(ellipsoid(0.09, 0.085, 0.14, 24, 18), { y: hl, z: 0.04 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.015 });
  rig.attach(rig.head, xf(ellipsoid(0.06, 0.048, 0.11, 20, 16), { y: hl - 0.03, z: 0.14 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.01 });

  // Blank white eyes
  const eyeM = skinMat('#f4f2ec', { rough: 0.15 });
  for (const x of [-0.042, 0.042]) {
    rig.attach(rig.head, xf(ellipsoid(0.018, 0.014, 0.01), { x, y: hl + 0.022, z: 0.155 }), eyeM, { rigid: true, shadow: false });
  }

  // Articulated jaw with smooth multi-part structure
  const jaw = new THREE.Bone(); 
  jaw.position.set(0, hl - 0.055, -0.02); 
  rig.head.add(jaw); 
  rig.bones.push(jaw);

  rig.attach(jaw, xf(ellipsoid(0.068, 0.025, 0.15, 20, 14), { z: 0.12 }), skin, { parent: null });

  const gum = skinMat('#3a0d10', { rough: 0.35 });
  rig.attach(rig.head, xf(ellipsoid(0.062, 0.01, 0.14), { y: hl - 0.052, z: 0.11 }), gum, { rigid: true, shadow: false });

  // Detailed smaller teeth parts mapped smoothly across the jaw line
  const tooth = skinMat('#ece4cc', { rough: 0.25 });
  const teethU = [], teethL = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 19 - 0.5) * 2.8;
    const len = 0.025 + Math.abs(Math.sin(i * 1.5)) * 0.02;
    teethU.push(xf(new THREE.ConeGeometry(0.004, len, 5), { x: Math.sin(a) * 0.058, y: hl - 0.054 - len / 2, z: 0.06 + Math.cos(a) * 0.11, rx: Math.PI + 0.1 }));
    teethL.push(xf(new THREE.ConeGeometry(0.0035, len * 0.9, 5), { x: Math.sin(a) * 0.052, y: 0.01 + len * 0.4, z: 0.07 + Math.cos(a) * 0.1 }));
  }
  rig.attach(rig.head, merge(teethU), tooth, { rigid: true, shadow: false });
  rig.attach(jaw, merge(teethL), tooth, { rigid: true, shadow: false });

  // Detailed hair curtain made of many fine tapered strands
  const hairRoot = new THREE.Group(); 
  hairRoot.position.set(0, hl + 0.05, 0.0); 
  rig.head.add(hairRoot);

  const strands = [];
  for (let i = 0; i < 110; i++) {
    const a = (i / 110) * Math.PI * 2;
    const front = Math.cos(a) > -0.2;
    const len = (front ? 0.30 : 0.40) + Math.sin(i * 5.3) * 0.06;
    const g = new THREE.ConeGeometry(0.007, len, 3, 1);
    g.translate(0, -len / 2, 0);
    xf(g, { x: Math.sin(a) * 0.075, z: Math.cos(a) * 0.09 + 0.02, rx: Math.cos(a) * 0.35 + 0.08, rz: -Math.sin(a) * 0.3 });
    strands.push(g);
  }
  const hairMat = skinMat('#050505', { rough: 0.55 });
  const hair = new THREE.Mesh(merge(strands), hairMat); 
  hair.castShadow = true; 
  hairRoot.add(hair);

  // Smooth vertebra ridges along the spine
  for (let i = 0; i < 10; i++) {
    rig.attach(rig.spine, xf(ellipsoid(0.022, 0.018, 0.025), { y: i * 0.052 - 0.03, z: -0.09 }), skin, { parent: rig.hips, child: rig.chest, bw: 0.06 });
  }

  let hairLag = 0;
  return result(rig, {
    kind: 'quad', height: 1.0, radius: 0.35, eyeY: 0.85,
    animate(st, dt) {
      st.stride = 1.2;
      animateQuad(rig, st, dt);
      jaw.rotation.x = 0.1 + (st.chasing ? 0.45 + Math.sin(st.t * 9) * 0.2 : Math.max(0, Math.sin(st.t * 1.3)) * 0.1) + (st.attack || 0) * 0.7;
      hairLag += ((-rig.neck.rotation.x - rig.spine.rotation.x + 1.3) * 0.6 - hairLag) * Math.min(1, dt * 6);
      hairRoot.rotation.x = hairLag + Math.sin(st.t * 2.1) * 0.04;
      hairRoot.scale.set(1 + jaw.rotation.x * 0.25, 1, 1);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.hound = buildHound;

ENTITY_DEFS.hound = { name: 'Hound', speed: 1.3, chase: 4.3, detect: 6.5, dmg: 18, reach: 1.35, cd: 0.9, memory: 4,
  num: 'Entity 9', cls: 'Hostile', size: '1.0 m at the shoulder',
  desc: 'Pale, crouched, all teeth. Hunts on all fours with smooth, fluid musculature and a curtain of hair.',
  notes: 'A hairless, humanoid frame forced onto all fours with smooth joint transitions, sharp spine ridges, and a terrifying jaw full of small knife-like teeth.',
  tips: ['Crouch or crawl when one is near.', 'They give up quickly once they lose you.'] };
})();