// =============================================================================
//  The Hour Man   (entity id: 'hourman')
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
const { V } = __mod['src/phobia/models_b.js'];
const { animateBiped, canvasTex, clamp, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, fleshMat, headLift, HUMAN, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, ph, place, spotAround, strike } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 33  THE HOUR MAN (chronophobia)
function clockFaceTex(n = 12, cracked = true) {
  return tex('clock' + n, () => canvasTex(512, 512, (g, w, h) => {
    const c = w / 2;
    const r = g.createRadialGradient(c, c, 10, c, c, c);
    r.addColorStop(0, '#f2ead6'); r.addColorStop(0.85, '#d8ccb0'); r.addColorStop(1, '#6a5a3a');
    g.fillStyle = r; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1a1208'; g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const ro = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; g.fillText(ro[i], c + Math.cos(a) * c * 0.75, c + Math.sin(a) * c * 0.75); }
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; g.fillRect(c + Math.cos(a) * c * 0.9 - 1, c + Math.sin(a) * c * 0.9 - 1, i % 5 ? 3 : 7, i % 5 ? 3 : 7); }
    if (cracked) { g.strokeStyle = '#2a1a0a'; g.lineWidth = 2; let x = c * 0.3, y = c * 0.2; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 9; k++) { x += 30 + Math.random() * 20; y += 25 + (Math.random() - 0.5) * 30; g.lineTo(x, y); } g.stroke(); }
  }));
}


function buildHourMan() {
  const p = { ...HUMAN, hipH: 1.35, thigh: 0.66, shin: 0.66, spine: 0.25, chestH: 0.5, neck: 0.15, shoulderW: 0.5, upperArm: 0.55, foreArm: 0.55, chestW: 0.3, armR: 0.6, legR: 0.55, headR: 0.1 };
  const rig = new Rig(p);
  const wood = skinMat('#3a2010', { rough: 0.45 });
  const brass = skinMat('#b8903a', { metal: 1, rough: 0.3 });
  const skin = fleshMat(organic('hourskin', { base: '#7a6a5a', dark: '#3a2a20', wrinkle: 0.7, wrinkleF: 120, veins: 0.3 }), { rough: 0.8, bumpScale: 1.6 });
  buildBody(rig, p, { skin, top: wood, bottom: skin, shoes: wood }, { fingerLen: 0.16, fingerR: 0.7 });
  // the torso is a grandfather clock case, glass door, a pendulum swinging inside
  const caseG = new THREE.Group(); caseG.position.y = -0.1; rig.chest.add(caseG);
  for (const [x, y, z, w, h, d] of [[0, 0.3, -0.1, 0.42, 0.9, 0.02], [-0.2, 0.3, 0, 0.02, 0.9, 0.22], [0.2, 0.3, 0, 0.02, 0.9, 0.22], [0, 0.76, 0, 0.44, 0.04, 0.24], [0, -0.16, 0, 0.44, 0.04, 0.24]]) caseG.add(new THREE.Mesh(xf(new THREE.BoxGeometry(w, h, d), { x, y, z }), wood));
  caseG.add(new THREE.Mesh(xf(new THREE.PlaneGeometry(0.38, 0.86), { y: 0.3, z: 0.11 }), skinMat('#8aa0a8', { rough: 0.05, transparent: true, opacity: 0.25, depthWrite: false })));
  const pend = new THREE.Group(); pend.position.y = 0.7; caseG.add(pend);
  pend.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.006, 0.006, 0.7, 5), { y: -0.35 }), brass));
  pend.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 18), { y: -0.72, rx: Math.PI / 2 }), brass));
  // a clock for a head
  const hl = headLift(p);
  const head = new THREE.Group(); head.position.y = hl + 0.08; rig.head.add(head);
  head.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 28), { rx: Math.PI / 2 }), brass));
  head.add(new THREE.Mesh(xf(new THREE.CircleGeometry(0.18, 28), { z: 0.041 }), skinMat('#ffffff', { map: clockFaceTex(), rough: 0.5 })));
  const hands = [];
  for (const [len, wdt] of [[0.11, 0.012], [0.15, 0.008]]) {
    const hnd = new THREE.Group(); hnd.position.z = 0.046; head.add(hnd);
    hnd.add(new THREE.Mesh(xf(new THREE.BoxGeometry(wdt, len, 0.004), { y: len / 2 }), skinMat('#0a0806', { rough: 0.4 })));
    hands.push(hnd);
  }
  return result(rig, {
    kind: 'biped', height: 2.75, radius: 0.36, eyeY: 2.55, hands,
    animate(st, dt) {
      st.stride = 2.4; st.lean = 0.05; st.hunch = 0.05; st.armSwing = 0.5; st.grip = 0.6;
      animateBiped(rig, st, dt);
      pend.rotation.z = Math.sin(st.t * Math.PI) * 0.35;
      // the hands show the time it has left you
      const left = st.clock ?? 1;
      hands[0].rotation.z = -left * Math.PI * 2;
      hands[1].rotation.z = -((st.t * 0.5) % 1) * Math.PI * 2 * (st.chasing ? 8 : 1);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.hourman = buildHourMan;

// 33 --------------------------------------------------------------- THE HOUR MAN
D.hourman = {
  name: 'The Hour Man', speed: 1.0, chase: 1.6, detect: 999, dmg: 45, reach: 1.6, cd: 1.5, memory: 999, xray: true, voice: 'tick', noLeash: true,
  num: 'Φ-33 · Chronophobia', cls: 'Lethal', size: '2.75 m',
  desc: 'A tall, thin man whose body is a grandfather clock, pendulum swinging behind the glass, a cracked clock face for a head.',
  notes: 'Every time the clocks strike, it is suddenly closer, and a little faster. When your time runs out it stops walking and runs. The hands on its face show how long you have.',
  tips: ['Watch the TIME LEFT counter, not the creature.', 'Plan your route before the next chime.', 'Never waste time searching drawers late in the level.'],
  sketch: [['head', 'shows your time'], ['chest', 'a pendulum'], ['foot', 'faster every hour']],
  frame(m, e, dt, d) {
    const p = ph(m);
    const left = p ? p.clockLeft : 1, chimes = p ? p.chimes : 0;
    e.st.clock = left;
    if (p && p.chimes !== e.seenChime) {
      e.seenChime = p.chimes;
      if (chimes > 0) { const s = spotAround(m, -1, Math.max(5, d * 0.62), Math.max(7, d * 0.75), true, 1.2); if (s) place(m, e, s[0], s[1]); }
    }
    e.out = left <= 0;
    e.threat = e.out ? 1 : clamp(1 - d / 25, 0, 1) * 0.6;
    return null;
  },
  speedFn(m, e) { const p = ph(m); if (e.out) return 5.2 * m.diff.speed; return (1.0 + (p ? p.chimes : 0) * 0.32) * m.diff.speed; },
  think(m, e) { chaseTo(m, e); },
};

})();
