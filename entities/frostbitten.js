// =============================================================================
//  The Frostbitten   (entity id: 'frostbitten')
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
const { animateBiped, ellipsoid, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { eyeball, haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { D, hunt, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 37  THE FROSTBITTEN (chionophobia)
function buildFrostbitten() {
  const p = { ...HUMAN, chestW: 0.4, headR: 0.115 };
  const rig = new Rig(p);
  const skin = fleshMat(organic('frostskin', { base: '#9ab4c8', dark: '#4a6a8a', light: '#e0eef8', veins: 0.7, vein: '#2a3a6a', pores: 0.3, mottle: 0.6, tears: 0.3, extra: '#3a1a2a' }), { rough: 0.35, bumpScale: 1.4 });
  const pT = cloth('parka', { base: '#b8642a', dark: '#4a2a14', stain: '#6a6a7a', weave: 70, stains: 0.6, wear: 0.7 });
  const parka = skinMat('#c8d0d8', { map: pT.map, bump: pT.bump, bumpScale: 1.4, rough: 0.8 });
  const ice = skinMat('#d8eef8', { rough: 0.05, transparent: true, opacity: 0.8, metal: 0.1 });
  buildBody(rig, p, { skin, top: parka, bottom: parka, arms: parka, shoes: skinMat('#2a2a2a', { rough: 0.7 }), hands: skin }, { sleeve: true, belly: 1.15, chestDepth: 0.7 });
  headOn(rig, p, skin);
  const hl = headLift(p);
  for (const s of [-1, 1]) { const e = eyeball(0.02, '#c8d8e0', { milky: true }); e.position.set(s * 0.04, hl + 0.025, 0.102); rig.head.add(e); }
  // fur-lined hood up, icicles off the jaw and the sleeves
  rig.attach(rig.head, xf(new THREE.TorusGeometry(0.13, 0.04, 8, 20), { y: hl, z: 0.03, sy: 1.25 }), skinMat('#c8bca8', { rough: 1 }), { rigid: true });
  rig.attach(rig.head, xf(ellipsoid(0.15, 0.17, 0.16), { y: hl + 0.02, z: -0.03 }), parka, { rigid: true });
  const icicles = [];
  for (let i = 0; i < 9; i++) icicles.push(xf(new THREE.ConeGeometry(0.008, 0.06 + (i % 3) * 0.03, 5), { x: -0.05 + i * 0.012, y: hl - 0.1 - (i % 3) * 0.015, z: 0.08, rx: Math.PI }));
  rig.attach(rig.head, merge(icicles), ice, { rigid: true, shadow: false });
  for (const A of rig.arms) { const ic = []; for (let i = 0; i < 6; i++) ic.push(xf(new THREE.ConeGeometry(0.01, 0.08, 5), { x: Math.cos(i) * 0.05, y: -p.foreArm + 0.02, z: Math.sin(i) * 0.05, rx: Math.PI })); rig.attach(A.el, merge(ic), ice, { rigid: true, shadow: false }); }
  const breath = sprite(haloMat('#ffffff').map, 0xdde8f0, 0.4, 0); breath.position.set(0, hl - 0.04, 0.3); rig.head.add(breath);
  return result(rig, {
    kind: 'biped', height: 1.9, radius: 0.34, eyeY: 1.75,
    animate(st, dt) {
      st.lean = 0.2; st.hunch = 0.35; st.stride = 1.1; st.armSwing = 0.15; st.armsOut = 0.05; st.grip = 0.8; st.tilt = 0.2 + Math.sin(st.t * 8) * 0.01;
      animateBiped(rig, st, dt);
      const k = (st.t * 0.35) % 1;
      breath.material.opacity = Math.sin(k * Math.PI) * 0.35;
      breath.scale.setScalar(0.25 + k * 0.6);
      breath.position.z = 0.15 + k * 0.3;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.frostbitten = buildFrostbitten;

// 37 --------------------------------------------------------------- THE FROSTBITTEN
D.frostbitten = {
  name: 'The Frostbitten', speed: 0.7, chase: 1.6, detect: 10, dmg: 26, reach: 1.4, cd: 1.3, memory: 10, voice: 'shiver',
  num: 'Φ-37 · Chionophobia', cls: 'Hostile', size: '1.9 m',
  desc: 'A hiker who never made it home: parka frosted stiff, blue skin, icicles hanging from the jaw. Its breath still fogs.',
  notes: 'The cold has made it slow — until it feels warmth. It is drawn to heaters, to lamps, to the heat of a flashlight, and near warmth it thaws and moves terribly fast.',
  tips: ['Warming up near a heater is necessary — and it will come.', 'Flashlight off when one is near; it can feel the heat.', 'Keep your BODY HEAT up; freezing kills too.'],
  sketch: [['head', 'icicles'], ['chest', 'frozen parka'], ['foot', 'slow, until warm']],
  noiseMul(m) { const pl = PL(m); return (pl.flashlightOn ? 1.8 : 0.8) * (m.lum(pl.pos.x, pl.pos.z) > 0.15 ? 1.8 : 1); },
  speedFn(m, e, want) { const warm = m.lum(e.pos.x, e.pos.z) > 0.12 || (PL(m).flashlightOn && e.dist < 12); return warm ? want * 2.7 : want; },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
