// =============================================================================
//  Giggles   (entity id: 'jester')
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
const { animateBiped, canvasTex, clamp, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, fleshMat, headLift, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, faceYaw, PL, place, spotAround } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 9  GIGGLES (coulrophobia)
const clownFace = () => tex('clownface', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#f4f0ea', ['#d8d0c4', '#ffffff']);
  // greasepaint cracks
  g.strokeStyle = 'rgba(120,110,100,0.6)'; g.lineWidth = 1.2;
  for (let i = 0; i < 60; i++) { let x = Math.random() * w, y = Math.random() * h; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (Math.random() - 0.5) * 30; y += (Math.random() - 0.5) * 30; g.lineTo(x, y); } g.stroke(); }
  // blue diamond eyes with black centres
  for (const x of [0.33, 0.67]) {
    g.fillStyle = '#2a5ab8'; g.beginPath(); g.moveTo(w * x, h * 0.24); g.lineTo(w * (x + 0.08), h * 0.4); g.lineTo(w * x, h * 0.55); g.lineTo(w * (x - 0.08), h * 0.4); g.closePath(); g.fill();
    g.fillStyle = '#050505'; g.beginPath(); g.ellipse(w * x, h * 0.4, w * 0.035, h * 0.045, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(w * x + 4, h * 0.39, 4, 0, Math.PI * 2); g.fill();
  }
  // a grin painted far past the real mouth, real teeth showing in the middle
  g.fillStyle = '#c4101a';
  g.beginPath(); g.moveTo(w * 0.08, h * 0.6); g.quadraticCurveTo(w * 0.5, h * 1.02, w * 0.92, h * 0.6); g.quadraticCurveTo(w * 0.5, h * 0.82, w * 0.08, h * 0.6); g.fill();
  g.fillStyle = '#1a0405'; g.beginPath(); g.ellipse(w * 0.5, h * 0.78, w * 0.15, h * 0.06, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#e8dcc0';
  for (let i = 0; i < 9; i++) { g.fillRect(w * (0.38 + i * 0.027), h * 0.735, w * 0.02, h * 0.035); }
  for (let i = 0; i < 8; i++) { g.fillRect(w * (0.39 + i * 0.027), h * 0.79, w * 0.02, h * 0.03); }
  // smeared paint drips
  g.fillStyle = 'rgba(190,20,30,0.7)';
  for (const x of [0.2, 0.31, 0.7, 0.81]) g.fillRect(w * x, h * 0.72, 5, 30 + Math.random() * 50);
}));

