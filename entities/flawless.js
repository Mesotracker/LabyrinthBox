// =============================================================================
//  The Flawless   (entity id: 'flawless')
//
//  One self-contained entity file:
//    - the three.js model builder and its private textures/helpers
//    - its stats / field-guide entry and AI hooks
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const { animateBiped, canvasTex, clamp, ellipsoid, lerp, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, headLift, headOn, HUMAN, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 26  THE FLAWLESS (atelophobia)
const kintsugi = () => tex('kintsugi', () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#ffcf6a'; g.lineCap = 'round';
  for (let i = 0; i < 14; i++) {
    let x = Math.random() * w, y = Math.random() * h; g.lineWidth = 2 + Math.random() * 3;
    g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 10; k++) { x += (Math.random() - 0.5) * 70; y += Math.random() * 50; g.lineTo(x, y); }
    g.stroke();
  }
}));


function buildFlawless() {
  const p = { ...HUMAN, hipH: 1.02, chestW: 0.34, headR: 0.11, neck: 0.13 };
  const rig = new Rig(p);
  const marble = skinMat('#f2f0ea', { rough: 0.18, emissive: '#ffcf6a', emissiveIntensity: 0, emissiveMap: kintsugi() });
  buildBody(rig, p, { skin: marble, top: marble, bottom: marble, shoes: marble }, { fingerLen: 0.085 });
  headOn(rig, p, marble, 0.95, 1.2, 1.05);
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(0.03, 0.002, 0.004), { y: hl - 0.045, z: 0.115 }), skinMat('#8a8478', { rough: 0.3 }), { rigid: true, shadow: false });
  for (const s of [-1, 1]) rig.attach(rig.head, xf(ellipsoid(0.022, 0.006, 0.005), { x: s * 0.04, y: hl + 0.03, z: 0.11 }), skinMat('#c8c2b6', { rough: 0.2 }), { rigid: true, shadow: false });
  return result(rig, {
    kind: 'biped', height: 1.95, radius: 0.3, eyeY: 1.8, marble,
    animate(st, dt) {
      st.stride = 1.6; st.lean = 0; st.hunch = 0; st.armSwing = 0.25; st.grip = 0.05; st.tilt = 0; st.sway = 0;
      animateBiped(rig, st, dt);
      marble.emissiveIntensity = lerp(marble.emissiveIntensity, st.chasing ? 2.2 + Math.sin(st.t * 6) * 0.5 : 0.05, Math.min(1, dt * 3));
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.flawless = buildFlawless;

// 26 --------------------------------------------------------------- THE FLAWLESS
D.flawless = {
  name: 'The Flawless', speed: 0.8, chase: 3.9, detect: 999, dmg: 26, reach: 1.4, cd: 1.1, memory: 999, xray: true, voice: 'chime',
  num: 'Φ-26 · Atelophobia', cls: 'Hostile', size: '1.95 m',
  desc: 'A marble figure without a single flaw, a calm line for a mouth. When it hunts, golden cracks light up all over it.',
  notes: 'It cannot stand imperfection. While you are untouched it ignores you completely. The moment you are hurt — a scratch, a fall, a cut — it knows exactly where you are and comes to correct it.',
  tips: ['Stay at full health and it will walk right past you.', 'Drink almond water the moment you are hurt.', 'Broken glass on the floor counts. Do not run over it.'],
  sketch: [['head', 'serene'], ['chest', 'kintsugi cracks'], ['foot', 'marble']],
  frame(m, e, dt, d) { const pl = PL(m); e.hunting = pl.health < pl.stats.healthMax - 0.5; e.threat = e.hunting ? clamp(1 - d / 20, 0, 1) : 0; return null; },
  think(m, e) { if (e.hunting) chaseTo(m, e); else { if (e.state === 'chase') { e.state = 'wander'; e.path = null; } if (!e.goal || e.idle > 0) m.wander(e); } },
};

})();
