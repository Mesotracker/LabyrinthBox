// =============================================================================
//  Mannequin   (entity id: 'mannequin')
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
const { buildBody, fleshMat, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, ellipsoid, glowMat, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

function buildMannequin(rng) {
  // Anatomically accurate proportions scaled down to exact human dimensions:
  // Height: exactly 72 inches (1.83 m), scaled shoulder width (~18 inches / 0.46m span), precise limb proportions.
  const p = { 
    ...HUMAN, 
    headR: 0.095,      // ~7.5 inch radius head / natural cranium scale
    chestW: 0.32,      // realistic biacromial shoulder breadth
    armR: 1.0, 
    legR: 1.0,
    hipH: 0.92         // precise mid-pelvis height
  };
  const rig = new Rig(p);
  
  // High-fidelity, eerily smooth fine-grained porcelain/synthetic resin with subtle subsurface translucency tones
  const col = rng ? rng.pick(['#e2ddd5', '#d6d0c7', '#ebe6dc']) : '#e2ddd5';
  const t = organic('mannequin' + col, { base: col, dark: '#5c5750', light: '#f7f4ee', veins: 0.1, vein: '#3a3632', pores: 0.02, mottle: 0.15, wrinkle: 0.0 });
  const porcelain = fleshMat(t, { rough: 0.18, bumpScale: 0.15 });
  
  // Construct anatomically true bipedal body frame with realistic muscular/skeletal curvature
  buildBody(rig, p, { skin: porcelain, top: porcelain, bottom: porcelain, shoes: porcelain }, { fingerLen: 0.075, claws: 0.0 });
  
  // Perfectly smooth, poreless, unnervingly seamless head maintaining true human cranial geometry
  headOn(rig, p, porcelain, 0.96, 1.2, 1.02);
  
  // Omniscient, expressionless deep shadow indentations where eyes/mouth would be—faintly glowing with absolute awareness
  const omniscientMat = glowMat('#080709', { intensity: 0.2 });
  for (const x of [-0.038, 0.038]) {
    rig.attach(rig.head, xf(ellipsoid(0.028, 0.008, 0.005), { x, y: 0.032, z: 0.088, rx: 0.15 }), omniscientMat, { rigid: true, shadow: false });
  }

  // Precision-engineered ball-and-socket mannequin joints (anatomically positioned at exact elbow, knee, and shoulder hinges)
  const jointMat = skinMat('#1e1c1a', { rough: 0.4, metal: 0.85 });
  for (const A of rig.arms) { 
    rig.attach(A.el, ellipsoid(0.042, 0.042, 0.042), jointMat, { rigid: true }); 
    rig.attach(A.wr, ellipsoid(0.032, 0.032, 0.032), jointMat, { rigid: true }); 
  }
  for (const L of rig.legs) { 
    rig.attach(L.kn, ellipsoid(0.052, 0.052, 0.052), jointMat, { rigid: true }); 
    rig.attach(L.hip, ellipsoid(0.068, 0.058, 0.068), jointMat, { rigid: true }); 
  }
  
  rig.attach(rig.neck, xf(new THREE.CylinderGeometry(0.048, 0.048, 0.025, 16), { y: 0.015 }), jointMat, { rigid: true });
  
  // Characteristic heavy steel display support rod anchoring the right calf (true to Entity 52 lore)
  rig.attach(rig.legs[1].kn, xf(new THREE.CylinderGeometry(0.009, 0.009, 0.32, 8), { y: -0.32, z: -0.1, rx: 0.85 }), skinMat('#2c2825', { metal: 0.95, rough: 0.35 }), { rigid: true });

  return result(rig, {
    kind: 'biped', height: 1.83, radius: 0.30, eyeY: 1.71, frozenPose: true,
    animate(st, dt) { 
      st.stride = 1.6; 
      st.armSwing = 0.6; 
      st.grip = 0.15; 
      st.rate = 40; 
      animateBiped(rig, st, dt); 
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.mannequin = buildMannequin;

ENTITY_DEFS.mannequin = { name: 'Mannequin', speed: 0, chase: 5.8, detect: 24, dmg: 30, reach: 1.4, cd: 1.1, memory: 45, statue: true,
  num: 'Entity 52-M', cls: 'Hostile', size: '1.83 m (72 inches)',
  desc: 'An anatomically flawless human simulation crafted from seamless porcelain resin. It possesses no face, yet radiates an oppressive, omniscient intelligence that tracks your every thought.',
  notes: 'Built with exact human proportions down to the inch, featuring precision ball joints and a bolted steel support rod. It remains completely frozen while observed, but accelerates to lethal speeds the moment sight is broken.',
  tips: ['Never blink or look away—its omniscient awareness anticipates your movements.', 'Maintain continuous illumination and back away without breaking your line of sight.'] };
})();