// =============================================================================
//  The Umbra   (entity id: 'umbra')
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
const { smokeWisps } = __mod['src/phobia/models_b.js'];
const { animateBiped, ellipsoid, glowMat, Rig, xf } = __mod['src/entities/rig.js'];
const { buildBody, headLift, headOn, HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, inBeam, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 23  THE UMBRA (nyctophobia)
function buildUmbra() {
  const p = { ...HUMAN, hipH: 1.25, thigh: 0.6, shin: 0.6, spine: 0.28, chestH: 0.42, neck: 0.16, upperArm: 0.55, foreArm: 0.55, chestW: 0.32, armR: 0.75, legR: 0.65, headR: 0.13 };
  const rig = new Rig(p);
  const dark = new THREE.MeshBasicMaterial({ color: 0x010101 });
  buildBody(rig, p, { skin: dark, top: dark, bottom: dark, shoes: dark }, { fingerLen: 0.18, claws: 0.03, fingerVar: true });
  headOn(rig, p, dark, 1.0, 1.25, 1.05);
  const hl = headLift(p);
  // two pinpricks of reflected light, nothing else
  const eye = glowMat('#c8d8e8');
  for (const s of [-1, 1]) rig.attach(rig.head, xf(ellipsoid(0.008, 0.005, 0.004), { x: s * 0.04, y: hl + 0.03, z: 0.135 }), eye, { rigid: true, shadow: false });
  const wisps = smokeWisps(rig, 32, 0x000000, 0.35);
  return result(rig, {
    kind: 'biped', height: 2.6, radius: 0.34, eyeY: 2.4,
    animate(st, dt) {
      st.lean = 0.12; st.hunch = 0.2; st.stride = 2.2; st.armSwing = 0.4; st.grip = 0.4; st.armsOut = 0.15;
      animateBiped(rig, st, dt);
      wisps(st.t);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.umbra = buildUmbra;

// 23 --------------------------------------------------------------- THE UMBRA
D.umbra = {
  name: 'The Umbra', speed: 1.0, chase: 4.6, detect: 14, dmg: 30, reach: 1.5, cd: 1.2, memory: 8, voice: 'hush', darkSense: true,
  num: 'Φ-23 · Nyctophobia', cls: 'Lethal', size: '2.6 m',
  desc: 'A shape cut out of the dark, smoking at the edges, with two pinpricks where eyes should be.',
  notes: 'It cannot enter real light — it stops at the edge of every lamp as if at a wall. It hates the flashlight beam, but standing near it drinks the battery dry in seconds.',
  tips: ['Lamps are safe houses. Move between them.', 'Use the beam in short bursts to drive it back — it drains fast near the Umbra.', 'Find batteries early.'],
  sketch: [['head', 'two pinpricks'], ['chest', 'smoking darkness'], ['hand', 'long fingers']],
  frame(m, e, dt, d, looked) {
    const pl = PL(m);
    if (d < 9 && pl.flashlightOn) pl.battery = Math.max(0, pl.battery - dt * 5.5);
    if (inBeam(m, e, looked, d, 0.85)) { e.burn = (e.burn || 0) + dt; if (e.burn > 0.6) { e.burn = 0; e.state = 'retreat'; e.retreatT = 3; m.routeAway(e, 10); m.game.audio.entity(e.type, 'voice', e.pos, pl); } }
    return null;
  },
  speedFn(m, e, want) {
    // stops dead at the edge of light
    const nx = e.pos.x + Math.sin(e.yaw) * 0.8, nz = e.pos.z + Math.cos(e.yaw) * 0.8;
    return m.lum(nx, nz) > 0.16 ? 0 : want;
  },
  think(m, e, d, sees) {
    if (e.state === 'retreat') { e.retreatT -= 0.2; if (e.retreatT <= 0) e.state = 'wander'; else if (!e.path) m.routeAway(e, 10); return; }
    hunt(m, e, d, sees);
  },
};

})();
