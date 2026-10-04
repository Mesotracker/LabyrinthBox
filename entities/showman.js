// =============================================================================
//  The Showman   (entity id: 'showman')
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
const { animateBiped, canvasTex, clamp, ellipsoid, glowMat, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, headLift, HUMAN, noiseFill, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, inBeam, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 8  THE SHOWMAN (automatonophobia)
const maskTex = () => tex('showmask', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#e6d6b8', ['#c8b490', '#f4e8d0', '#9a8460']);
  g.fillStyle = 'rgba(0,0,0,0.85)';
  for (const x of [0.33, 0.67]) { g.beginPath(); g.ellipse(w * x, h * 0.4, w * 0.075, h * 0.06, 0, 0, Math.PI * 2); g.fill(); }
  // painted-on lashes and a showman's grin
  g.strokeStyle = '#1a0a08'; g.lineWidth = 6;
  for (const x of [0.33, 0.67]) { g.beginPath(); g.ellipse(w * x, h * 0.4, w * 0.085, h * 0.07, 0, Math.PI, Math.PI * 2); g.stroke(); }
  g.fillStyle = '#c03030';
  for (const x of [0.22, 0.78]) { g.beginPath(); g.arc(w * x, h * 0.58, w * 0.05, 0, Math.PI * 2); g.globalAlpha = 0.5; g.fill(); g.globalAlpha = 1; }
  g.strokeStyle = '#7a1010'; g.lineWidth = 10; g.lineCap = 'round';
  g.beginPath(); g.moveTo(w * 0.24, h * 0.66); g.quadraticCurveTo(w * 0.5, h * 0.86, w * 0.76, h * 0.66); g.stroke();
  // paint flaking off, grime in the creases
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${90 + Math.random() * 40},${70 + Math.random() * 30},${50},${0.4 + Math.random() * 0.4})`; g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 4 + Math.random() * 14, 3 + Math.random() * 9, Math.random() * 3, 0, Math.PI * 2); g.fill(); }
}));


function buildShowman() {
  const p = { ...HUMAN, hipH: 1.0, thigh: 0.48, shin: 0.46, chestW: 0.4, shoulderW: 0.46, upperArm: 0.33, foreArm: 0.31, armR: 0.55, legR: 0.55, headR: 0.13 };
  const rig = new Rig(p);
  const steel = skinMat('#8a8c90', { metal: 1, rough: 0.35 });
  const dark = skinMat('#2a2a2c', { metal: 0.6, rough: 0.5 });
  const suitT = cloth('tux', { base: '#1a1418', dark: '#060406', stain: '#2a2010', weave: 150, stains: 0.35, wear: 0.4 });
  const suit = skinMat('#9a9a9a', { map: suitT.map, bump: suitT.bump, bumpScale: 0.8, rough: 0.7 });
  // the costume covers the torso; arms and legs are bare endoskeleton
  buildBody(rig, p, { skin: steel, top: suit, bottom: suit, legs: steel, arms: steel, shoes: dark, hands: steel }, { fingerLen: 0.1, fingerR: 0.6, footLen: 0.27, chestDepth: 0.7 });
  // pistons and cables along the limbs
  for (const A of rig.arms) {
    rig.attach(A.sh, xf(new THREE.CylinderGeometry(0.012, 0.012, p.upperArm * 0.9, 6), { y: -p.upperArm / 2, z: 0.04 }), dark, { rigid: true });
    rig.attach(A.el, xf(ellipsoid(0.035, 0.035, 0.035), {}), dark, { rigid: true });
  }
  for (const L of rig.legs) {
    rig.attach(L.hip, xf(new THREE.CylinderGeometry(0.014, 0.014, p.thigh * 0.85, 6), { y: -p.thigh / 2, z: 0.05 }), dark, { rigid: true });
    rig.attach(L.kn, xf(ellipsoid(0.045, 0.045, 0.045), {}), dark, { rigid: true });
  }
  const hl = headLift(p);
  // metal skull, plastic mask half off
  rig.attach(rig.head, xf(ellipsoid(0.12, 0.14, 0.13), { y: hl }), steel, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
  const mask = rig.attach(rig.head, xf(new THREE.SphereGeometry(0.14, 22, 16, Math.PI / 2 - 0.9, 1.8, 0.35, 1.6), { y: hl + 0.01, z: 0.015 }), skinMat('#ffffff', { map: maskTex(), rough: 0.45 }), { rigid: true });
  mask.rotation.z = 0.08;
  const jaw = new THREE.Group(); jaw.position.set(0, hl - 0.06, 0.02); rig.head.add(jaw);
  jaw.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.15, 0.03, 0.12), { y: -0.03, z: 0.05 }), steel));
  const teeth = [];
  for (let i = 0; i < 8; i++) teeth.push(xf(new THREE.BoxGeometry(0.012, 0.02, 0.012), { x: -0.05 + i * 0.014, y: -0.005, z: 0.105 }));
  jaw.add(new THREE.Mesh(merge(teeth), skinMat('#d8d0b8', { rough: 0.4 })));
  const eyeL = glowMat('#ff3a1a');
  for (const s of [-1, 1]) rig.attach(rig.head, xf(ellipsoid(0.013, 0.013, 0.008), { x: s * 0.045, y: hl + 0.035, z: 0.125 }), eyeL, { rigid: true, shadow: false });
  // top hat and bow tie
  rig.attach(rig.head, xf(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 18), { y: hl + 0.22, rz: -0.12 }), suit, { rigid: true });
  rig.attach(rig.head, xf(new THREE.CylinderGeometry(0.16, 0.16, 0.015, 20), { y: hl + 0.12, rz: -0.12 }), suit, { rigid: true });
  rig.attach(rig.chest, xf(new THREE.BoxGeometry(0.12, 0.05, 0.02), { y: p.chestH - 0.03, z: 0.15 }), skinMat('#7a1018', { rough: 0.5 }), { rigid: true, shadow: false });
  let acc = 0, twitch = 0;
  return result(rig, {
    kind: 'biped', height: 2.05, radius: 0.34, eyeY: 1.85, frozenPose: true,
    animate(st, dt) {
      // servo motion: poses snap a few times a second instead of flowing
      acc += dt; twitch -= dt;
      if (acc < 1 / 9 && !st.force) return;
      const step = acc; acc = 0;
      st.stride = 1.5; st.armSwing = 0.5; st.lean = 0; st.grip = 0.3; st.rate = 400; st.armsOut = st.chasing ? 0.4 : 0.1;
      if (twitch <= 0) { twitch = 0.4 + Math.random() * 1.6; st.tilt = (Math.random() - 0.5) * 0.9; }
      animateBiped(rig, st, step);
      jaw.rotation.x = st.chasing ? Math.abs(Math.sin(st.t * 6)) * 0.45 : (Math.random() < 0.05 ? 0.3 : 0.02);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.showman = buildShowman;

// 8 ---------------------------------------------------------------- THE SHOWMAN
D.showman = {
  name: 'The Showman', speed: 1.2, chase: 3.8, detect: 20, dmg: 32, reach: 1.45, cd: 1.3, memory: 12, freezePose: true, voice: 'servo',
  num: 'Φ-08 · Automatonophobia', cls: 'Hostile', size: '2.05 m',
  desc: 'A theatre animatronic: top hat, tuxedo, a painted grin on a mask that has slipped half off a steel skull. Its eyes are two red bulbs.',
  notes: 'It was built to perform under a spotlight, and a spotlight still stops it dead. In the dark it moves in jerks and whirrs, and it moves quickly. Hold your flashlight on it and it locks up mid-step.',
  tips: ['Flashlight on it = frozen. Flashlight off = it is coming.', 'Batteries matter more here than anywhere.', 'Listen for the servos when you cannot see it.'],
  sketch: [['head', 'mask slipped off'], ['chest', 'tuxedo shell'], ['foot', 'steel endoskeleton']],
  observe(m, e, looked, d) { return inBeam(m, e, looked, d, 0.8) || (looked > 0 && e.lum > 0.22); },
  think(m, e, d, sees) { if (!e.observed) hunt(m, e, d, sees || d < 6); },
  frame(m, e, dt, d) { if (e.observed && !e.wasObs) m.game.audio.entity(e.type, 'voice', e.pos, PL(m)); e.wasObs = e.observed; e.threat = !e.observed && e.state === 'chase' ? clamp(1 - d / 20, 0, 1) : 0; return null; },
};

})();
