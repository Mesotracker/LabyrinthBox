// =============================================================================
//  The Phlebotomist   (entity id: 'phlebotomist')
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
const { eyeball } = __mod['src/phobia/models_a.js'];
const { animateBiped, ellipsoid, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, ph } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 11  THE PHLEBOTOMIST (aichmophobia)
function buildPhlebotomist() {
  const p = { ...HUMAN, hipH: 1.2, thigh: 0.58, shin: 0.56, spine: 0.25, chestH: 0.38, neck: 0.17, shoulderW: 0.38, upperArm: 0.44, foreArm: 0.44, chestW: 0.28, armR: 0.6, legR: 0.55, headR: 0.11 };
  const rig = new Rig(p);
  const t = organic('phlebo', { base: '#cfc4b8', dark: '#8a7a70', light: '#efe6dc', veins: 0.9, vein: '#4a3a6a', pores: 0.3, mottle: 0.5 });
  const skin = fleshMat(t, { rough: 0.5, bumpScale: 1.2 });
  const gT = cloth('scrubs', { base: '#8aa89a', dark: '#4a5a52', stain: '#5a1a14', weave: 110, stains: 0.75, wear: 0.4 });
  const gown = skinMat('#b8b8b8', { map: gT.map, bump: gT.bump, bumpScale: 1.0, rough: 0.9, side: THREE.DoubleSide });
  buildBody(rig, p, { skin, top: gown, bottom: gown, shoes: skinMat('#c8d8d0', { rough: 0.8 }) }, { sleeve: true, fingerLen: 0.03, handScale: 0.9, chestDepth: 0.52, neckR: 0.75 });
  headOn(rig, p, skin, 0.95, 1.25, 1.05);
  const hl = headLift(p);
  // surgical cap and mask; above it two pinprick pupils
  rig.attach(rig.head, xf(ellipsoid(p.headR * 1.06, p.headR * 0.7, p.headR * 1.1), { y: hl + 0.05 }), gown, { rigid: true });
  rig.attach(rig.head, xf(new THREE.SphereGeometry(p.headR * 1.05, 18, 10, Math.PI / 2 - 0.9, 1.8, Math.PI * 0.5, 0.65), { y: hl }), skinMat('#a8c4b8', { rough: 0.9 }), { rigid: true });
  for (const s of [-1, 1]) { const e = eyeball(0.017, '#202020'); e.position.set(s * 0.04, hl + 0.035, p.headR * 0.93); rig.head.add(e); }
  // ten needles for fingers, long and bright
  const needleM = skinMat('#d8dce0', { metal: 1, rough: 0.12 });
  const barrelM = skinMat('#e8f0f0', { rough: 0.1, transparent: true, opacity: 0.6 });
  const blood = skinMat('#5a0608', { rough: 0.2 });
  for (const A of rig.arms) {
    const hand = new THREE.Group(); hand.position.y = -0.05; A.wr.add(hand);
    for (let i = 0; i < 5; i++) {
      const a = (i / 4 - 0.5) * 0.7;
      const n = new THREE.Group(); n.rotation.set(0.1, 0, a * A.side); hand.add(n);
      n.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 8), { y: -0.05 }), barrelM));
      n.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 6), { y: -0.04 }), blood));
      n.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.0015, 0.0025, 0.32, 5), { y: -0.25 }), needleM));
    }
  }
  // an IV bag on a pole growing out of its spine, the line running into its neck
  const pole = new THREE.Group(); pole.position.set(0.06, 0.1, -0.16); rig.chest.add(pole);
  pole.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 6), { y: 0.45 }), needleM));
  const bag = new THREE.Mesh(xf(new THREE.BoxGeometry(0.12, 0.18, 0.04), { y: 0.82 }), skinMat('#7a0a10', { rough: 0.2, transparent: true, opacity: 0.85 }));
  pole.add(bag);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.72, 0), new THREE.Vector3(-0.05, 0.4, 0.05), new THREE.Vector3(-0.08, 0.35, 0.12), new THREE.Vector3(-0.06, 0.32, 0.17)]), 12, 0.006, 5), skinMat('#8a1a20', { rough: 0.3 }));
  pole.add(tube);
  return result(rig, {
    kind: 'biped', height: 2.25, radius: 0.3, eyeY: 2.05,
    animate(st, dt) {
      st.lean = 0.12; st.hunch = 0.15; st.stride = 1.8; st.armSwing = 0.3; st.grip = -0.1; st.armsOut = st.chasing ? 0.45 : 0.1;
      st.tilt = Math.sin(st.t * 0.4) * 0.2;
      animateBiped(rig, st, dt);
      if (st.chasing) for (const A of rig.arms) { A.sh.rotation.x = -0.9 + Math.sin(st.t * 3 + A.side) * 0.15; A.el.rotation.x = -0.6; }
      bag.rotation.z = Math.sin(st.t * 1.4) * 0.2;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.phlebotomist = buildPhlebotomist;

// 11 --------------------------------------------------------------- THE PHLEBOTOMIST
D.phlebotomist = {
  name: 'The Phlebotomist', speed: 1.1, chase: 3.7, detect: 12, dmg: 16, reach: 1.7, cd: 0.9, memory: 8, voice: 'clink',
  num: 'Φ-11 · Aichmophobia', cls: 'Hostile', size: '2.25 m',
  desc: 'Tall, thin, in stained scrubs and a surgical mask. Ten long needles where its fingers should be, and a bag of someone\'s blood on a pole growing out of its back.',
  notes: 'Its needles do not do much damage going in. It is what they leave behind: every puncture bleeds until you drink. The halls it walks are littered with used syringes.',
  tips: ['Drink almond water to stop the bleeding.', 'Crouch-walk over syringes on the floor — standing on them hurts.', 'It is only a little faster than you; do not let a bleed slow you into it.'],
  sketch: [['head', 'cap and mask'], ['hand', 'needles for fingers'], ['chest', 'IV line into its neck']],
  onHit(m) { if (ph(m)) ph(m).addBleed(7, 2.4); },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
