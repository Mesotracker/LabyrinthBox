// =============================================================================
//  Porcelain   (entity id: 'porcelain')
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
const THREE = __mod['vendor/three/build/three.module.js'];
const { eyeball } = __mod['src/phobia/models_a.js'];
const { animateBiped, canvasTex, clamp, ellipsoid, latheGeo, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, face, fleshMat, headLift, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, inBeam, ph, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 7  PORCELAIN (pediophobia)
const dollFace = () => tex('dollface', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#f1e6dc', ['#e2d2c4', '#fbf4ec']);
  // rosy painted cheeks
  for (const x of [0.28, 0.72]) { const r = g.createRadialGradient(w * x, h * 0.6, 2, w * x, h * 0.6, w * 0.12); r.addColorStop(0, 'rgba(230,110,120,0.55)'); r.addColorStop(1, 'rgba(230,110,120,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }
  // painted brows and lashes
  g.strokeStyle = '#3a2418'; g.lineWidth = 4; g.lineCap = 'round';
  for (const [x, s] of [[0.34, -1], [0.66, 1]]) {
    g.beginPath(); g.moveTo(w * (x - 0.08), h * 0.33); g.quadraticCurveTo(w * x, h * 0.29, w * (x + 0.08), h * 0.33); g.stroke();
    for (let i = 0; i < 6; i++) { const a = -0.8 + i * 0.32; g.beginPath(); g.moveTo(w * (x + Math.cos(a + Math.PI) * 0.07 * s * -1), h * 0.44); g.lineTo(w * (x + Math.cos(a + Math.PI) * 0.09 * s * -1), h * 0.405); g.stroke(); }
  }
  // tiny rosebud mouth
  g.fillStyle = '#b8323e'; g.beginPath(); g.ellipse(w * 0.5, h * 0.74, w * 0.05, h * 0.025, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#7a1a22'; g.fillRect(w * 0.46, h * 0.738, w * 0.08, 2);
  // a crack across the face, chips missing around it
  g.strokeStyle = '#2a1c14'; g.lineWidth = 2.5;
  let x = w * 0.18, y = h * 0.12; g.beginPath(); g.moveTo(x, y);
  for (let i = 0; i < 12; i++) { x += w * 0.04 + Math.random() * w * 0.02; y += h * 0.05 + (Math.random() - 0.3) * h * 0.04; g.lineTo(x, y); }
  g.stroke();
  g.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) { const sx = w * (0.25 + i * 0.07), sy = h * (0.18 + i * 0.1); g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + (Math.random() - 0.5) * 60, sy + 30 + Math.random() * 20); g.stroke(); }
  g.fillStyle = 'rgba(70,50,40,0.85)'; g.beginPath(); g.moveTo(w * 0.52, h * 0.5); g.lineTo(w * 0.6, h * 0.47); g.lineTo(w * 0.58, h * 0.56); g.closePath(); g.fill();
}));


