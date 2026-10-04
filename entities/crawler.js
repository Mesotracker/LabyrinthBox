// =============================================================================
//  Crawler   (entity id: 'crawler')
//
//  One self-contained entity file:
//    - the three.js model builder
//    - its stats / field-guide entry
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { buildBody, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, animateSpider, ellipsoid, glowMat, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/** Crawler (Entity 96): grey, wrinkled, red-striped, impossibly long fingers. */
function buildCrawler() {
  const p = { ...HUMAN, hipH: 0.92, thigh: 0.46, shin: 0.42, spine: 0.22, chestH: 0.32, neck: 0.14, shoulderW: 0.36, upperArm: 0.4, foreArm: 0.42, chestW: 0.3, armR: 0.7, legR: 0.62, headR: 0.1 };
  const rig = new Rig(p);
  const t = organic('crawlskin', { base: '#6a6866', dark: '#454240', light: '#9e9b96', veins: 0.25, vein: '#5a2020', pores: 0.35, wrinkle: 0.85, wrinkleF: 110, mottle: 0.5 });
  const torsoT = organic('crawltorso', { base: '#6a6866', dark: '#454240', light: '#9e9b96', veins: 0.2, pores: 0.35, wrinkle: 0.8, wrinkleF: 110, stripes: 9, stripeV0: 0.1, extra: '#8a0e0e' });
  const skin = fleshMat(t, { rough: 0.38, bumpScale: 2.2 });
  const torso = fleshMat(torsoT, { rough: 0.38, bumpScale: 2.2 });
  buildBody(rig, p, { skin, top: torso, bottom: skin, shoes: skin, arms: skin }, { fingerLen: 0.24, fingerR: 0.7, claws: 0.05, footLen: 0.17, chestDepth: 0.55, ribs: true, clawMat: skinMat('#1d1a18', { rough: 0.3 }) });
  headOn(rig, p, skin, 0.95, 1.15, 1.05);
  const hl = headLift(p);
  const eye = glowMat('#ff1a0a');
  for (const x of [-0.035, 0.035]) rig.attach(rig.head, xf(ellipsoid(0.02, 0.014, 0.008), { x, y: hl + 0.035, z: 0.105 }), eye, { rigid: true, shadow: false });
  const jaw = new THREE.Bone(); jaw.position.set(0, hl - 0.04, 0.03); rig.head.add(jaw); rig.bones.push(jaw);
  rig.attach(jaw, xf(ellipsoid(0.06, 0.035, 0.075), { y: -0.02, z: 0.02 }), skin, { parent: null });
  const gash = skinMat('#1a0505', { rough: 0.3 });
  rig.attach(rig.head, xf(ellipsoid(0.055, 0.012, 0.01), { y: hl - 0.045, z: 0.1, rz: 0.25 }), gash, { rigid: true, shadow: false });
  const tooth = skinMat('#d8cfb0', { rough: 0.3 });
  const tl = [];
  for (let i = 0; i < 9; i++) tl.push(xf(new THREE.ConeGeometry(0.005, 0.022, 4), { x: -0.045 + i * 0.011, y: hl - 0.04 - (i % 2) * 0.006, z: 0.1, rx: Math.PI }));
  rig.attach(rig.head, merge(tl), tooth, { rigid: true, shadow: false });
  return result(rig, {
    kind: 'spider', height: 0.9, radius: 0.4, eyeY: 0.7,
    animate(st, dt) {
      st.twitch = st.chasing ? 1 : 0.3;
      if (st.standing) { st.lean = 0.3; st.hunch = 0.4; st.grip = 0.2; st.armsOut = 0.3; animateBiped(rig, st, dt); } else animateSpider(rig, st, dt);
      jaw.rotation.x = 0.1 + (st.chasing ? Math.abs(Math.sin(st.t * 13)) * 0.3 : 0.05) + (st.attack || 0) * 0.5;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.crawler = buildCrawler;

ENTITY_DEFS.crawler = { name: 'Crawler', speed: 1.4, chase: 6.4, detect: 14, dmg: 24, reach: 1.25, cd: 1.0, memory: 4, crawler: true, rare: true,
  num: 'Entity 96', cls: 'Hostile', size: '1.7 m (crawls at 0.9 m)',
  desc: 'Grey, wrinkled and oily, with red stripes running from its chest, red pupilless eyes and impossibly long fingers.',
  notes: 'Hunts in tight spaces. It shows itself at the edge of your vision again and again, scuttling away when looked at — then ambushes at terrifying speed.',
  tips: ['When it peeks, back toward open space.', 'Its sprint is short; break line of sight and it gives up.'] };
})();
