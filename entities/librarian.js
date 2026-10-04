// =============================================================================
//  The Librarian   (entity id: 'librarian')
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
const { animateBiped, canvasTex, ellipsoid, latheGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, HUMAN, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 40  THE LIBRARIAN (bibliophobia)
const pageTex = () => tex('pages', () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#d8ccb0'; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(40,30,20,0.75)';
  for (let y = 10; y < h; y += 9) { let x = 8; while (x < w - 8) { const L = 4 + Math.random() * 26; g.fillRect(x, y, L, 2.5); x += L + 5; } }
  g.globalAlpha = 0.3; g.fillStyle = '#6a4a2a';
  for (let i = 0; i < 20; i++) { g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 8 + Math.random() * 30, 0, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 1;
  g.strokeStyle = 'rgba(60,40,20,0.5)'; for (let x = 64; x < w; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (Math.random() - 0.5) * 10, h); g.stroke(); }
}, { repeat: true }));


function buildLibrarian() {
  const p = { ...HUMAN, hipH: 1.25, thigh: 0.6, shin: 0.6, spine: 0.28, chestH: 0.42, neck: 0.22, upperArm: 0.5, foreArm: 0.52, chestW: 0.28, armR: 0.55, legR: 0.5, headR: 0.1 };
  const rig = new Rig(p);
  const pages = skinMat('#ffffff', { map: pageTex(), rough: 0.9, side: THREE.DoubleSide });
  const skin = fleshMat(organic('libskin', { base: '#d0c4a8', dark: '#8a7a5a', wrinkle: 0.6, wrinkleF: 140, veins: 0.4, vein: '#3a2a20' }), { rough: 0.8 });
  buildBody(rig, p, { skin, top: pages, bottom: pages, arms: pages, shoes: skin, hands: skin }, { sleeve: true, fingerLen: 0.2, fingerR: 0.6, fingerVar: true });
  const robe = latheGeo([[-p.hipH - 0.02, 0.38], [-p.hipH * 0.5, 0.28], [0.0, 0.22], [0.12, 0.2]], 0.8, 20);
  const rb = rig.attach(rig.hips, robe, pages, { rigid: true });
  // an open book for a head, pages riffling
  const hl = headLift(p);
  const book = new THREE.Group(); book.position.set(0, hl + 0.04, 0.0); rig.head.add(book);
  const coverM = skinMat('#3a1a12', { rough: 0.55 });
  const covers = [];
  for (const s of [-1, 1]) { const c = new THREE.Group(); book.add(c); c.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.17, 0.26, 0.012), { x: s * 0.085 }), coverM)); covers.push({ c, s }); }
  const leaves = [];
  for (let i = 0; i < 12; i++) { const lf = new THREE.Group(); book.add(lf); lf.add(new THREE.Mesh(xf(new THREE.PlaneGeometry(0.16, 0.24), { x: 0.08 }), pages)); leaves.push(lf); }
  // a stitched mouth under the book
  rig.attach(rig.neck, xf(ellipsoid(0.04, 0.006, 0.01), { y: p.neck - 0.02, z: 0.04 }), skinMat('#2a1008', { rough: 0.6 }), { rigid: true, shadow: false });
  return result(rig, {
    kind: 'biped', height: 2.5, radius: 0.32, eyeY: 2.3,
    animate(st, dt) {
      st.lean = 0.15; st.hunch = 0.3; st.stride = 2.0; st.armSwing = 0.15; st.grip = 0.4; st.tilt = Math.sin(st.t * 0.6) * 0.3;
      animateBiped(rig, st, dt);
      const open = st.chasing ? 1.25 : 0.7;
      for (const c of covers) c.c.rotation.y = c.s * (Math.PI / 2 - open);
      leaves.forEach((lf, i) => { lf.rotation.y = -Math.PI / 2 + open + ((st.t * (st.chasing ? 4 : 0.6) + i / 12) % 1) * (Math.PI - 2 * open); });
      rb.rotation.x = Math.sin(st.t * 0.7) * 0.03 + st.speed * 0.05;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.librarian = buildLibrarian;

// 40 --------------------------------------------------------------- THE LIBRARIAN
D.librarian = {
  name: 'The Librarian', speed: 0.8, chase: 4.4, detect: 0, dmg: 34, reach: 1.5, cd: 1.3, memory: 6, xray: true, voice: 'shush',
  num: 'Φ-40 · Bibliophobia', cls: 'Lethal', size: '2.5 m',
  desc: 'A tall, stooped thing in a robe of pages, an open book where its head should be, its mouth sewn shut beneath it. The pages turn by themselves.',
  notes: 'It is blind and it hears everything. Running, jumping, landing, opening drawers, clicking your flashlight — it comes to the sound, fast, and searches where it heard it.',
  tips: ['Crouch-walk everywhere.', 'Make a noise on purpose, then sneak the other way.', 'The NOISE meter shows how loud you are.'],
  sketch: [['head', 'an open book'], ['chest', 'robe of pages'], ['hand', 'long fingers']],
  init(m, e) { e.off = m.game.bus.on('noise', ({ x, z, r }) => { if (Math.hypot(x - e.pos.x, z - e.pos.z) < r * m.diff.detect) { e.lastSeen = [x, z]; e.state = 'search'; e.path = null; e.heardT = 6; } }); },
  think(m, e, d) {
    const pl = PL(m), P = pl.pos;
    // continuous footsteps are noise too
    const r = pl.sprinting ? 22 : (pl.walkSpeed || 0) > 0.5 ? (pl.stance === 'stand' ? 8 : 2.2) : 0;
    if (r && d < r * m.diff.detect) { e.lastSeen = [P.x, P.z]; if (e.state !== 'search') m.game.audio.entity(e.type, 'alert', e.pos, pl); e.state = 'search'; e.path = null; e.heardT = 6; }
    if (e.state === 'search' && e.lastSeen) {
      e.heardT = (e.heardT || 0) - 0.2;
      if (Math.hypot(e.lastSeen[0] - e.pos.x, e.lastSeen[1] - e.pos.z) < 1.2 || e.heardT <= 0) { e.state = 'wander'; e.idle = 2; e.goal = null; }
      else m.route(e, e.lastSeen[0], e.lastSeen[1]);
      if (d < 2.2) e.state = 'chase';
      return;
    }
    if (e.state === 'chase') { if (d > 3) e.state = 'wander'; else m.route(e, P.x, P.z); return; }
    if (!e.goal || e.idle > 0) m.wander(e);
  },
  speedFn(m, e, want) { return e.state === 'search' ? e.def.chase * m.diff.speed : want; },
};

})();
