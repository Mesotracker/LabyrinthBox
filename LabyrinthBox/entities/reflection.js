// =============================================================================
//  Your Reflection   (entity id: 'reflection')
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
const { animateBiped, glowMat, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, headOn, HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { chaseTo, D, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 24  YOUR REFLECTION (eisoptrophobia)
function buildReflection() {
  const p = { ...HUMAN, headR: 0.112 };
  const rig = new Rig(p);
  const silver = skinMat('#b4bcc4', { metal: 1, rough: 0.08, emissive: '#1a2028', emissiveIntensity: 0.6 });
  const silverDark = skinMat('#6a727a', { metal: 1, rough: 0.15, emissive: '#0a0e12', emissiveIntensity: 0.5 });
  buildBody(rig, p, { skin: silver, top: silverDark, bottom: silverDark, shoes: silverDark }, { sleeve: true });
  headOn(rig, p, silver);
  // it holds a flashlight, like you; in the wrong hand
  const torch = new THREE.Group(); torch.position.set(0, -0.12, 0.02); rig.arms[1].wr.add(torch);
  torch.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.02, 0.025, 0.2, 10), { rx: Math.PI / 2, z: 0.06 }), silverDark));
  const lens = new THREE.Mesh(xf(new THREE.CircleGeometry(0.024, 12), { z: 0.161 }), glowMat('#fff6e0'));
  torch.add(lens);
  const halo = sprite(haloMat('#fff2d0').map, 0xfff2d0, 0.6, 0.6); halo.position.z = 0.18; halo.material.blending = THREE.AdditiveBlending; torch.add(halo);
  return result(rig, {
    kind: 'biped', height: 1.8, radius: 0.32, eyeY: 1.65, frozenPose: true,
    animate(st, dt) {
      st.stride = 1.35; st.grip = 0.6;
      animateBiped(rig, st, dt);
      const A = rig.arms[1];
      A.sh.rotation.x = -1.3; A.el.rotation.x = -0.25; A.sh.rotation.z = -0.15;
      lens.visible = halo.visible = st.torch !== false;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.reflection = buildReflection;

// 24 --------------------------------------------------------------- YOUR REFLECTION
D.reflection = {
  name: 'Your Reflection', speed: 0, chase: 0, detect: 999, dmg: 30, reach: 1.3, cd: 1.2, memory: 999, xray: true, voice: 'glass', freezePose: true,
  num: 'Φ-24 · Eisoptrophobia', cls: 'Hostile', size: 'your height exactly',
  desc: 'A silvered, faceless copy of you, holding a flashlight in the wrong hand. It stepped out of a mirror while you were not looking.',
  notes: 'It moves only when you do, at exactly your speed, always toward you. When you stop, it stops. Turning around costs nothing; walking does.',
  tips: ['Stand still and it stands still. Plan your route before you move.', 'Sprinting brings it on twice as fast.', 'Put walls between you before you walk.'],
  sketch: [['head', 'no face, just you'], ['hand', 'the wrong hand'], ['foot', 'moves when you move']],
  observe(m, e) { return (PL(m).walkSpeed || 0) < 0.25; },
  frame(m, e, dt, d) { e.st.torch = PL(m).flashlightOn; e.threat = d < 10 ? 0.6 : 0.1; return null; },
  speedFn(m, e) { return (PL(m).walkSpeed || 0) * 0.98; },
  think(m, e) { chaseTo(m, e); },
};

})();
