// =============================================================================
//  The Chase   (entity id: 'chase')
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
const { buildBody, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, ellipsoid, glowMat, Rig, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

function buildChase() {
  const p = { 
    ...HUMAN, 
    hipH: 1.4, 
    thigh: 0.66, 
    shin: 0.64, 
    spine: 0.32, 
    chestH: 0.48, 
    neck: 0.1, 
    shoulderW: 0.78, 
    upperArm: 0.66, 
    foreArm: 0.64, 
    chestW: 0.68, 
    armR: 1.75, 
    legR: 1.4, 
    headR: 0.18 
  };
  
  const rig = new Rig(p);
  const t = organic('chase', { base: '#0b080a', dark: '#000000', light: '#241a1e', veins: 0.6, vein: '#3a0806', wrinkle: 0.3, pores: 0.2 });
  const black = fleshMat(t, { rough: 0.85, bumpScale: 2.2 });
  
  buildBody(rig, p, { skin: black, top: black, bottom: black, shoes: black }, { 
    handScale: 1.9, 
    fingerLen: 0.18, 
    claws: 0.10, 
    chestDepth: 0.75 
  });
  
  headOn(rig, p, black, 1.15, 1.0, 1.2);
  const hl = headLift(p);

  // Flipped V-shaped glowing eyes (inner corners lower, outer corners higher)
  const glowingEye = glowMat('#ff1100', { intensity: 3.5 });
  
  // Left Eye (outer edge tilted upward)
  rig.attach(rig.head, xf(ellipsoid(0.055, 0.016, 0.015), { 
    x: -0.075, 
    y: 0.045 + hl, 
    z: 0.18, 
    rz: -0.42 
  }), glowingEye, { rigid: true, shadow: false });

  // Right Eye (outer edge tilted upward to form a true V shape)
  rig.attach(rig.head, xf(ellipsoid(0.055, 0.016, 0.015), { 
    x: 0.075, 
    y: 0.045 + hl, 
    z: 0.18, 
    rz: 0.42 
  }), glowingEye, { rigid: true, shadow: false });

  // Deep shadow cavity for the mouth with completely hidden/recessed teeth
  const mouthCave = glowMat('#080000', { intensity: 0.2 });
  rig.attach(rig.head, xf(ellipsoid(0.1, 0.03, 0.02), { y: -0.05 + hl, z: 0.145 }), mouthCave, { rigid: false, shadow: false });

  // Spines down the back
  for (let i = 0; i < 6; i++) {
    rig.attach(rig.chest, xf(new THREE.ConeGeometry(0.035, 0.25, 7), { y: 0.05 + i * 0.09, z: -0.18, rx: -1.2 }), black, { parent: null });
  }

  return result(rig, {
    kind: 'biped', height: 3.1, radius: 0.52, eyeY: 2.8,
    animate(st, dt) { 
      st.lean = 0.3; 
      st.hunch = 0.15; 
      st.stride = 2.4; 
      st.armSwing = 1.4; 
      st.grip = 0.7; 
      animateBiped(rig, st, dt); 
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.chase = buildChase;

ENTITY_DEFS.chase = { name: 'The Chase', speed: 0, chase: 4.2, detect: 999, dmg: 45, reach: 1.8, cd: 1.0, memory: 999, relentless: true,
  num: 'Level ! resident', cls: 'Lethal', size: '3.1 m',
  desc: 'It is always behind you. Taller, wider, and relentlessly closing the gap.',
  notes: 'Black, ridged hide, massive wide-reaching arms, razor-sharp claws, a row of spines, and V-shaped glowing eyes above a dark, featureless shadow maw. It does not stop.',
  tips: ['Keep sprinting. Stamina is your life.', 'Never stop to search anything while it is close.'] };
})();