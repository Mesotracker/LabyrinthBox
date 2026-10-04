// =============================================================================
//  The Thornbound   (entity id: 'thorn')
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
const { animateBiped, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { eyeball } = __mod['src/phobia/models_a.js'];
const { D, hunt, ph, place } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 29  THE THORNBOUND (algophobia)
function wireGeo(len, r, turns, spikes) {
  const pts = [];
  for (let i = 0; i <= turns * 12; i++) { const a = i / 12 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, -i / (turns * 12) * len, Math.sin(a) * r)); }
  const parts = [new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 16, 0.0035, 4)];
  for (let i = 0; i < spikes; i++) {
    const a = i * 2.3, y = -i / spikes * len;
    parts.push(xf(new THREE.ConeGeometry(0.004, 0.035, 4), { x: Math.cos(a) * (r + 0.012), y, z: Math.sin(a) * (r + 0.012), rz: -Math.cos(a) * 1.57, rx: Math.sin(a) * 1.57 }));
  }
  return merge(parts);
}


function buildThorn() {
  const p = { ...HUMAN, hipH: 1.05, chestW: 0.34, armR: 0.8, legR: 0.8, headR: 0.115 };
  const rig = new Rig(p);
  const t = organic('rawskin', { base: '#8a3a32', dark: '#4a1210', light: '#c06a5a', veins: 0.9, vein: '#3a0a10', pores: 0.5, wrinkle: 0.5, mottle: 0.8, tears: 0.6, extra: '#6a0a10' });
  const skin = fleshMat(t, { rough: 0.3, bumpScale: 2.2 });
  const wire = skinMat('#5a5048', { metal: 1, rough: 0.55 });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.09, chestDepth: 0.58, ribs: true });
  headOn(rig, p, skin);
  const hl = headLift(p);
  // coils of barbed wire everywhere, and the head wrapped up entirely but for one eye
  for (const A of rig.arms) { rig.attach(A.sh, wireGeo(p.upperArm, 0.055, 5, 18), wire, { rigid: true }); rig.attach(A.el, wireGeo(p.foreArm, 0.042, 5, 16), wire, { rigid: true }); }
  for (const L of rig.legs) { rig.attach(L.hip, wireGeo(p.thigh, 0.09, 5, 20), wire, { rigid: true }); rig.attach(L.kn, wireGeo(p.shin, 0.062, 5, 18), wire, { rigid: true }); }
  rig.attach(rig.chest, xf(wireGeo(p.chestH + 0.1, 0.19, 7, 34), { y: p.chestH + 0.05 }), wire, { rigid: true });
  rig.attach(rig.head, xf(wireGeo(0.24, 0.125, 9, 30), { y: hl + 0.12 }), wire, { rigid: true });
  const e = eyeball(0.022, '#3a1a10'); e.position.set(0.035, hl + 0.03, 0.1); rig.head.add(e);
  return result(rig, {
    kind: 'biped', height: 2.0, radius: 0.33, eyeY: 1.85,
    animate(st, dt) {
      st.lean = 0.1; st.hunch = 0.2; st.stride = 1.3; st.armSwing = 0.6; st.grip = 0.9; st.tilt = 0.2 + Math.sin(st.t * 9) * 0.02;
      animateBiped(rig, st, dt);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.thorn = buildThorn;

// 29 --------------------------------------------------------------- THE THORNBOUND
D.thorn = {
  name: 'The Thornbound', speed: 1.1, chase: 3.4, detect: 11, dmg: 22, reach: 1.5, cd: 1.1, memory: 8, voice: 'wire',
  num: 'Φ-29 · Algophobia', cls: 'Hostile', size: '2.0 m',
  desc: 'A flayed body wound tight in coils of barbed wire from feet to crown, one eye looking out between the strands.',
  notes: 'Everything in this place hurts more than it should, and the pain lingers. Its touch is worst of all: the wire stays in.',
  tips: ['Do not trade hits: every wound keeps bleeding.', 'Drink to stop the pain.', 'Keep your distance — the wire reaches further than its arms.'],
  sketch: [['head', 'wrapped, one eye'], ['chest', 'barbed wire'], ['hand', 'raw skin']],
  onHit(m) { if (ph(m)) ph(m).addBleed(8, 2.8, 'pain'); },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
