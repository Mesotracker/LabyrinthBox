// =============================================================================
//  Someone   (entity id: 'someone')
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
const { humanSkin } = __mod['src/phobia/models_b.js'];
const { animateBiped, canvasTex, clamp, ellipsoid, poseHand, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, face, headLift, headOn, HUMAN, noiseFill, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, faceYaw, hunt, PL, place, spotAround, visibleToPlayer } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 21  SOMEONE (monophobia)
const someoneFace = (rev) => tex('someone' + (rev ? 'R' : ''), () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#d8b49a', ['#b08a70', '#ecc8b0']);
  if (!rev) {
    g.fillStyle = '#2a1a10';
    for (const x of [0.35, 0.65]) { g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(w * x, h * 0.42, w * 0.05, h * 0.025, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#4a3020'; g.beginPath(); g.arc(w * x, h * 0.42, w * 0.022, 0, Math.PI * 2); g.fill(); }
    g.strokeStyle = '#4a2a1a'; g.lineWidth = 5;
    for (const x of [0.35, 0.65]) { g.beginPath(); g.moveTo(w * (x - 0.07), h * 0.35); g.lineTo(w * (x + 0.07), h * 0.34); g.stroke(); }
    g.strokeStyle = '#8a4a3a'; g.lineWidth = 6; g.beginPath(); g.moveTo(w * 0.42, h * 0.72); g.quadraticCurveTo(w * 0.5, h * 0.75, w * 0.58, h * 0.72); g.stroke();
  } else {
    for (const x of [0.35, 0.65]) { g.fillStyle = '#000'; g.beginPath(); g.ellipse(w * x, h * 0.42, w * 0.07, h * 0.06, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#120404'; g.beginPath(); g.ellipse(w * 0.5, h * 0.72, w * 0.18, h * 0.26, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e8e0c8';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(w * (0.5 + Math.cos(a) * 0.17), h * (0.72 + Math.sin(a) * 0.24)); g.lineTo(w * (0.5 + Math.cos(a) * 0.1), h * (0.72 + Math.sin(a) * 0.15)); g.lineTo(w * (0.5 + Math.cos(a + 0.2) * 0.17), h * (0.72 + Math.sin(a + 0.2) * 0.24)); g.fill(); }
  }
}));


function buildSomeone(rng) {
  const p = { ...HUMAN, headR: 0.112 };
  const rig = new Rig(p);
  const skin = humanSkin('someoneskin', '#c9a68a');
  const hood = cloth('hoodie', { base: rng ? rng.pick(['#7a2a2a', '#2a4a7a', '#4a4a4a', '#5a6a3a']) : '#2a4a7a', dark: '#101010', stain: '#3a3026', weave: 90, stains: 0.4 });
  const top = skinMat('#b0b0b0', { map: hood.map, bump: hood.bump, bumpScale: 0.9, rough: 0.9 });
  const jt = cloth('jeans', { base: '#2e3a4d', dark: '#101010', twill: '#5a6680', weave: 80, stains: 0.25, wear: 0.4 });
  const jeans = skinMat('#a8a8a8', { map: jt.map, bump: jt.bump, rough: 0.9 });
  buildBody(rig, p, { skin, top, bottom: jeans, shoes: skinMat('#e8e8e8', { rough: 0.6 }) }, { sleeve: true });
  headOn(rig, p, skin);
  const faceA = skinMat('#ffffff', { map: someoneFace(false), rough: 0.55 });
  const faceB = skinMat('#ffffff', { map: someoneFace(true), rough: 0.55 });
  const fm = face(rig, p, null, faceA);
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(p.headR * 1.05, p.headR * 0.72, p.headR * 1.12), { y: 0.05 + hl, z: -0.012 }), skinMat('#2a1a10', { rough: 0.9 }), { rigid: true });
  let revealed = false;
  return result(rig, {
    kind: 'biped', height: 1.8, radius: 0.32, eyeY: 1.65,
    animate(st, dt) {
      const rev = clamp(st.reveal || 0, 0, 1);
      if ((rev > 0.5) !== revealed) { revealed = rev > 0.5; fm.material = revealed ? faceB : faceA; }
      st.stride = 1.35; st.lean = rev * 0.3; st.hunch = rev * 0.3; st.armsOut = rev * 0.5; st.grip = rev ? 0.8 : 0.25;
      animateBiped(rig, st, dt);
      rig.head.scale.set(1, 1 + rev * 0.45, 1);
      rig.neck.scale.y = 1 + rev * 0.8;
      // waving, when it wants you to come over
      if (st.wave && !rev) { const A = rig.arms[0]; A.sh.rotation.x = -2.6; A.sh.rotation.z = 0.4 + Math.sin(st.t * 6) * 0.3; A.el.rotation.x = -0.4; poseHand(A, 0, 0.6, st.t); }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.someone = buildSomeone;

// 21 --------------------------------------------------------------- SOMEONE
D.someone = {
  name: 'Someone', speed: 1.2, chase: 5.2, detect: 14, dmg: 38, reach: 1.45, cd: 1.0, memory: 6, voice: 'call', noLeash: true,
  num: 'Φ-21 · Monophobia', cls: 'Lethal', size: '1.8 m',
  desc: 'Another person. Hoodie, jeans, an ordinary tired face. They wave at you from the far end of a hall, the first other human you have seen in days.',
  notes: 'They call out, they wave you over. They never come to you. Go to them and the face comes apart — the eyes go black, the jaw opens down to the chest — and they run you down.',
  tips: ['There is nobody else here. Remember that.', 'Do not walk toward anyone who waves.', 'Loneliness clouds your judgement: stand in the light to clear your head.'],
  sketch: [['head', 'an ordinary face. until'], ['chest', 'hoodie'], ['hand', 'waves you over']],
  spawnFn(m, type) { const s = spotAround(m, 1, 18, 28, false, 1.2); return s ? m.make(type, s[0], s[1]) : null; },
  init(m, e) { e.mode = 'wave'; e.modeT = 0; e.st.wave = true; },
  frame(m, e, dt, d, looked) {
    e.modeT += dt;
    if (e.mode === 'wave') {
      e.freeze = true; e.st.wave = true; e.yaw = faceYaw(m, e); e.st.reveal = 0;
      e.callT = (e.callT || 4) - dt;
      if (e.callT <= 0 && d < 40) { e.callT = 6 + m.rng.next() * 6; m.game.audio.entity(e.type, 'voice', e.pos, PL(m)); }
      if (d < 6) { e.mode = 'reveal'; e.modeT = 0; m.game.audio.entity(e.type, 'alert', e.pos, PL(m)); PL(m).addTrauma(0.6); }
      else if ((d > 42 || (looked <= 0 && e.modeT > 25)) && !visibleToPlayer(m, e.pos.x, e.pos.z)) { const s = spotAround(m, 1, 18, 30, false, 1.0); if (s) { place(m, e, s[0], s[1]); e.modeT = 0; } }
      return 'static';
    }
    if (e.mode === 'reveal') { e.st.reveal = Math.min(1, e.st.reveal + dt * 2.5); e.st.wave = false; e.yaw = faceYaw(m, e); e.threat = 1; if (e.modeT > 0.8) { e.mode = 'hunt'; e.modeT = 0; e.freeze = false; m.alert(e); } return 'static'; }
    if (e.mode === 'hunt' && (e.modeT > 9 || d > 30)) { e.mode = 'wave'; e.modeT = 0; m.hide(e, 10); return 'skip'; }
    return null;
  },
  think(m, e) { if (e.mode === 'hunt') chaseTo(m, e); },
};

})();
