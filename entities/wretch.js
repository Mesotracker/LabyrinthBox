// =============================================================================
//  Wretch   (entity id: 'wretch')
//
//  One self-contained entity file:
//    - the three.js model builder and its private textures/helpers
//    - its stats / field-guide entry
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const { buildBody, cloth, face, fleshMat, headLift, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, animateQuad, canvasTex, ellipsoid, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

// Raw, flayed flesh texture with exposed muscle tissue and hollow empty eye sockets matching the game design
const wretchFace = () => tex('wretchF', () => canvasTex(256, 256, (g, w, h) => {
  noiseFill(g, w, h, '#7c251f', ['#541411', '#9e352d']); // Raw, blood-red exposed flesh
  g.fillStyle = '#110403'; // Deep hollow eye sockets (skinless/eyeless voids)
  for (const x of [0.33, 0.67]) { 
    g.beginPath(); g.ellipse(w * x, h * 0.38, w * 0.12, h * 0.09, 0, 0, Math.PI * 2); g.fill(); 
  }
  // Sunken, torn jaw / mouth opening
  g.beginPath(); g.ellipse(w * 0.5, h * 0.72, w * 0.14, h * 0.12, 0, 0, Math.PI * 2); g.fill();
}));

function buildWretch() {
  // Proportions aligned with the gaunt, skinless human appearance from Escape the Backrooms
  const p = { ...HUMAN, hipH: 0.9, thigh: 0.44, shin: 0.42, chestW: 0.28, armR: 0.62, legR: 0.62, upperArm: 0.36, foreArm: 0.34, headR: 0.10 };
  const rig = new Rig(p);
  
  // Raw crimson flesh skin material showing muscle tissue and deterioration
  const t = organic('wretch', { base: '#7c251f', dark: '#541411', light: '#9e352d', veins: 0.7, vein: '#3a0c0a', wrinkle: 0.6, wrinkleF: 80, pores: 0.6, mottle: 0.85 });
  const skin = fleshMat(t, { rough: 0.55, bumpScale: 2.2 });
  
  // Tattered, dirty greyish rags/pants typical of a wanderer who lost their mind
  const ragT = cloth('wrag', { base: '#4a453f', dark: '#24211d', stain: '#361d15', weave: 45, stains: 0.9, wear: 0.8 });
  const rag = skinMat('#8a857d', { map: ragT.map, bump: ragT.bump, bumpScale: 1.6, rough: 0.95 });
  
  // Build body with exposed muscle/tissue texture and tattered lower pants
  buildBody(rig, p, { skin, top: skin, bottom: rag, shoes: skin }, { 
    fingerLen: 0.1, 
    claws: 0.025, 
    chestDepth: 0.45, 
    neckR: 0.75, 
    ribs: true 
  });
  
  headOn(rig, p, skin, 0.95, 1.2, 1.05);
  
  // Apply the flayed face with hollow sockets
  face(rig, p, null, skinMat('#7c251f', { map: wretchFace() }), { sx: 0.95 });
  
  // Matted, greasy dark hair clinging to the skull
  rig.attach(rig.head, xf(ellipsoid(0.1, 0.06, 0.1), { y: 0.07 + headLift(p), z: -0.02 }), skinMat('#1a1512', { rough: 0.9 }), { rigid: true });

  return result(rig, {
    kind: 'biped', height: 1.6, radius: 0.3, eyeY: 1.4,
    animate(st, dt) {
      st.lean = 0.45; st.hunch = 0.35; st.armsOut = 0.2; st.stride = 1.15; st.tilt = 0.25; st.grip = 0.65;
      if (st.crawl) { st.pitch = 1.05; st.hipK = 0.72; animateQuad(rig, st, dt); } else animateBiped(rig, st, dt);
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.wretch = buildWretch;

ENTITY_DEFS.wretch = { name: 'Wretch', speed: 1.0, chase: 3.4, detect: 10, dmg: 20, reach: 1.35, cd: 1.1, memory: 5,
  num: 'Entity 15', cls: 'Hostile', size: '1.6 m',
  desc: 'Wanderers who have completely lost their sanity and their skin, reduced to raw crimson flesh and tattered clothes. Drops to all fours when hunting.',
  notes: 'Completely skinless raw red tissue, hollow dark eye sockets, matted hair, and worn tattered pants. Shambles upright when wandering and drops down to sprint on all fours.',
  tips: ['Drink your almond water to prevent degradation.', 'Hide in lockers or vents, or break line of sight to escape.'] };
})();