// =============================================================================
//  Faceling   (entity id: 'faceling')
//
//  One self-contained entity file:
//    - the three.js model builder and its private textures/helpers
//    - its stats / field-guide entry
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const { buildBody, cloth, face, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, ellipsoid, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

const SHIRTS = ['#4a5a78', '#7a3b33', '#d8d4c8', '#3c5b44', '#6b6b6b', '#8a7a4a'];

function buildFaceling(rng) {
  const p = { ...HUMAN, headR: 0.112 };
  const rig = new Rig(p);
  const skinC = rng.pick(['#c9a68a', '#a97c5f', '#e0bfa5', '#7b5741']);
  const st = organic('face' + skinC, { base: skinC, dark: '#6a4a3a', light: '#f0d8c8', veins: 0.1, pores: 0.35, mottle: 0.25 });
  const skin = fleshMat(st, { rough: 0.55, bumpScale: 0.6 });
  const shirtC = rng.pick(SHIRTS);
  const sT = cloth('shirt' + shirtC, { base: shirtC, dark: '#202020', stain: '#3a3026', weave: 110, stains: 0.35 });
  const shirt = skinMat('#b0b0b0', { map: sT.map, bump: sT.bump, bumpScale: 0.8, rough: 0.85 });
  const pantsC = rng.pick(['#23252b', '#3b3226', '#2e3a4d']);
  const pT = cloth('pants' + pantsC, { base: pantsC, dark: '#101010', twill: '#5a6680', weave: 80, stains: 0.25, wear: 0.4 });
  const pants = skinMat('#a8a8a8', { map: pT.map, bump: pT.bump, bumpScale: 1.0, rough: 0.9 });
  const shoes = skinMat('#1a1714', { rough: 0.4 });
  buildBody(rig, p, { skin, top: shirt, bottom: pants, shoes }, { sleeve: true });
  headOn(rig, p, skin);
  const hl = headLift(p);
  // a smooth, featureless face: brow ridge and the ghost of a nose under the skin
  rig.attach(rig.head, xf(ellipsoid(0.02, 0.03, 0.02), { y: -0.01 + hl, z: 0.115 }), skin, { rigid: true });
  rig.attach(rig.head, xf(ellipsoid(0.08, 0.02, 0.03), { y: 0.035 + hl, z: 0.1 }), skin, { rigid: true });
  rig.attach(rig.head, xf(ellipsoid(p.headR * 1.05, p.headR * 0.72, p.headR * 1.12), { y: 0.05 + hl, z: -0.012 }), skinMat(rng.pick(['#1b130d', '#3d2a1a', '#8a7a62', '#0c0c0c']), { rough: 0.9 }), { rigid: true });
  return result(rig, {
    kind: 'biped', height: 1.8, radius: 0.32, eyeY: 1.65,
    animate(stt, dt) { stt.stride = 1.35; animateBiped(rig, stt, dt); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.faceling = buildFaceling;

ENTITY_DEFS.faceling = { name: 'Faceling', speed: 1.0, chase: 0, detect: 0, dmg: 0, reach: 0, cd: 1, memory: 0, passive: true,
  num: 'Entity 5', cls: 'Passive', size: '1.8 m',
  desc: 'People without faces, going about business nobody remembers. Mostly harmless. Mostly.',
  notes: 'Ordinary clothes, ordinary bodies, and smooth skin where a face should be. They ignore wanderers who ignore them.',
  tips: ['Leave them alone.'] };
})();
