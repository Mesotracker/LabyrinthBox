// =============================================================================
//  Whisperer   (entity id: 'whisperer')
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
const { buildBody, cloth, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, clamp, ellipsoid, latheGeo, lerp, poseHand, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * The Whisperer: a waxy, eyeless, impossibly thin figure under a grey shroud.
 * It floats a hand's width above the floor, toes pointed, hands held to the
 * mouth, and it never stops talking.
 */
function buildWhisperer() {
  const p = { ...HUMAN, hipH: 1.1, thigh: 0.5, shin: 0.5, spine: 0.24, chestH: 0.34, neck: 0.18, shoulderW: 0.34, upperArm: 0.36, foreArm: 0.36, chestW: 0.26, armR: 0.55, legR: 0.5, headR: 0.1 };
  const rig = new Rig(p);
  const t = organic('whisperskin', { base: '#d8d2c4', dark: '#a39a8c', light: '#f4f0e6', veins: 0.85, vein: '#5a6a8a', pores: 0.2, mottle: 0.35, wrinkle: 0.15 });
  const wax = fleshMat(t, { rough: 0.35, bumpScale: 1.0 });
  const veilT = cloth('veil', { base: '#7a776e', dark: '#3a3832', stain: '#2a2620', weave: 60, stains: 0.5, wear: 0.6 });
  const veil = skinMat('#b4b4b4', { map: veilT.map, bump: veilT.bump, bumpScale: 1.4, rough: 0.95, side: THREE.DoubleSide, transparent: true, alphaTest: 0.35 });
  buildBody(rig, p, { skin: wax, top: wax, bottom: wax, shoes: wax }, { fingerLen: 0.15, fingerR: 0.75, chestDepth: 0.5, neckR: 0.7, ribs: true, footLen: 0.24 });
  // elongated head: long cranium, sunken sockets, a mouth that moves
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(p.headR * 0.9, p.headR * 1.75, p.headR * 1.05, 22, 18), { y: hl + p.headR * 0.5, rx: -0.15 }), wax, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.025 });
  const sock = skinMat('#151010', { rough: 0.9 });
  for (const x of [-0.035, 0.035]) rig.attach(rig.head, xf(ellipsoid(0.024, 0.016, 0.012), { x, y: hl + 0.05, z: 0.088 }), sock, { rigid: true, shadow: false });
  const jaw = new THREE.Bone(); jaw.position.set(0, hl - 0.02, 0.02); rig.head.add(jaw); rig.bones.push(jaw);
  rig.attach(jaw, xf(ellipsoid(0.05, 0.05, 0.07), { y: -0.05, z: 0.02 }), wax, { parent: null });
  rig.attach(jaw, xf(ellipsoid(0.028, 0.008, 0.01), { y: -0.04, z: 0.085 }), sock, { rigid: true, shadow: false });
  // shroud: hood over the skull and a ragged drape from the shoulders
  const hood = latheGeo([[-0.2, 0.17], [0.0, 0.15], [0.15, 0.13], [0.28, 0.06], [0.3, 0.01]], 1, 20);
  hood.rotateX(-0.25); hood.translate(0, hl + 0.05, -0.04);
  const hoodM = rig.attach(rig.head, hood, veil, { rigid: true });
  hoodM.scale.set(1, 1, 1);
  const drapeG = latheGeo([[-1.15, 0.36], [-0.8, 0.3], [-0.4, 0.26], [0.0, 0.25], [0.25, 0.23], [0.35, 0.12]], 0.75, 26);
  const pa = drapeG.attributes.position, uv = drapeG.attributes.uv;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
    const a = Math.atan2(z, x);
    const k = 1 + Math.sin(a * 11) * 0.06 * clamp(-y, 0, 1);
    pa.setXYZ(i, x * k, y + (y < -0.9 ? Math.sin(a * 7) * 0.12 : 0), z * k);
    void uv;
  }
  drapeG.computeVertexNormals();
  const drape = rig.attach(rig.chest, xf(drapeG, { y: p.chestH - 0.05 }), veil, { rigid: true });
  return result(rig, {
    kind: 'biped', height: 2.1, radius: 0.3, eyeY: 1.95, float: 0.18,
    animate(st, dt) {
      st.lean = 0.08; st.hunch = 0.22; st.armSwing = 0; st.stride = 3.5; st.sway = 0.08;
      st.tilt = Math.sin(st.t * 0.5) * 0.35; st.grip = 0.35;
      const sp = st.speed; st.speed = sp * 0.15; // glide: barely walks
      animateBiped(rig, st, dt);
      st.speed = sp;
      const hover = (st.float ?? 0.18) + Math.sin(st.t * 1.1) * 0.05;
      rig.hips.position.y += hover;
      for (const L of rig.legs) {
        L.hip.rotation.x = Math.sin(st.t * 0.9 + L.side) * 0.08 - 0.05 - sp * 0.08;
        L.kn.rotation.x = 0.25 + Math.sin(st.t * 0.7 + L.side) * 0.08;
        L.an.rotation.x = 0.9; // toes pointed down
      }
      // hands raised to the mouth, fingers twitching
      const att = st.attack || 0;
      for (const A of rig.arms) {
        A.sh.rotation.x = lerp(-1.25, -1.6, att) + Math.sin(st.t * 1.7 + A.side) * 0.05;
        A.sh.rotation.z = A.side * lerp(0.35, 0.1, att);
        A.el.rotation.x = lerp(-2.0, -0.3, att);
        A.el.rotation.y = -A.side * 0.6;
        poseHand(A, att > 0 ? 0.1 : 0.4 + Math.sin(st.t * 7 + A.side * 2) * 0.12, 0.3, st.t * 4);
      }
      jaw.rotation.x = (st.talk ?? 1) * (0.06 + Math.abs(Math.sin(st.t * 11) * Math.sin(st.t * 3.7)) * 0.22) + att * 0.5;
      drape.rotation.x = -rig.spine.rotation.x * 0.3 + Math.sin(st.t * 0.8) * 0.04 + sp * 0.12;
      drape.rotation.z = Math.sin(st.t * 0.6) * 0.05;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.whisperer = buildWhisperer;

ENTITY_DEFS.whisperer = { name: 'Whisperer', speed: 1.0, chase: 2.6, detect: 30, dmg: 30, reach: 1.3, cd: 1.5, memory: 30, whisper: true, rare: true, xray: true,
  num: 'Rare · stalker', cls: 'Hostile', size: '2.1 m, floating',
  desc: 'An eyeless, waxy figure in a grey shroud that floats behind you and never stops whispering.',
  notes: 'Its hands are held to its moving mouth. It cannot bear being looked at — meet it and it fades, only to come back closer from behind. The whispering gets louder the nearer it is.',
  tips: ['When the whispers get loud, turn around.', 'Looking at it drives it off; it returns from wherever you are not looking.'] };
})();
