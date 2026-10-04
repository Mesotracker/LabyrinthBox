// =============================================================================
//  The Bleeder   (entity id: 'bleeder')
//
//  One self-contained entity file:
//    - the three.js model builder
//    - its stats / field-guide entry and AI hooks
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateBiped, canvasTex, ellipsoid, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, face, fleshMat, headLift, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, ph } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 38  THE BLEEDER (hemophobia)
function buildBleeder() {
  const p = { ...HUMAN, headR: 0.112, chestW: 0.32 };
  const rig = new Rig(p);
  const skin = fleshMat(organic('bloodskin', { base: '#c8b0a8', dark: '#6a1a18', light: '#e8d8d0', veins: 0.6, vein: '#5a1a2a', drips: 1, mottle: 0.6, stripes: 14, stripeV0: 0.0, extra: '#7a0808' }), { rough: 0.3, bumpScale: 1 });
  const gT = cloth('bloodgown', { base: '#c8ccc4', dark: '#6a6a60', stain: '#6a0606', weave: 90, stains: 1, wear: 0.4 });
  const gown = skinMat('#b8b8b8', { map: gT.map, bump: gT.bump, bumpScale: 1, rough: 0.6, side: THREE.DoubleSide });
  buildBody(rig, p, { skin, top: gown, bottom: skin, shoes: skin }, { sleeve: true, chestDepth: 0.55 });
  headOn(rig, p, skin);
  const fT = tex('bloodface', () => canvasTex(512, 512, (g, w, h) => {
    noiseFill(g, w, h, '#b89a90', ['#6a1a14', '#d8bcb0']);
    for (const x of [0.35, 0.65]) { g.fillStyle = '#1a0202'; g.beginPath(); g.ellipse(w * x, h * 0.42, w * 0.06, h * 0.04, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#6a0404'; g.fillRect(w * x - 8, h * 0.44, 16, h * 0.5); }
    g.fillStyle = '#3a0202'; g.beginPath(); g.ellipse(w * 0.5, h * 0.74, w * 0.1, h * 0.06, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7a0606'; g.fillRect(w * 0.42, h * 0.74, w * 0.16, h * 0.3);
  }));
  face(rig, p, null, skinMat('#ffffff', { map: fT, rough: 0.25 }));
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(p.headR * 1.06, p.headR * 0.7, p.headR * 1.12), { y: hl + 0.05, z: -0.015 }), skinMat('#1a0a06', { rough: 0.6 }), { rigid: true });
  return result(rig, {
    kind: 'biped', height: 1.8, radius: 0.3, eyeY: 1.65, bleeds: true,
    animate(st, dt) {
      st.lean = 0.2; st.hunch = 0.25; st.stride = 1.25; st.armSwing = 0.5; st.grip = 0.6; st.tilt = 0.3;
      animateBiped(rig, st, dt);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.bleeder = buildBleeder;

// 38 --------------------------------------------------------------- THE BLEEDER
D.bleeder = {
  name: 'The Bleeder', speed: 1.0, chase: 3.5, detect: 12, dmg: 22, reach: 1.4, cd: 1.1, memory: 9, voice: 'drip',
  num: 'Φ-38 · Hemophobia', cls: 'Hostile', size: '1.8 m',
  desc: 'A patient in a soaked gown, blood running from its eyes, its mouth, everywhere, without end. You will see the trail before you see it.',
  notes: 'It leaves a trail of fresh blood wherever it walks — the trail is how you know where it has been, and which way it went. Its touch opens wounds that keep running.',
  tips: ['Fresh blood means it was just here.', 'Drink to close your wounds.', 'Follow its trail backwards, never forwards.'],
  sketch: [['head', 'bleeding from the eyes'], ['chest', 'soaked gown'], ['foot', 'leaves a trail']],
  frame(m, e, dt, d) {
    e.dripT = (e.dripT || 0) - dt;
    if (e.dripT <= 0 && d < 40) { e.dripT = 0.12; m.fx.emit(e.pos.x + (Math.random() - 0.5) * 0.3, 1.0 + Math.random() * 0.6, e.pos.z + (Math.random() - 0.5) * 0.3, 0, -0.5, 0, 1.2, 0.35, 0.02, 0.02, 9); }
    e.trailT = (e.trailT || 0) - dt;
    if (e.trailT <= 0 && e.speed > 0.3 && ph(m)) { e.trailT = 0.55; ph(m).bloodDecal(e.pos.x, e.pos.z); }
    return null;
  },
  onHit(m) { if (ph(m)) ph(m).addBleed(9, 2.4); },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
