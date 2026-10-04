// =============================================================================
//  Window   (entity id: 'window')
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
const { buildBody, fleshMat, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, clamp, glowMat, lerp, poseHand, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * Window (Entity 2): an ordinary window. Behind the glass stands a Window
 * Shadow - extremely long hands, small torso, deformed legs - beckoning.
 * When a wanderer comes close, the arms come through.
 */
function buildWindow() {
  const p = { ...HUMAN, hipH: 0.7, thigh: 0.32, shin: 0.4, spine: 0.14, chestH: 0.22, neck: 0.12, shoulderW: 0.3, upperArm: 0.7, foreArm: 0.75, chestW: 0.2, armR: 0.5, legR: 0.55, headR: 0.1 };
  const rig = new Rig(p);
  const shadowT = organic('winshadow', { base: '#0c0c10', dark: '#000000', light: '#1c1c22', veins: 0.1, wrinkle: 0.4 });
  const shade = fleshMat(shadowT, { rough: 0.9, tint: '#202024' });
  buildBody(rig, p, { skin: shade, top: shade, bottom: shade, shoes: shade }, { fingerLen: 0.22, fingerR: 0.6, fingerVar: true });
  headOn(rig, p, shade, 0.95, 1.25, 1.0);
  // frame and glass, fixed in the wall at the entity's origin, shadow standing behind
  const frame = new THREE.Group(); rig.root.add(frame);
  const wood = skinMat('#5a4632', { rough: 0.7 });
  const addF = (g, m) => { const me = new THREE.Mesh(g, m); frame.add(me); return me; };
  for (const [x, y, w, h] of [[0, 0.85, 1.3, 0.08], [0, 2.25, 1.3, 0.08], [-0.61, 1.55, 0.08, 1.48], [0.61, 1.55, 0.08, 1.48], [0, 1.55, 0.05, 1.4], [0, 1.55, 1.2, 0.04]]) addF(xf(new THREE.BoxGeometry(w, h, 0.12), { x, y, z: 0.05 }), wood);
  addF(xf(new THREE.BoxGeometry(1.4, 0.05, 0.25), { y: 0.82, z: 0.12 }), wood);
  const glass = skinMat('#9aa6aa', { rough: 0.05, transparent: true, opacity: 0.32, depthWrite: false });
  const pane = addF(xf(new THREE.PlaneGeometry(1.16, 1.36), { y: 1.55, z: 0.06 }), glass);
  const backing = addF(xf(new THREE.PlaneGeometry(1.2, 1.42), { y: 1.55, z: -1.35 }), glowMat('#7a6a54'));
  const curtain = skinMat('#5a2c2c', { rough: 0.95, side: THREE.DoubleSide });
  const curtains = [-1, 1].map((s) => { const c = addF(xf(new THREE.PlaneGeometry(0.4, 1.38, 6, 1), { x: s * 0.38, y: 1.55, z: -0.05 }), curtain); return c; });
  void backing;
  return result(rig, {
    kind: 'window', height: 2.3, radius: 0.5, eyeY: 1.6, staticModel: true, pane,
    animate(st, dt) {
      st.t += dt;
      const reach = clamp(st.reach || 0, 0, 1);
      // the shadow stands back from the glass, beckoning; then lunges through it
      rig.root.updateMatrixWorld();
      rig.body.position.z = -0.7 + reach * 0.75;
      st.speed = 0; st.lean = 0.2 + reach * 0.4; st.hunch = 0.3; st.grip = 0.2;
      animateBiped(rig, st, dt);
      rig.body.position.z = -1.05 + reach * 1.0; // well back in the dark room until it lunges
      for (const A of rig.arms) {
        const beckon = Math.sin(st.t * 2.2 + A.side) * 0.5 + 0.5;
        A.sh.rotation.x = lerp(-0.2 - beckon * 0.25 * (A.side > 0 ? 1 : 0), -1.6, reach);
        A.el.rotation.x = lerp(-0.8 + beckon * 0.5 * (A.side > 0 ? 1 : 0), -0.05, reach);
        poseHand(A, lerp(0.4 + beckon * 0.5, (st.attack || 0) > 0.3 ? 1 : -0.1, reach), reach, st.t);
      }
      for (const c of curtains) c.position.x = Math.sign(c.position.x) * (0.38 + reach * 0.15);
      pane.visible = !st.broken;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.window = buildWindow;

ENTITY_DEFS.window = { name: 'Window', speed: 0, chase: 0, detect: 2.4, dmg: 22, reach: 2.3, cd: 4, memory: 1, static: true,
  num: 'Entity 2', cls: 'Hostile', size: '1.2 m pane; shadow ~1.9 m',
  desc: 'An ordinary-looking window. Behind the glass stands a Window Shadow with extremely long hands, a small torso and deformed legs, beckoning.',
  notes: 'Predatory Windows grab passers-by, shatter outward and drag them toward the room behind the glass. Some windows are innocuous: their shadows only watch, and flee when approached. They are thought to speak in an incomprehensible, "feminine and charming" voice.',
  tips: ['Do not walk close along walls of windows.', 'A beckoning shadow is a predatory one.', 'Groups larger than four are left alone.'] };
})();
