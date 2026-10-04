// =============================================================================
//  Skin Stealer   (entity id: 'skinstealer')
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
const { buildBody, cloth, face, fleshMat, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, canvasTex, Rig, skinMat } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

const stealerFace = () => tex('stealer2', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#c4a090', ['#8a5f55', '#e0bcaa', '#6d463f']);
  // the stolen face sags: dark hollows where it does not fit the skull beneath
  for (const [x, y, rx, ry] of [[0.34, 0.37, 0.1, 0.085], [0.66, 0.37, 0.1, 0.085]]) {
    const gr = g.createRadialGradient(w * x, h * y, 2, w * x, h * y, w * rx * 1.4);
    gr.addColorStop(0, 'rgba(10,4,3,1)'); gr.addColorStop(0.55, 'rgba(30,12,10,0.95)'); gr.addColorStop(1, 'rgba(60,30,25,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(w * x, h * y, w * rx * 1.4, h * ry * 1.5, 0, 0, Math.PI * 2); g.fill();
    // sunken white eyes, far back in the holes
    g.fillStyle = '#efeadb'; g.beginPath(); g.ellipse(w * x, h * (y + 0.01), w * 0.028, h * 0.022, 0, 0, Math.PI * 2); g.fill();
  }
  // the mouth is just a big dark hole
  const gm = g.createRadialGradient(w * 0.5, h * 0.7, 4, w * 0.5, h * 0.7, w * 0.17);
  gm.addColorStop(0, '#000'); gm.addColorStop(0.7, '#0b0303'); gm.addColorStop(1, 'rgba(40,12,10,0)');
  g.fillStyle = gm; g.beginPath(); g.ellipse(w * 0.5, h * 0.7, w * 0.15, h * 0.13, 0, 0, Math.PI * 2); g.fill();
  // seams where the skin is stretched and stitched over
  g.strokeStyle = '#3b1714'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(w * 0.1, h * 0.14); g.bezierCurveTo(w * 0.35, h * 0.2, w * 0.65, h * 0.1, w * 0.9, h * 0.16); g.stroke();
  for (let i = 0; i < 10; i++) { const x = w * (0.12 + i * 0.085); g.beginPath(); g.moveTo(x, h * 0.11); g.lineTo(x + 8, h * 0.2); g.stroke(); }
  for (let i = 0; i < 7; i++) { const y = h * (0.25 + i * 0.09); g.beginPath(); g.moveTo(w * 0.05, y); g.lineTo(w * 0.1, y + 8); g.stroke(); g.beginPath(); g.moveTo(w * 0.95, y); g.lineTo(w * 0.9, y + 8); g.stroke(); }
  g.strokeStyle = 'rgba(90,40,35,0.5)'; g.lineWidth = 2;
  for (let i = 0; i < 12; i++) { const x = w * (0.2 + Math.random() * 0.6), y = h * (0.45 + Math.random() * 0.4); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (Math.random() - 0.5) * 30, y + 20 + Math.random() * 30); g.stroke(); }
}));


function buildSkinstealer() {
  // Refined proportions to eliminate the bulky, wide-shouldered look
  // and establish a lean, menacing, multi-piece humanoid anatomy.
  const p = { 
    ...HUMAN, 
    hipH: 1.02, 
    thigh: 0.52, 
    shin: 0.48, 
    chestH: 0.38, 
    shoulderW: 0.36,   // Narrowed from 0.58 for a realistic human silhouette
    upperArm: 0.44, 
    foreArm: 0.42, 
    chestW: 0.22,      // Slim torso width instead of 0.6
    armR: 0.50, 
    legR: 0.48, 
    headR: 0.11        // Smaller head radius to prevent a spherical bulbous look
  };
  
  const rig = new Rig(p);
  const t = organic('stealbody', { base: '#b08a7c', dark: '#6d463f', light: '#d8b5a5', veins: 0.35, patches: 4, pores: 0.4, mottle: 0.7 });
  const body = fleshMat(t, { rough: 0.62, bumpScale: 1.8 });
  const ragT = cloth('rags', { base: '#3b3530', dark: '#1e1b18', stain: '#4a1a12', weave: 50, stains: 0.7, wear: 0.5 });
  const rags = skinMat('#a8a8a8', { map: ragT.map, bump: ragT.bump, bumpScale: 1.6, rough: 0.95 });

  buildBody(rig, p, { skin: body, top: body, bottom: rags, shoes: body }, { 
    handScale: 1.1, 
    fingerLen: 0.12, 
    claws: 0.02, 
    belly: 0.95,      // Removed the exaggerated belly protrusion
    chestDepth: 0.45  // Realistic shallow torso profile
  });

  // Elongated skull structure configuration
  headOn(rig, p, body, 0.80, 1.25, 0.90);
  face(rig, p, null, skinMat('#ffffff', { map: stealerFace(), rough: 0.62 }), { sx: 0.80, sy: 1.25, sz: 0.90, w: 1.6, h: 1.9 });

  return result(rig, {
    kind: 'biped', height: 2.0, radius: 0.32, eyeY: 1.8,
    animate(st, dt) { 
      st.lean = 0.12; 
      st.hunch = 0.2; 
      st.armsOut = 0.25; 
      st.stride = 1.25; 
      st.tilt = Math.sin(st.t * 0.7) * 0.18; 
      st.grip = 0.55; 
      animateBiped(rig, st, dt); 
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.skinstealer = buildSkinstealer;

ENTITY_DEFS.skinstealer = { name: 'Skin Stealer', speed: 1.1, chase: 2.9, detect: 12, dmg: 30, reach: 1.55, cd: 1.4, memory: 6,
  num: 'Entity 8', cls: 'Hostile', size: '2.0 m, lean and deceptive',
  desc: 'A tall, pale entity wearing a poorly fitted human disguise. Walks toward you at a steady, patient pace.',
  notes: 'Its hide is a patchwork of stolen skin held together with crude stitches. Slow and deliberate, and it never seems to give up the search.',
  tips: ['It is slower than you — never let it corner you.', 'Crouching cuts how far away it notices you.'] };
})();