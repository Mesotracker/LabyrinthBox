// =============================================================================
//  The Stature   (entity id: 'stature')
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
const { animateBiped, clamp, ellipsoid, glowMat, Rig, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * The Stature: a towering, featureless stalker well over three metres tall,
 * all limb. It folds itself almost double to fit under ceilings.
 */
function buildStature() {
  const p = { ...HUMAN, hipH: 1.85, thigh: 0.95, shin: 0.9, footH: 0.06, spine: 0.34, chestH: 0.44, neck: 0.32, shoulderW: 0.4, upperArm: 0.95, foreArm: 0.92, chestW: 0.3, armR: 0.55, legR: 0.52, headR: 0.085 };
  const rig = new Rig(p);
  const t = organic('stature', { base: '#3a3936', dark: '#151413', light: '#5e5a54', veins: 0.25, vein: '#22202a', pores: 0.25, wrinkle: 0.8, wrinkleF: 140, mottle: 0.6, repeat: [1, 3] });
  const skin = fleshMat(t, { rough: 0.85, bumpScale: 2.6 });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.26, fingerR: 0.8, claws: 0.03, footLen: 0.34, chestDepth: 0.55, neckR: 0.6, ribs: true, fingerVar: true });
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(p.headR, p.headR * 1.45, p.headR * 1.05, 20, 16), { y: hl + 0.03 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
  // a single vertical slit where a face should be
  rig.attach(rig.head, xf(ellipsoid(0.006, 0.07, 0.006), { y: hl + 0.02, z: p.headR * 1.0 }), glowMat('#000000'), { rigid: true, shadow: false });
  return result(rig, {
    kind: 'biped', height: 3.4, radius: 0.36, eyeY: 3.2,
    animate(st, dt) {
      const ceil = st.ceiling ?? 9;
      const fold = clamp((3.55 - ceil) / 1.0, 0, 1);
      st.lean = 0.05 + fold * 0.55; st.hunch = 0.05 + fold * 0.5; st.crouch = fold * 0.35;
      st.stride = 3.2; st.armSwing = 0.35; st.grip = 0.1; st.armsOut = 0.05;
      st.nod = fold * 0.4;
      animateBiped(rig, st, dt);
      // the head jerks to look at you, a beat late
      rig.head.rotation.z += Math.sin(st.t * 0.35) * 0.08;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.stature = buildStature;

ENTITY_DEFS.stature = { name: 'The Stature', speed: 0.9, chase: 3.5, detect: 28, dmg: 45, reach: 2.3, cd: 1.8, memory: 10, watcher: true, rare: true,
  num: 'Rare · watcher', cls: 'Lethal', size: '3.4 m standing',
  desc: 'A towering, featureless figure, all limb. It folds itself double to fit under the ceiling.',
  notes: 'Like the Watchers seen on the rooftops of Level 9: impossibly long arms and legs, a small smooth head with a single slit. It stands perfectly still while watched and closes the distance in huge strides when you look away. Stare at it too long up close and it lunges.',
  tips: ['Glance at it, do not stare.', 'Back away while keeping it in the corner of your eye.', 'Low ceilings slow it.'] };
})();
