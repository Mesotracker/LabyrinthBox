// =============================================================================
//  The Supervisor   (entity id: 'supervisor')
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
const { humanSkin, suitMat } = __mod['src/phobia/models_b.js'];
const { animateBiped, clamp, glowMat, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, headLift, HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, ph, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 44  THE SUPERVISOR (ergophobia)
function buildSupervisor() {
  const p = { ...HUMAN, hipH: 1.0, chestW: 0.38, shoulderW: 0.46, headR: 0.1 };
  const rig = new Rig(p);
  const skin = humanSkin('supskin', '#c8a890');
  const suit = suitMat('navysuit', '#1a2236');
  buildBody(rig, p, { skin, top: suit, bottom: suit, arms: suit, shoes: skinMat('#050505', { rough: 0.2 }), hands: skin }, { sleeve: true, chestDepth: 0.62 });
  rig.attach(rig.chest, xf(new THREE.PlaneGeometry(0.11, 0.3), { y: p.chestH * 0.62, z: p.chestW * 0.31 }), skinMat('#e8e8e8', { rough: 0.8 }), { rigid: true, shadow: false });
  rig.attach(rig.chest, xf(new THREE.BoxGeometry(0.035, 0.28, 0.01), { y: p.chestH * 0.55, z: p.chestW * 0.315 }), skinMat('#6a0a0a', { rough: 0.5 }), { rigid: true, shadow: false });
  // a security camera where the head should be, on a wall mount growing out of the neck
  const hl = headLift(p);
  const mount = new THREE.Group(); mount.position.y = hl - 0.05; rig.head.add(mount);
  const plastic = skinMat('#d8d8d4', { rough: 0.45 });
  mount.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.025, 0.025, 0.1, 8), { y: 0.03 }), plastic));
  const cam = new THREE.Group(); cam.position.y = 0.1; mount.add(cam);
  cam.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.14, 0.13, 0.3), { z: 0.05 }), plastic));
  cam.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.17, 0.02, 0.34), { y: 0.075, z: 0.06 }), plastic));
  cam.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.045, 0.05, 0.04, 16), { rx: Math.PI / 2, z: 0.21 }), skinMat('#151515', { rough: 0.3 })));
  cam.add(new THREE.Mesh(xf(new THREE.CircleGeometry(0.035, 16), { z: 0.232 }), skinMat('#0a1020', { rough: 0.05, metal: 0.5 })));
  const led = new THREE.Mesh(xf(new THREE.SphereGeometry(0.008, 8, 6), { x: 0.05, y: 0.04, z: 0.2 }), glowMat('#ff1a10')); cam.add(led);
  const beamM = glowMat('#ff2a1a', { transparent: true, opacity: 0.05, additive: true, depthWrite: false, side: THREE.DoubleSide });
  const beamG = new THREE.ConeGeometry(1.4, 9, 20, 1, true); beamG.translate(0, -4.5, 0); beamG.rotateX(-Math.PI / 2);
  const beam = new THREE.Mesh(beamG, beamM); beam.position.z = 0.23; beam.userData.noSketch = true; cam.add(beam);
  return result(rig, {
    kind: 'biped', height: 1.95, radius: 0.33, eyeY: 1.85, cam, beam,
    animate(st, dt) {
      st.stride = 1.55; st.lean = 0; st.hunch = 0.02; st.armSwing = 0.2; st.grip = 0.6;
      animateBiped(rig, st, dt);
      // the camera pans back and forth until it finds you, then locks on
      cam.rotation.y = st.chasing ? clamp(st.look || 0, -1.2, 1.2) * 0.4 : Math.sin(st.t * 0.6) * 0.9;
      cam.rotation.x = 0.15;
      led.visible = Math.sin(st.t * 6) > 0 || st.chasing;
      beamM.opacity = st.chasing ? 0.09 : 0.04;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.supervisor = buildSupervisor;

// 44 --------------------------------------------------------------- THE SUPERVISOR
D.supervisor = {
  name: 'The Supervisor', speed: 1.0, chase: 3.9, detect: 0, dmg: 30, reach: 1.45, cd: 1.2, memory: 6, voice: 'cctv',
  num: 'Φ-44 · Ergophobia', cls: 'Hostile', size: '1.95 m',
  desc: 'A manager in a navy suit with a security camera for a head, red light blinking, panning slowly back and forth over the cubicles.',
  notes: 'It patrols with its camera. Walk into the red cone and it sees you. And it does not tolerate slacking: go too long without getting any work done and it knows where you are.',
  tips: ['Stay out of the red cone.', 'Keep finishing tasks — the IDLE meter resets every time you complete one.', 'Crouch behind cubicle walls when it pans past.'],
  sketch: [['head', 'CCTV camera'], ['chest', 'navy suit'], ['foot', 'patrols']],
  think(m, e, d) {
    const pl = PL(m), P = pl.pos;
    // the camera cone: 26 degrees either side of where the lens points
    const panYaw = e.yaw + (e.state === 'chase' ? 0 : Math.sin(e.st.t * 0.6) * 0.9 * 0.5);
    const a = Math.atan2(P.x - e.pos.x, P.z - e.pos.z) - panYaw;
    const inCone = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.46 && d < 13 * m.diff.detect;
    const seen = inCone && m.world.visible(e.pos.x, 2.0, e.pos.z, P.x, pl.eyeY - (pl.stance === 'stand' ? 0 : 0.5), P.z) && !(pl.stance !== 'stand' && d > 5);
    const idle = ph(m) && ph(m).meterValue('idle') >= 1;
    hunt(m, e, d, seen || idle || d < 2);
  },
};

})();