const polkaTex = () => tex('polka', () => canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#d8c8a0'; g.fillRect(0, 0, w, h);
  const cols = ['#c42a2a', '#2a6ac4', '#e0b020', '#2aa060'];
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { g.fillStyle = cols[(x + y * 2) % 4]; g.beginPath(); g.arc((x + (y % 2) * 0.5) * w / 6 + 20, y * h / 6 + 20, 13, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 0.35; g.fillStyle = '#3a2a1a';
  for (let i = 0; i < 30; i++) { g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 8 + Math.random() * 20, 6 + Math.random() * 14, Math.random() * 3, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 1;
}, { repeat: true }));


function buildJester() {
  const p = { ...HUMAN, hipH: 1.1, thigh: 0.52, shin: 0.5, chestW: 0.42, shoulderW: 0.44, upperArm: 0.38, foreArm: 0.36, armR: 1.15, legR: 1.2, headR: 0.13, neck: 0.12 };
  const rig = new Rig(p);
  const suit = skinMat('#ffffff', { map: polkaTex(), rough: 0.8 });
  suit.map.repeat.set(2, 2);
  const glove = skinMat('#f0ece2', { rough: 0.7 });
  const st0 = organic('clownskin', { base: '#f0e8e0', dark: '#c8b8a8', light: '#ffffff', veins: 0.1, pores: 0.3, mottle: 0.2 });
  const skin = fleshMat(st0, { rough: 0.5 });
  buildBody(rig, p, { skin, top: suit, bottom: suit, shoes: skinMat('#b8181e', { rough: 0.3 }), hands: glove, arms: suit }, { sleeve: true, fingerLen: 0.1, handScale: 1.35, footLen: 0.44, belly: 1.15 });
  headOn(rig, p, skin, 1.0, 1.15, 1.05);
  face(rig, p, null, skinMat('#ffffff', { map: clownFace(), rough: 0.55 }));
  const hl = headLift(p);
  rig.attach(rig.head, xf(new THREE.SphereGeometry(0.038, 14, 10), { y: hl - 0.005, z: p.headR * 1.08 }), skinMat('#e0101a', { rough: 0.15 }), { rigid: true });
  // frizzy hair puffs at the sides, bald on top
  const puffs = [];
  for (let i = 0; i < 36; i++) { const s = i % 2 ? 1 : -1; const a = (i / 36) * 3; puffs.push(xf(new THREE.IcosahedronGeometry(0.05 + (i % 3) * 0.012, 1), { x: s * (0.12 + Math.sin(a) * 0.05), y: hl + 0.02 + Math.cos(a * 2) * 0.07, z: -0.04 + Math.sin(a * 3) * 0.06 })); }
  rig.attach(rig.head, merge(puffs), skinMat('#e06a10', { rough: 1 }), { rigid: true });
  // ruff collar
  const ruff = [];
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; ruff.push(xf(new THREE.ConeGeometry(0.06, 0.12, 4, 1, true), { x: Math.cos(a) * 0.12, z: Math.sin(a) * 0.1, y: 0.02, rz: -Math.cos(a) * 1.3, rx: Math.sin(a) * 1.3 })); }
  rig.attach(rig.neck, merge(ruff), skinMat('#f4f0e6', { rough: 0.9, side: THREE.DoubleSide }), { rigid: true });
  // pom-poms down the front
  for (let i = 0; i < 3; i++) rig.attach(rig.chest, xf(new THREE.IcosahedronGeometry(0.035, 1), { y: 0.06 + i * 0.1, z: p.chestW * 0.42 }), skinMat(['#c42a2a', '#2a6ac4', '#e0b020'][i], { rough: 1 }), { rigid: true });
  return result(rig, {
    kind: 'biped', height: 2.1, radius: 0.36, eyeY: 1.9,
    animate(st, dt) {
      // a bouncing, too-happy gait; arms flail when it runs
      st.stride = 1.5; st.lean = st.chasing ? 0.25 : -0.05; st.hunch = 0.1;
      st.armSwing = st.chasing ? 1.6 : 0.9; st.armsOut = st.chasing ? 0.5 : 0.15; st.grip = 0.1;
      st.tilt = Math.sin(st.t * 1.1) * 0.35;
      animateBiped(rig, st, dt);
      rig.hips.position.y += Math.abs(Math.sin(st.phase)) * 0.06 * clamp(st.speed, 0, 1);
      if (st.giggle) rig.chest.rotation.x += Math.sin(st.t * 30) * 0.05;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.jester = buildJester;

// 9 ---------------------------------------------------------------- GIGGLES
D.jester = {
  name: 'Giggles', speed: 1.6, chase: 5.4, detect: 16, dmg: 28, reach: 1.45, cd: 1.0, memory: 6, voice: 'giggle',
  num: 'Φ-09 · Coulrophobia', cls: 'Lethal', size: '2.1 m in its big shoes',
  desc: 'A clown, too tall, greasepaint cracked, a grin painted far past the edges of its real mouth. It honks.',
  notes: 'It never comes from behind. It is always somewhere ahead, waiting around the next corner, and it giggles when you find it. Then it stands very still for one second — and charges.',
  tips: ['When you hear giggling ahead, take another route.', 'The second it freezes after being seen is your head start.', 'It vanishes after a charge — it is setting up the next one.'],
  sketch: [['head', 'painted grin'], ['chest', 'ruff and pom-poms'], ['foot', 'shoes 44 cm long']],
  init(m, e) { e.mode = 'lurk'; e.modeT = 0; e.hopIn = 6; },
  frame(m, e, dt, d, looked) {
    e.modeT += dt;
    if (e.mode === 'lurk') {
      e.freeze = true; e.st.giggle = 0;
      if (looked > 0 && d < 18) { e.mode = 'reveal'; e.modeT = 0; m.game.audio.entity(e.type, 'alert', e.pos, PL(m)); PL(m).addTrauma(0.25); }
      else if (e.modeT > e.hopIn || d > 40) {
        e.modeT = 0; e.hopIn = 8 + m.rng.next() * 8;
        const s = spotAround(m, 1, 11, 20, true, 0.7);
        if (s) { place(m, e, s[0], s[1]); e.yaw = faceYaw(m, e); if (m.rng.next() < 0.6) m.game.audio.entity(e.type, 'voice', e.pos, PL(m)); }
      }
      return 'static';
    }
    if (e.mode === 'reveal') { e.freeze = true; e.st.giggle = 1; e.yaw = faceYaw(m, e); e.threat = 0.8; if (e.modeT > 1.0) { e.mode = 'charge'; e.modeT = 0; m.alert(e); e.freeze = false; } return 'static'; }
    if (e.mode === 'charge') {
      e.freeze = false; e.st.giggle = 0;
      if (e.modeT > 7 || (d > 22 && e.modeT > 3)) { e.mode = 'lurk'; e.modeT = 0; e.hopIn = 4; m.hide(e, 5); return 'skip'; }
    }
    return null;
  },
  speedFn(m, e, want) { return e.mode === 'charge' ? want * (0.75 + 0.45 * Math.abs(Math.sin(e.modeT * 2.7))) : want; },
  think(m, e) { if (e.mode === 'charge') chaseTo(m, e); },
};

})();
