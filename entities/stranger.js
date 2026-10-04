// =============================================================================
//  The Strangers   (entity id: 'stranger')
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
const { humanSkin } = __mod['src/phobia/models_b.js'];
const { animateBiped, canvasTex, clamp, ellipsoid, latheGeo, lerp, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, face, headLift, headOn, HUMAN, noiseFill, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, faceYaw, inBeam, ph, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 32  THE STRANGER (anthropophobia)
const blurFace = () => tex('blurface', () => canvasTex(256, 256, (g, w, h) => {
  noiseFill(g, w, h, '#c8a890', ['#a8866e', '#e0c4ac']);
  g.filter = 'blur(9px)';
  g.fillStyle = '#3a2a20'; for (const x of [0.36, 0.64]) { g.beginPath(); g.ellipse(w * x, h * 0.42, w * 0.07, h * 0.04, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#7a4a3a'; g.beginPath(); g.ellipse(w * 0.5, h * 0.73, w * 0.1, h * 0.03, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(200,170,150,0.6)'; g.fillRect(0, h * 0.3, w, h * 0.5);
  g.filter = 'none';
}));

const COATS = ['#4a4a4e', '#3a3226', '#2e3a4d', '#5a5248', '#22252b'];

function buildStranger(rng) {
  const p = { ...HUMAN, headR: 0.112, hipH: rng ? rng.range(0.9, 1.0) : 0.95 };
  const rig = new Rig(p);
  const skin = humanSkin('strangerskin', '#c8a890');
  const col = rng ? rng.pick(COATS) : COATS[0];
  const ct = cloth('coat' + col, { base: col, dark: '#0a0a0a', stain: '#2a2620', weave: 70, stains: 0.3, wear: 0.3 });
  const coat = skinMat('#a8a8a8', { map: ct.map, bump: ct.bump, bumpScale: 1, rough: 0.9, side: THREE.DoubleSide });
  buildBody(rig, p, { skin, top: coat, bottom: coat, arms: coat, shoes: skinMat('#0e0c0a', { rough: 0.35 }), hands: skin }, { sleeve: true });
  headOn(rig, p, skin);
  face(rig, p, null, skinMat('#ffffff', { map: blurFace(), rough: 0.6 }));
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(p.headR * 1.05, p.headR * 0.7, p.headR * 1.12), { y: 0.05 + hl, z: -0.012 }), skinMat(rng ? rng.pick(['#1b130d', '#3d2a1a', '#6a6a6a', '#0c0c0c']) : '#1b130d', { rough: 0.9 }), { rigid: true });
  const hem = latheGeo([[-p.hipH * 0.62, 0.3], [-p.hipH * 0.3, 0.26], [0.0, 0.22], [0.08, 0.2]], 0.75, 18);
  const coatSkirt = rig.attach(rig.hips, hem, coat, { rigid: true });
  return result(rig, {
    kind: 'biped', height: 1.8, radius: 0.3, eyeY: 1.65, frozenPose: true,
    animate(st, dt) {
      st.stride = 1.35; st.armSwing = 0.5; st.grip = 0.4; st.tilt = st.staring ? 0.3 : 0;
      animateBiped(rig, st, dt);
      coatSkirt.rotation.x = Math.sin(st.phase) * 0.05 * clamp(st.speed, 0, 1);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.stranger = buildStranger;

// 32 --------------------------------------------------------------- THE STRANGER
D.stranger = {
  name: 'The Strangers', speed: 0, chase: 1.7, detect: 999, dmg: 0, reach: 0, cd: 1, memory: 999, xray: true, noAttack: true, statue: true, voice: 'murmur',
  num: 'Φ-32 · Anthropophobia', cls: 'Hostile in numbers', size: '1.8 m',
  desc: 'Ordinary people in grey coats with faces that will not come into focus, however close they get. There are always more of them than you counted.',
  notes: 'Watched, they stand still and stare. Unwatched, they walk toward you — never fast, never stopping. One alone is nothing. When three or more press in around you there is no air left.',
  tips: ['Keep them in front of you.', 'Never let them box you into a corner.', 'They cannot hurt you one at a time — the CROWD is what kills.'],
  sketch: [['head', 'will not focus'], ['chest', 'grey coat'], ['foot', 'always more of them']],
  observe(m, e, looked, d) { return looked > 0 && (e.lum > 0.02 || d < 6 || inBeam(m, e, looked, d)); },
  frame(m, e, dt, d) {
    e.st.staring = e.observed;
    if (e.observed) e.yaw = lerp(e.yaw, faceYaw(m, e), Math.min(1, dt * 3));
    // the crowd: three or more pressed in around you and there is no air
    if (m.list.find((o) => o.type === 'stranger' && !o.hidden) === e) {
      let n = 0;
      for (const o of m.list) if (o.type === 'stranger' && !o.hidden && o.dist < 2.3) n++;
      const pl = PL(m);
      if (n >= 3) { e.crowdT = (e.crowdT || 0) + dt; if (e.crowdT > 0.5) { e.crowdT = 0; pl.damage(4 + n * 2, null); m.game.hud.flash('There is no air. Push out!', 900); } pl.stamina = Math.max(0, pl.stamina - dt * 18); }
      if (ph(m)) ph(m).crowd = n;
    }
    e.threat = d < 4 ? 0.5 : 0;
    return null;
  },
  think(m, e) { if (!e.observed) chaseTo(m, e); },
};

})();