function buildPorcelain(rng) {
  const p = { ...HUMAN, hipH: 0.5, thigh: 0.23, shin: 0.22, spine: 0.12, chestH: 0.2, neck: 0.05, shoulderW: 0.24, upperArm: 0.17, foreArm: 0.16, chestW: 0.24, armR: 0.75, legR: 0.8, headR: 0.13 };
  const rig = new Rig(p);
  const t = organic('porcelain', { base: '#f2e8de', dark: '#d2c4b6', light: '#ffffff', veins: 0, pores: 0.02, mottle: 0.15, wrinkle: 0 });
  const china = fleshMat(t, { rough: 0.12, bumpScale: 0.2 });
  const col = rng ? rng.pick(['#5a1a2a', '#1a2a5a', '#2a4a2a', '#6a5a7a']) : '#5a1a2a';
  const dT = cloth('dolldress' + col, { base: col, dark: '#101010', stain: '#3a2a1a', weave: 140, stains: 0.45, wear: 0.4 });
  const dress = skinMat('#b8b8b8', { map: dT.map, bump: dT.bump, bumpScale: 1.1, rough: 0.85, side: THREE.DoubleSide });
  const lace = skinMat('#e8e2d0', { rough: 0.9, side: THREE.DoubleSide });
  buildBody(rig, p, { skin: china, top: dress, bottom: china, shoes: skinMat('#151010', { rough: 0.2 }) }, { sleeve: true, fingerLen: 0.03, handScale: 0.8, footLen: 0.13 });
  headOn(rig, p, china, 1.0, 1.05, 1.0);
  face(rig, p, null, skinMat('#ffffff', { map: dollFace(), rough: 0.15 }), { sy: 1.05, sz: 1.0 });
  const hl = headLift(p);
  for (const s of [-1, 1]) {
    const e = eyeball(0.024, '#2a5aa0'); e.position.set(s * 0.045, hl + 0.022, p.headR * 0.93); rig.head.add(e);
  }
  // ringlets: rows of hanging spirals
  const hairM = skinMat(rng ? rng.pick(['#3a2210', '#c8a050', '#1a120a']) : '#3a2210', { rough: 0.5 });
  rig.attach(rig.head, xf(ellipsoid(p.headR * 1.06, p.headR * 0.62, p.headR * 1.1), { y: hl + 0.05, z: -0.015 }), hairM, { rigid: true });
  const curls = [];
  for (let i = 0; i < 14; i++) {
    const a = Math.PI * 0.35 + (i / 13) * Math.PI * 1.3;
    const geo = new THREE.TorusGeometry(0.018, 0.009, 5, 10);
    for (let k = 0; k < 5; k++) curls.push(xf(geo.clone(), { x: Math.cos(a + Math.PI / 2) * p.headR, y: hl - 0.02 - k * 0.032, z: Math.sin(a + Math.PI / 2) * p.headR * 1.0, ry: a }));
  }
  rig.attach(rig.head, merge(curls), hairM, { rigid: true });
  // bonnet bow
  rig.attach(rig.head, xf(ellipsoid(0.06, 0.03, 0.02), { y: hl + 0.12, z: -0.04, rz: 0.3 }), dress, { rigid: true });
  // bell skirt and lace hem
  const sk = latheGeo([[-p.hipH + 0.05, 0.3], [-p.hipH * 0.6, 0.27], [-0.1, 0.17], [0.05, 0.13]], 0.9, 22);
  rig.attach(rig.hips, sk, dress, { rigid: true });
  rig.attach(rig.hips, xf(new THREE.CylinderGeometry(0.31, 0.31, 0.04, 22, 1, true), { y: -p.hipH + 0.05, sz: 0.9 }), lace, { rigid: true });
  rig.attach(rig.chest, xf(new THREE.TorusGeometry(0.06, 0.02, 6, 14), { y: p.chestH + 0.01, rx: Math.PI / 2 }), lace, { rigid: true });
  return result(rig, {
    kind: 'biped', height: 1.05, radius: 0.24, eyeY: 0.95, frozenPose: true,
    animate(st, dt) {
      st.stride = 0.7; st.armSwing = 0.3; st.lean = 0.02; st.grip = 0.1; st.rate = 60;
      st.tilt = 0.25 + Math.sin(st.t * 0.3) * 0.05;
      animateBiped(rig, st, dt);
      // the head keeps turning to follow you, further than a neck should allow
      rig.head.rotation.y = clamp(st.lookFull ?? st.look ?? 0, -2.6, 2.6);
    },
  });
}


function lookAngle(e, P) { let a = Math.atan2(P.x - e.pos.x, P.z - e.pos.z) - e.yaw; return Math.atan2(Math.sin(a), Math.cos(a)); }


__mod['src/entities/registry.js'].BUILDERS.porcelain = buildPorcelain;

// 7 ---------------------------------------------------------------- PORCELAIN
D.porcelain = {
  name: 'Porcelain', speed: 0, chase: 5.2, detect: 40, dmg: 20, reach: 1.1, cd: 1.0, memory: 40, statue: true, xray: true, voice: 'musicbox',
  num: 'Φ-07 · Pediophobia', cls: 'Hostile', size: '1.05 m',
  desc: 'Antique dolls in lace dresses: painted cheeks, real hair, glass eyes. Their heads follow you around the room.',
  notes: 'They cannot move while anyone is looking at them — but you have to blink sometimes, and every time you blink they get closer. Their heads turn to follow you even when the rest of them is frozen.',
  tips: ['Keep them in view and walk backwards.', 'Your blinks are on a rhythm. Learn it, and look away only right after one.', 'A room full of dolls is a room you leave.'],
  sketch: [['head', 'turns to follow you'], ['chest', 'lace collar'], ['foot', 'moves when you blink']],
  observe(m, e, looked, d) { const p = ph(m); return looked > 0 && !(p && p.blinking) && (e.lum > 0.015 || d < 4 || inBeam(m, e, looked, d, 0.8)); },
  frozenFrame(m, e) { const a = lookAngle(e, PL(m).pos); if (e.model.rig) e.model.rig.head.rotation.y = clamp(a, -2.6, 2.6); },
  think(m, e) { if (!e.observed) chaseTo(m, e); },
  frame(m, e, dt, d) { e.st.lookFull = lookAngle(e, PL(m).pos); e.threat = d < 8 ? 0.5 : 0; return null; },
};

})();
