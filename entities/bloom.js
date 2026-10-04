// =============================================================================
//  The Bloom   (entity id: 'bloom')
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
const { animateBiped, clamp, lerp, merge, paintTex, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, HUMAN, mix3, organic, result, sm, tex } = __mod['src/entities/models.js'].HELPERS;
const { haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { chaseTo, D, inBeam, ph, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 39  THE BLOOM (anthophobia)
const petalTex = () => tex('petal', () => paintTex(256, 256, (u, v, N, out) => {
  const m = N.fbm(u, v, 5, 4);
  let c = mix3([0.62, 0.12, 0.08], [0.32, 0.04, 0.03], m);
  const [d1] = N.cell(u, v, 14);
  const wart = sm(0.18, 0.08, d1) * sm(0.3, 0.6, N.fbm(u + 3, v, 3, 2));
  c = mix3(c, [0.9, 0.84, 0.74], wart);
  out.h = 0.5 + wart * 0.5 + m * 0.1;
  return c;
}, { bump: true }));


function buildBloom() {
  const p = { ...HUMAN, hipH: 1.12, chestW: 0.3, armR: 0.65, legR: 0.62, upperArm: 0.42, foreArm: 0.42, headR: 0.09, neck: 0.25 };
  const rig = new Rig(p);
  const stem = fleshMat(organic('stem', { base: '#4a6a2a', dark: '#1a2a0a', light: '#7a9a4a', veins: 0.6, vein: '#2a3a10', wrinkle: 0.8, wrinkleF: 40, mottle: 0.6, repeat: [1, 3] }), { rough: 0.6, bumpScale: 2 });
  buildBody(rig, p, { skin: stem, top: stem, bottom: stem, shoes: stem }, { fingerLen: 0.18, fingerR: 0.6, fingerVar: true, chestDepth: 0.48, neckR: 0.55, ribs: true });
  const hl = headLift(p);
  // the flower head: five fleshy petals around a pit lined with teeth
  const flower = new THREE.Group(); flower.position.set(0, hl + 0.05, 0.05); flower.rotation.x = -0.35; rig.head.add(flower);
  const pt = petalTex();
  const petalM = skinMat('#c8c8c8', { map: pt.map, bump: pt.bump, bumpScale: 2, rough: 0.5, side: THREE.DoubleSide });
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const piv = new THREE.Group(); piv.rotation.z = i / 5 * Math.PI * 2; flower.add(piv);
    const hinge = new THREE.Group(); hinge.position.y = 0.08; piv.add(hinge);
    const g = new THREE.SphereGeometry(0.22, 14, 8, 0, Math.PI, 0, Math.PI / 2); g.scale(0.8, 1.1, 0.35); g.rotateZ(-Math.PI / 2); g.translate(0, 0.2, 0);
    hinge.add(new THREE.Mesh(g, petalM));
    petals.push(hinge);
  }
  flower.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.1, 0.06, 0.08, 18, 1, true), { rx: Math.PI / 2, z: 0.0 }), skinMat('#3a0806', { rough: 0.3, side: THREE.DoubleSide })));
  flower.add(new THREE.Mesh(xf(new THREE.CircleGeometry(0.07, 16), { z: -0.03 }), skinMat('#0a0202', { rough: 0.3 })));
  const teeth = [];
  for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; teeth.push(xf(new THREE.ConeGeometry(0.008, 0.05, 4), { x: Math.cos(a) * 0.085, y: Math.sin(a) * 0.085, z: 0.02, rz: a + Math.PI / 2, rx: 0.6 })); }
  flower.add(new THREE.Mesh(merge(teeth), skinMat('#e8e0c8', { rough: 0.3 })));
  // leaves on the arms
  const leafM = skinMat('#3a5a1a', { rough: 0.6, side: THREE.DoubleSide });
  for (const A of rig.arms) rig.attach(A.sh, xf(new THREE.CircleGeometry(0.08, 6), { y: -0.2, z: 0.05, sx: 0.5, rx: 0.8 }), leafM, { rigid: true });
  const pollen = [];
  const map = haloMat('#ffffff').map;
  for (let i = 0; i < 30; i++) { const s = sprite(map, 0xe8d050, 0.05, 0.7); rig.root.add(s); pollen.push({ s, a: Math.random() * 6.28, r: 0.2 + Math.random() * 1.4, y: 1.4 + Math.random() * 1.2, sp: 0.2 + Math.random() * 0.4, ph: Math.random() * 6 }); }
  return result(rig, {
    kind: 'biped', height: 2.4, radius: 0.32, eyeY: 2.2, frozenPose: true,
    animate(st, dt) {
      st.lean = 0.08; st.hunch = 0.1; st.stride = 1.6; st.armSwing = 0.5; st.grip = 0.3; st.sway = 0.06; st.tilt = Math.sin(st.t * 0.5) * 0.15;
      animateBiped(rig, st, dt);
      const open = clamp(0.25 + (st.chasing ? 0.4 : 0) + (st.attack || 0) * 0.6, 0, 1);
      for (const h of petals) h.rotation.x = lerp(-0.6, 0.6, open) + Math.sin(st.t * 1.3) * 0.04;
      for (const pl of pollen) { pl.a += dt * pl.sp; pl.s.position.set(Math.cos(pl.a) * pl.r, pl.y + Math.sin(st.t * 0.7 + pl.ph) * 0.3, Math.sin(pl.a) * pl.r); }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.bloom = buildBloom;

// 39 --------------------------------------------------------------- THE BLOOM
D.bloom = {
  name: 'The Bloom', speed: 0, chase: 3.8, detect: 999, dmg: 28, reach: 1.5, cd: 1.2, memory: 999, xray: true, statue: true, voice: 'rustle',
  num: 'Φ-39 · Anthophobia', cls: 'Hostile', size: '2.4 m',
  desc: 'A figure of green stems with a huge red flower for a head: five warted petals around a pit lined with teeth. Pollen hangs in the air around it.',
  notes: 'Like any plant, it does not move while it is being watched. Unwatched, it walks. The pollen it sheds makes you cough and fogs your eyes — and the closer you are, the harder it is to keep watching.',
  tips: ['Keep it in view and back away.', 'Do not stand in yellow air: the pollen drains your stamina.', 'Pollen near a doorway means it went through.'],
  sketch: [['head', 'flower with teeth'], ['chest', 'stems'], ['foot', 'moves when unwatched']],
  observe(m, e, looked, d) { return looked > 0 && (e.lum > 0.02 || d < 5 || inBeam(m, e, looked, d)); },
  frame(m, e, dt, d) {
    if (d < 6) { const pl = PL(m); pl.stamina = Math.max(0, pl.stamina - dt * 9); if (Math.random() < dt * 0.7) { m.game.audio.cough(); pl.addTrauma(0.12); } if (ph(m)) ph(m).pollen = Math.max(ph(m).pollen || 0, clamp(1 - d / 6, 0, 1)); }
    e.threat = clamp(1 - d / 10, 0, 1) * 0.6;
    return null;
  },
  think(m, e) { if (!e.observed) chaseTo(m, e); },
};

})();
