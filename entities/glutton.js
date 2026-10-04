// =============================================================================
//   The Glutton   (entity id: 'glutton')
//
//   One self-contained entity file:
//     - the three.js model builder
//     - its stats / field-guide entry and AI hooks
//   Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//   Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateBiped, ellipsoid, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 42  THE GLUTTON (cibophobia)
function buildGlutton() {
  // Heavy humanoid frame with broad waist, fat thighs, and larger/wider arms
  const p = { 
    ...HUMAN, 
    hipH: 0.68, thigh: 0.44, shin: 0.38, 
    chestW: 0.62, shoulderW: 0.72, 
    upperArm: 0.42, foreArm: 0.38, armR: 1.8, legR: 2.1, 
    headR: 0.22, neck: 0.08 
  };

  const rig = new Rig(p);

  // Brighter, pale, heavily mottled and wrinkled flaccid skin
  const skinT = organic('fat_flaccid', { 
    base: '#e8c8b4', dark: '#885c4d', light: '#fce4d6', 
    veins: 0.35, vein: '#6a363a', pores: 0.5, mottle: 0.6, 
    wrinkle: 0.85, wrinkleF: 18 
  });
  const skin = fleshMat(skinT, { rough: 0.38, bumpScale: 1.8 });
  const darkSkin = fleshMat(skinT, { rough: 0.52, bumpScale: 2.5, tint: '#b08878' });

  // Mouth and hollow cavity materials
  const voidDark = skinMat('#030202', { rough: 0.98 });
  const mawInterior = skinMat('#3a1014', { rough: 0.4 });
  const lipMat = skinMat('#5e1c20', { rough: 0.3 });
  const toothMat = skinMat('#e4d8b4', { rough: 0.35 });

  // Base humanoid bone structure with enhanced waist, belly, and hand scale
  buildBody(rig, p, 
    { skin, top: skin, bottom: skin, shoes: skin, hands: skin }, 
    { fingerLen: 0.06, handScale: 1.35, belly: 2.4, chestDepth: 1.5, footLen: 0.28 }
  );

  // --- SAGGING SKIN FOLDS, FAT WAIST & HEAVY THIGH OVERHANGS ---
  const bodyFolds = new THREE.Group();
  rig.spine.add(bodyFolds);

  // Massive waist and primary sagging belly overhang
  const mainBelly = new THREE.Mesh(xf(ellipsoid(0.68, 0.52, 0.62), { y: -0.20, z: 0.20 }), skin);
  bodyFolds.add(mainBelly);

  // Broad secondary apron fold drooping low across wide hips
  const apronFold = new THREE.Mesh(xf(ellipsoid(0.64, 0.38, 0.58), { y: -0.42, z: 0.22 }), darkSkin);
  bodyFolds.add(apronFold);

  // Sagging waist side-handles extending over thighs
  for (const s of [-1, 1]) {
    const hipFlank = new THREE.Mesh(xf(ellipsoid(0.38, 0.32, 0.42), { x: s * 0.38, y: -0.28, z: 0.06 }), darkSkin);
    bodyFolds.add(hipFlank);
  }

  // Drooping chest / breast folds
  for (const s of [-1, 1]) {
    const breastFold = new THREE.Mesh(xf(ellipsoid(0.30, 0.30, 0.34), { x: s * 0.20, y: 0.10, z: 0.24 }), skin);
    bodyFolds.add(breastFold);
  }

  // Sagging back fat rolls
  const upperBackFold = new THREE.Mesh(xf(ellipsoid(0.56, 0.26, 0.32), { y: 0.14, z: -0.22 }), darkSkin);
  const lowerBackFold = new THREE.Mesh(xf(ellipsoid(0.60, 0.30, 0.34), { y: -0.12, z: -0.25 }), darkSkin);
  bodyFolds.add(upperBackFold, lowerBackFold);

  // Low-hanging neck wattles & double chin folds
  const neckWattle1 = new THREE.Mesh(xf(ellipsoid(0.34, 0.20, 0.32), { y: 0.38, z: 0.12 }), darkSkin);
  const neckWattle2 = new THREE.Mesh(xf(ellipsoid(0.28, 0.16, 0.26), { y: 0.48, z: 0.14 }), skin);
  bodyFolds.add(neckWattle1, neckWattle2);

  // --- HEAD, HOLLOW EYES & CONTAINED MOUTH WITH SMALLER LIPS ---
  headOn(rig, p, skin, 1.0, 1.05, 1.0);
  const hl = headLift(p);

  // Base skull shaping
  rig.attach(rig.head, xf(ellipsoid(0.22, 0.24, 0.22), { y: hl + 0.05, z: -0.01 }), skin, { rigid: true });

  // HOLLOW EYES: Sunken sockets surrounded by visible skin and brow ridges
  for (const s of [-1, 1]) {
    // Pitch-black recessed cavity
    rig.attach(rig.head, xf(ellipsoid(0.04, 0.038, 0.03), { x: s * 0.075, y: hl + 0.06, z: p.headR * 0.82 }), voidDark, { rigid: true, shadow: false });
    // Heavy brow ridge overhang
    rig.attach(rig.head, xf(ellipsoid(0.06, 0.025, 0.03), { x: s * 0.075, y: hl + 0.11, z: p.headR * 0.84, rz: -s * 0.12 }), darkSkin, { rigid: true });
    // Sagging lower eyelid bag
    rig.attach(rig.head, xf(ellipsoid(0.05, 0.02, 0.025), { x: s * 0.075, y: hl + 0.01, z: p.headR * 0.84 }), darkSkin, { rigid: true });
  }

  // GAPING MOUTH: Scaled cavity with thin, discrete lips
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, hl - 0.07, p.headR * 0.70);
  rig.head.add(mouthGroup);

  // Interior void (contained within mouth opening)
  const throatVoid = new THREE.Mesh(xf(ellipsoid(0.12, 0.06, 0.10), { z: 0.02 }), voidDark);
  const throatMaw = new THREE.Mesh(xf(ellipsoid(0.11, 0.05, 0.09), { z: 0.03 }), mawInterior);
  mouthGroup.add(throatVoid, throatMaw);

  // Smaller, thinner upper & lower lips
  const upperLip = new THREE.Group(); upperLip.position.set(0, 0.02, 0.11); mouthGroup.add(upperLip);
  const lowerLip = new THREE.Group(); lowerLip.position.set(0, -0.04, 0.11); mouthGroup.add(lowerLip);

  upperLip.add(new THREE.Mesh(xf(ellipsoid(0.10, 0.014, 0.025), {}), lipMat));
  lowerLip.add(new THREE.Mesh(xf(ellipsoid(0.10, 0.016, 0.028), {}), lipMat));

  // Irregular teeth along lip line
  const teethUpper = [], teethLower = [];
  for (let i = 0; i < 10; i++) {
    const x = -0.07 + i * 0.0155;
    const len = 0.018 + (i % 3 === 0 ? 0.006 : 0);
    teethUpper.push(xf(new THREE.BoxGeometry(0.011, len, 0.008), { x, y: -0.008, z: 0.008 }));
    teethLower.push(xf(new THREE.BoxGeometry(0.011, len, 0.008), { x, y: 0.008, z: 0.008 }));
  }
  upperLip.add(new THREE.Mesh(merge(teethUpper), toothMat));
  lowerLip.add(new THREE.Mesh(merge(teethLower), toothMat));

  return result(rig, {
    kind: 'biped', height: 1.85, radius: 0.68, eyeY: 1.65,
    animate(st, dt) {
      st.lean = -0.08; 
      st.hunch = 0.12; 
      st.stride = 0.85; 
      st.armSwing = 0.35; 
      st.armsOut = 0.85; // Extra wide arm stance to clear massive waist and thighs
      st.grip = 0.4; 
      st.sway = 0.22;

      animateBiped(rig, st, dt);

      // Jaw distension animation
      const t = st.t;
      const gape = (st.attack || 0) * 1.2 + (st.chasing ? 0.35 + Math.abs(Math.sin(t * 6.0)) * 0.25 : 0.08 + Math.max(0, Math.sin(t * 1.2)) * 0.15) + (st.eating ? Math.abs(Math.sin(t * 8.0)) * 0.4 : 0);

      upperLip.position.y = 0.02 + gape * 0.03;
      lowerLip.position.y = -0.04 - gape * 0.08;

      // Heavy body fold jiggle
      bodyFolds.scale.set(
        1.0 + Math.sin(t * 1.8) * 0.025,
        1.0 + Math.cos(t * 1.8) * 0.02,
        1.0 + Math.sin(t * 1.8 + 0.4) * 0.025
      );
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.glutton = buildGlutton;

// 42 --------------------------------------------------------------- THE GLUTTON
D.glutton = {
  name: 'The Glutton', speed: 0.9, chase: 3.4, detect: 9, dmg: 24, reach: 1.6, cd: 1.3, memory: 8, voice: 'chew',
  num: 'Φ-42 · Cibophobia', cls: 'Hostile', size: '1.85 m tall, 1.35 m wide',
  desc: 'A grossly obese humanoid with sagging folds of pale skin, hollow eye sockets, and an unnaturally gaping mouth.',
  notes: 'It can smell what you carry. Every bottle of almond water in your pack makes it notice you from further away. When it catches you it takes one, and stops to eat it.',
  tips: ['Drink almond water early instead of hoarding it.', 'If it catches you, that bottle buys you a few seconds — run.', 'Rotten food on the floor hides your scent.'],
  sketch: [['head', 'hollow eyes'], ['chest', 'sagging skin folds'], ['mouth', 'gaping maw']],
  noiseMul(m) { return 1 + (PL(m).water || 0) * 0.45; },
  onHit(m, e) { const pl = PL(m); if (pl.water > 0) { pl.water--; m.game.hud.toast('It took an almond water.', 1400); e.eatT = 4; e.st.eating = true; e.pauseT = 4; } },
  frame(m, e, dt) { if (e.eatT > 0) { e.eatT -= dt; if (e.eatT <= 0) e.st.eating = false; } return null; },
  think(m, e, d, sees) { if (e.eatT > 0) return; hunt(m, e, d, sees); },
};

})();