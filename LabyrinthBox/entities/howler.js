// =============================================================================
//  Howler   (entity id: 'howler')
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
const { buildBody, face, fleshMat, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, canvasTex, Rig, skinMat } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

const howlerFace = () => tex('howler', () => canvasTex(256, 512, (g, w, h) => {
  noiseFill(g, w, h, '#5d5751', ['#3c3833', '#77706a']);
  const grd = g.createRadialGradient(w * 0.5, h * 0.62, 4, w * 0.5, h * 0.62, w * 0.3);
  grd.addColorStop(0, '#000'); grd.addColorStop(0.75, '#070404'); grd.addColorStop(1, 'rgba(20,10,10,0)');
  g.fillStyle = grd; g.beginPath(); g.ellipse(w * 0.5, h * 0.62, w * 0.24, h * 0.22, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(30,25,22,0.7)'; g.lineWidth = 2;
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(w * 0.5 + Math.cos(a) * w * 0.25, h * 0.62 + Math.sin(a) * h * 0.23); g.lineTo(w * 0.5 + Math.cos(a) * w * 0.33, h * 0.62 + Math.sin(a) * h * 0.3); g.stroke(); }
  g.fillStyle = 'rgba(0,0,0,0.75)';
  for (const x of [0.3, 0.7]) { g.beginPath(); g.ellipse(w * x, h * 0.3, w * 0.07, h * 0.035, 0, 0, Math.PI * 2); g.fill(); }
}));


function buildHowler() {
  // Refined skeletal proportions: narrow waist, elongated non-spherical skull,
  // and multi-piece articulation for a realistic, emaciated giant frame.
  const p = { 
    ...HUMAN, 
    hipH: 1.22, 
    thigh: 0.6, 
    shin: 0.56, 
    spine: 0.28, 
    chestH: 0.38, 
    neck: 0.18, 
    shoulderW: 0.34, 
    upperArm: 0.48, 
    foreArm: 0.46, 
    chestW: 0.19, // Slimmer torso width to prevent a bulky midsection
    armR: 0.42, 
    legR: 0.40, 
    headR: 0.10  // Smaller base radius for an elongated skull profile
  };
  
  const rig = new Rig(p);
  const t = organic('howlskin', { base: '#5f5852', dark: '#38332e', light: '#7d756d', veins: 0.45, vein: '#3a2a30', wrinkle: 0.45, wrinkleF: 80, pores: 0.3 });
  const skin = fleshMat(t, { rough: 0.78, bumpScale: 1.6 });

  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { 
    fingerLen: 0.16, 
    claws: 0.04, 
    footLen: 0.32, 
    neckR: 0.65,      // Tapered neck radius
    chestDepth: 0.42, // Narrow, deep skeletal ribcage profile
    ribs: true 
  });

  // Position and stretch the head into a natural, elongated skull rather than a sphere
  headOn(rig, p, skin, 0.75, 1.70, 0.85);
  face(rig, p, null, skinMat('#ffffff', { map: howlerFace() }), { sy: 1.70, sz: 0.85, sx: 0.75, w: 1.5, h: 2.1 });

  return result(rig, {
    kind: 'biped', height: 2.45, radius: 0.30, eyeY: 2.2,
    animate(st, dt) { 
      st.lean = 0.25; 
      st.hunch = 0.25; 
      st.stride = 1.9; 
      st.armSwing = 1.3; 
      st.grip = 0.5; 
      animateBiped(rig, st, dt); 
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.howler = buildHowler;

ENTITY_DEFS.howler = { name: 'Howler', speed: 1.3, chase: 4.8, detect: 8, dmg: 30, reach: 1.5, cd: 1.2, memory: 3.5, howl: true,
  num: 'Entity 4', cls: 'Hostile', size: '2.45 m',
  desc: 'A rare, skeletal giant of the mazes. Fast and screaming, but it cannot see far.',
  notes: 'Grey, emaciated, ribs pressing through the skin, a mouth stretched into a permanent scream. It pauses to howl when it first spots prey.',
  tips: ['Its senses are short-ranged: a corner is enough.', 'Use the pause after its howl to get out of sight.'] };
})();