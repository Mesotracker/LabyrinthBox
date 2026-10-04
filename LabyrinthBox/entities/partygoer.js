// =============================================================================
//  Partygoer   (entity id: 'partygoer')
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
const THREE = __mod['vendor/three/build/three.module.js'];
const { buildBody, cloth, face, fleshMat, headLift, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, canvasTex, clamp, ellipsoid, latheGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

const partyFace = () => tex('party', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#e3bb21', ['#c79a12', '#f2d045', '#a77f0c']);
  g.fillStyle = '#0c0a08';
  for (const x of [0.34, 0.66]) { g.beginPath(); g.ellipse(w * x, h * 0.38, w * 0.06, h * 0.09, 0, 0, Math.PI * 2); g.fill(); }
  g.lineWidth = 16; g.lineCap = 'round'; g.strokeStyle = '#0c0a08';
  g.beginPath(); g.moveTo(w * 0.16, h * 0.52); g.quadraticCurveTo(w * 0.5, h * 0.95, w * 0.84, h * 0.52); g.stroke();
  g.strokeStyle = '#a3121a'; g.lineWidth = 7;
  g.beginPath(); g.moveTo(w * 0.2, h * 0.56); g.quadraticCurveTo(w * 0.5, h * 0.86, w * 0.8, h * 0.56); g.stroke();
  g.fillStyle = '#0c0a08';
  for (const x of [0.25, 0.42, 0.61, 0.77]) {
    const y0 = h * 0.62 + (x * 50 % 20), len = 30 + (x * 97 % 40);
    g.fillRect(w * x, y0, 6, len);
    g.beginPath(); g.arc(w * x + 3, y0 + len, 5, 0, Math.PI * 2); g.fill();
  }
}));


const hatTex = () => tex('hat', () => canvasTex(256, 256, (g, w, h) => {
  const cols = ['#d42a5a', '#2a7fd4', '#f2c230', '#2ec26b'];
  for (let i = 0; i < 8; i++) { g.fillStyle = cols[i % 4]; g.fillRect(i * w / 8, 0, w / 8 + 1, h); }
  g.fillStyle = '#fff';
  for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 4, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 0.25; g.fillStyle = '#000';
  for (let i = 0; i < 25; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 8 + Math.random() * 14, 0, Math.PI * 2); g.fill(); }
  g.globalAlpha = 1;
}));


function buildPartygoer() {
  const p = { ...HUMAN, chestW: 0.38, headR: 0.125 };
  const rig = new Rig(p);
  const skinT = organic('pgskin', { base: '#d9b11c', dark: '#a8850f', light: '#f0cf48', veins: 0.05, pores: 0.25, mottle: 0.4 });
  const yellow = fleshMat(skinT, { rough: 0.45, bumpScale: 0.6 });
  const robeT = cloth('robe', { base: '#cdbb7a', dark: '#8e7f4d', stain: '#5e4a2a', weave: 70, stains: 0.6 });
  const robe = skinMat('#b0b0b0', { map: robeT.map, bump: robeT.bump, bumpScale: 1.5, rough: 0.92, side: THREE.DoubleSide });
  buildBody(rig, p, { skin: yellow, top: robe, bottom: yellow, shoes: yellow }, { sleeve: true });
  headOn(rig, p, yellow);
  face(rig, p, null, skinMat('#ffffff', { map: partyFace(), rough: 0.6 }));
  const robeG = latheGeo([[-p.hipH + 0.12, 0.44], [-p.hipH * 0.75, 0.38], [-p.hipH * 0.5, 0.31], [-0.3, 0.25], [0.0, 0.2], [0.12, 0.18]], 0.85, 22);
  // folds: ripple the hem radially
  const pa = robeG.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
    const a = Math.atan2(z, x), k = 1 + Math.sin(a * 9) * 0.05 * clamp(-y / p.hipH, 0, 1);
    pa.setXYZ(i, x * k, y, z * k);
  }
  robeG.computeVertexNormals();
  const robeMesh = rig.attach(rig.hips, robeG, robe, { rigid: true });
  for (const A of rig.arms) rig.attach(A.el, xf(new THREE.CylinderGeometry(0.06, 0.11, 0.26, 14, 1, true), { y: -0.14 }), robe, { parent: A.sh, child: A.wr, bw: 0.04 });
  const hat = skinMat('#ffffff', { map: hatTex(), rough: 0.5 });
  rig.attach(rig.head, xf(new THREE.ConeGeometry(0.07, 0.24, 16), { y: p.headR * 1.25 + headLift(p), rz: 0.15 }), hat, { rigid: true });
  rig.attach(rig.head, xf(ellipsoid(0.025, 0.025, 0.025), { y: p.headR * 1.25 + 0.12 + headLift(p), x: -0.018 }), skinMat('#e83a6a'), { rigid: true });
  return result(rig, {
    kind: 'biped', height: 1.95, radius: 0.36, eyeY: 1.7,
    animate(st, dt) {
      st.armsOut = st.chasing ? 0.35 : 0.05;
      st.grip = st.chasing ? -0.1 : 0.3;
      animateBiped(rig, st, dt);
      robeMesh.rotation.x = -rig.spine.rotation.x * 0.3 + Math.sin(st.phase) * 0.05 * clamp(st.speed, 0, 1);
      robeMesh.rotation.z = Math.cos(st.phase) * 0.06 * clamp(st.speed, 0, 1);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.partygoer = buildPartygoer;

ENTITY_DEFS.partygoer = { name: 'Partygoer', speed: 1.1, chase: 3.3, detect: 13, dmg: 22, reach: 1.35, cd: 1.2, memory: 6,
  num: 'Entity 67', cls: 'Hostile', size: '1.9 m',
  desc: 'Yellow, robed, with a smile painted on. It wants you to stay at the party. Forever.',
  notes: 'Waxy yellow skin, a stained ceremonial robe and a striped party hat. Calm until provoked, then the whole party hunts together and they do not tire.',
  tips: ['Do not touch the cake until you know where the exit is.', 'They are fast once enraged — use doorways to break line of sight.'] };
})();
