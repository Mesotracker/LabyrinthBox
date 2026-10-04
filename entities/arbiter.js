// =============================================================================
//  The Arbiter   (entity id: 'arbiter')
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
const { animateBiped, clamp, latheGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, hunt, ph, PL, place, spotAround } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 27  THE ARBITER (decidophobia)
function buildArbiter() {
  const p = { ...HUMAN, hipH: 1.1, chestW: 0.36, headR: 0.12, shoulderW: 0.44 };
  const rig = new Rig(p);
  const rT = cloth('robeRed', { base: '#5a0e12', dark: '#1a0204', stain: '#2a1008', weave: 120, stains: 0.3, wear: 0.3 });
  const robe = skinMat('#b0b0b0', { map: rT.map, bump: rT.bump, bumpScale: 1.2, rough: 0.85, side: THREE.DoubleSide });
  const gold = skinMat('#c8a040', { metal: 1, rough: 0.25 });
  const skin = fleshMat(organic('arbskin', { base: '#3a3030', dark: '#1a1414', veins: 0.2 }), { rough: 0.6 });
  buildBody(rig, p, { skin, top: robe, bottom: robe, arms: robe, shoes: robe, hands: gold }, { sleeve: true, fingerLen: 0.12 });
  headOn(rig, p, skin);
  const hl = headLift(p);
  rig.attach(rig.head, xf(new THREE.SphereGeometry(0.13, 22, 16, Math.PI / 2 - 1.0, 2.0, 0.15, 2.5), { y: hl + 0.01, z: 0.01 }), gold, { rigid: true });
  rig.attach(rig.head, xf(new THREE.BoxGeometry(0.1, 0.004, 0.01), { y: hl + 0.03, z: 0.128 }), skinMat('#1a1206', { rough: 0.5 }), { rigid: true, shadow: false });
  const hood = latheGeo([[-0.18, 0.18], [0.0, 0.16], [0.16, 0.13], [0.28, 0.05], [0.3, 0.01]], 1, 20); hood.rotateX(-0.2); hood.translate(0, hl + 0.02, -0.05);
  rig.attach(rig.head, hood, robe, { rigid: true });
  const skirt = latheGeo([[-p.hipH - 0.05, 0.42], [-p.hipH * 0.5, 0.32], [0.0, 0.24], [0.12, 0.22]], 0.8, 22);
  const sk = rig.attach(rig.hips, skirt, robe, { rigid: true });
  // the scales: a beam from the right hand, two pans on chains
  const scale = new THREE.Group(); scale.position.set(0, -0.1, 0.05); rig.arms[0].wr.add(scale);
  scale.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.008, 0.008, 0.45, 6), { y: 0.2 }), gold));
  const beam = new THREE.Group(); beam.position.y = 0.42; scale.add(beam);
  beam.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.008, 0.008, 0.6, 6), { rz: Math.PI / 2 }), gold));
  const pans = [];
  for (const s of [-1, 1]) {
    const hang = new THREE.Group(); hang.position.x = s * 0.3; beam.add(hang);
    for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2; hang.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 0.08, -0.28, Math.sin(a) * 0.08)), 1, 0.002, 3), gold)); }
    hang.add(new THREE.Mesh(xf(new THREE.SphereGeometry(0.1, 16, 6, 0, Math.PI * 2, Math.PI * 0.6, Math.PI * 0.4), { y: -0.2 }), gold));
    pans.push(hang);
  }
  return result(rig, {
    kind: 'biped', height: 2.15, radius: 0.36, eyeY: 2.0, float: 0.1,
    animate(st, dt) {
      st.stride = 2.5; st.lean = 0.05; st.hunch = 0.1; st.armSwing = 0.05; st.grip = 0.8;
      const sp = st.speed; st.speed = sp * 0.2; animateBiped(rig, st, dt); st.speed = sp;
      rig.hips.position.y += 0.12 + Math.sin(st.t * 0.9) * 0.04;
      const A = rig.arms[0]; A.sh.rotation.x = -0.7; A.el.rotation.x = -0.9; A.sh.rotation.z = 0.2;
      const tilt = Math.sin(st.t * 0.7) * 0.35 * (1 + (st.weigh || 0) * 2);
      beam.rotation.z = tilt;
      for (const pn of pans) pn.rotation.z = -tilt;
      sk.rotation.x = Math.sin(st.t * 0.6) * 0.04 + sp * 0.06;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.arbiter = buildArbiter;

// 27 --------------------------------------------------------------- THE ARBITER
D.arbiter = {
  name: 'The Arbiter', speed: 1.0, chase: 4.4, detect: 999, dmg: 34, reach: 1.5, cd: 1.2, memory: 999, xray: true, fade: true, noclip: true, voice: 'gong', noLeash: true,
  num: 'Φ-27 · Decidophobia', cls: 'Lethal', size: '2.15 m, floating',
  desc: 'A robed figure in a smooth gold mask, holding a set of scales that never stops tipping.',
  notes: 'It feeds on hesitation. Every second you stand still, double back or dither in front of a choice weighs on the scales. When they tip all the way, it is behind you.',
  tips: ['Decide. A wrong door costs less than standing still.', 'Keep moving forward — the INDECISION meter only drains when you make progress.', 'When it comes, it leaves again if you outlast it.'],
  sketch: [['head', 'gold mask'], ['hand', 'the scales'], ['foot', 'never touches the floor']],
  init(m, e) { e.mode = 'wait'; e.alpha = 0; e.alphaWant = 0; e.invisible = true; },
  frame(m, e, dt, d) {
    const p = ph(m);
    e.st.weigh = p ? p.meterValue('indecision') : 0;
    if (e.mode === 'wait') {
      e.invisible = true; e.alphaWant = 0;
      if (p && p.meterValue('indecision') >= 1) {
        p.setMeter('indecision', 0.35);
        const s = spotAround(m, -1, 4, 7, false, 0.6);
        if (s) place(m, e, s[0], s[1]);
        e.mode = 'hunt'; e.modeT = 0; e.invisible = false; e.alpha = 0; m.alert(e); m.game.hud.flash('The scales have tipped.', 2000);
      }
      return 'static';
    }
    e.modeT += dt; e.alphaWant = 1;
    if (e.modeT > 14) { e.mode = 'wait'; e.state = 'wander'; }
    e.threat = clamp(1 - d / 15, 0, 1);
    return null;
  },
  think(m, e) { if (e.mode === 'hunt') { chaseTo(m, e); e.path = [[PL(m).pos.x, PL(m).pos.z]]; } },
};

})();
