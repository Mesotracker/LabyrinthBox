// =============================================================================
//  Clump   (entity id: 'clump')
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
const { fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { buildHand, ellipsoid, limbGeo, poseHand, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

function buildClump() {
  const rig = new Rig({ ...HUMAN, hipH: 0.0 });
  // Accurate Backrooms Entity 12 appearance: gross pulsating meat mass with pale/bloody tones
  const t = organic('flesh', { base: '#7a2d28', dark: '#38100e', light: '#ba5850', veins: 0.9, vein: '#240608', pores: 0.35, wrinkle: 0.3, mottle: 0.85 });
  const flesh = fleshMat(t, { rough: 0.4, bumpScale: 2.4 });
  
  const blob = new THREE.IcosahedronGeometry(0.65, 4);
  const pa = blob.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
    const k = 1 + 0.22 * Math.sin(x * 6 + y * 4) * Math.cos(z * 5) + 0.12 * Math.sin(y * 10 + z * 3) + 0.05 * Math.sin(x * 20 + z * 15);
    pa.setXYZ(i, x * k, y * k * 0.82, z * k);
  }
  blob.computeVertexNormals();
  const core = rig.joint(rig.body, 0, 0.75, 0);
  rig.attach(core, blob, flesh, { parent: null });

  // Increased number of limbs (16 grasping human-like arms sticking out in all directions)
  const limbs = [];
  const totalLimbs = 16;
  for (let i = 0; i < totalLimbs; i++) {
    const a = (i / totalLimbs) * Math.PI * 2, el = ((i % 4) / 3 - 0.5) * 1.4;
    const base = rig.joint(core, Math.cos(a) * 0.48 * Math.cos(el), Math.sin(el) * 0.45, Math.sin(a) * 0.48 * Math.cos(el));
    base.rotation.set(0, -a + Math.PI / 2, 0);
    const up = rig.joint(base, 0, 0, 0);
    const low = rig.joint(up, 0, -0.42, 0);
    const hand = rig.joint(low, 0, -0.38, 0);
    rig.attach(up, limbGeo(0.42, 0.06, 0.04, 0.015), flesh, { parent: core, child: low, bw: 0.06 });
    rig.attach(low, limbGeo(0.38, 0.04, 0.025, 0.01), flesh, { parent: up, child: hand, bw: 0.035 });
    const A = { wr: hand, el: low, side: i % 2 ? 1 : -1, fingers: [] };
    buildHand(rig, A, flesh, { handScale: 1.0, fingerLen: 0.075, claws: 0.015 });
    limbs.push({ up, low, phase: i * 1.1, a, A });
  }

  // Large distorted central maw/mouth with sharp teeth, NO eyes (accurate to fandom lore: Clump has no eyes, only a mouth and grasping hands/arms)
  const mouth = rig.attach(core, xf(ellipsoid(0.22, 0.12, 0.08), { y: -0.05, z: 0.58 }), skinMat('#140303', { rough: 0.25 }), { rigid: true });
  
  const toothMat = skinMat('#e6dfcc', { rough: 0.3 });
  for (let j = -4; j <= 4; j++) {
    const tx = j * 0.04;
    rig.attach(core, xf(new THREE.ConeGeometry(0.015, 0.05, 4), { x: tx, y: 0.025, z: 0.62, rx: 3.14 }), toothMat, { rigid: true, shadow: false });
    rig.attach(core, xf(new THREE.ConeGeometry(0.015, 0.05, 4), { x: tx, y: -0.12, z: 0.62, rx: 0 }), toothMat, { rigid: true, shadow: false });
  }

  return result(rig, {
    kind: 'clump', height: 1.5, radius: 0.65, eyeY: 0.8,
    animate(st, dt) {
      st.t += dt;
      st.phase += st.speed * dt * 2.8;
      core.rotation.x = Math.sin(st.phase * 0.5) * 0.15;
      core.rotation.z = Math.cos(st.phase * 0.4) * 0.12;
      core.position.y = 0.75 + Math.abs(Math.sin(st.phase)) * 0.1 + Math.sin(st.t * 1.8) * 0.025;
      const breath = 1 + Math.sin(st.t * 2.5) * 0.04;
      core.scale.set(breath, 1 / breath, breath);
      
      for (const L of limbs) {
        const p = st.phase + L.phase;
        L.up.rotation.x = -0.5 + Math.sin(p) * (0.7 + st.speed * 0.3) - (st.attack || 0) * 1.3;
        L.up.rotation.z = Math.cos(p * 0.8) * 0.5;
        L.low.rotation.x = 0.6 + Math.max(0, Math.cos(p)) * 0.8;
        poseHand(L.A, 0.3 + Math.max(0, Math.sin(p + 1)) * 0.7, 0.3, st.t + L.phase);
      }
      mouth.scale.y = 1 + Math.max(0, Math.sin(st.t * 3.5)) * 0.9 + (st.attack || 0) * 2.2;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.clump = buildClump;

ENTITY_DEFS.clump = { name: 'Clump', speed: 0.6, chase: 1.8, detect: 16, dmg: 40, reach: 1.9, cd: 1.6, memory: 9,
  num: 'Entity 12', cls: 'Hostile', size: '1.5 m wide',
  desc: 'A dense, eyeless mass of conjoined flesh covered in dozens of grasping human arms and a gaping, tooth-filled maw.',
  notes: 'Completely eyeless, relying entirely on sound and motion while rolling forward on an overwhelming swarm of thrashing arms.',
  tips: ['Stay quiet; it hunts primarily by sound since it has no eyes.', 'Avoid getting cornered where its massive reach can trap you.'] };
})();