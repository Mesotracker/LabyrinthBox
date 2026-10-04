// =============================================================================
//  The Colossus   (entity id: 'colossus')
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
const { animateBiped, clamp, ellipsoid, glowMat, lerp, Rig, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { D, PL, place, strike, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 15  THE COLOSSUS (megalophobia)
function buildColossus() {
  const p = { ...HUMAN, hipH: 0.95, chestW: 0.34, armR: 1.1, legR: 1.1, upperArm: 0.36, foreArm: 0.36, headR: 0.1, neck: 0.12 };
  const rig = new Rig(p);
  const t = organic('colossus', { base: '#4a4844', dark: '#1a1a18', light: '#6a6660', veins: 0.2, pores: 0.8, poreF: 30, wrinkle: 0.9, wrinkleF: 40, mottle: 0.9, repeat: [3, 3] });
  const stone = fleshMat(t, { rough: 0.95, bumpScale: 4 });
  buildBody(rig, p, { skin: stone, top: stone, bottom: stone, shoes: stone }, { fingerLen: 0.12, chestDepth: 0.6, ribs: true, neckR: 0.9 });
  const hl = headLift(p);
  rig.attach(rig.head, xf(ellipsoid(0.1, 0.14, 0.1), { y: hl + 0.02 }), stone, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
  // a single lamp of an eye that sweeps the ground like a lighthouse
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 10), glowMat('#fff2c8'));
  eye.position.set(0, hl + 0.04, 0.09); rig.head.add(eye);
  const beamM = glowMat('#fff0c0', { transparent: true, opacity: 0.08, additive: true, depthWrite: false, side: THREE.DoubleSide });
  const beamG = new THREE.ConeGeometry(0.55, 3.2, 24, 1, true); beamG.translate(0, -1.6, 0); beamG.rotateX(-Math.PI / 2 + 0.0);
  const beam = new THREE.Mesh(beamG, beamM); beam.position.copy(eye.position); beam.userData.noSketch = true; rig.head.add(beam);
  const SCALE = 9;
  rig.root.scale.setScalar(SCALE);
  return result(rig, {
    kind: 'biped', height: 1.85 * SCALE, radius: 0.5, eyeY: 1.75 * SCALE, beam, giant: true,
    animate(st, dt) {
      st.stride = 1.5; st.lean = 0.12; st.hunch = 0.25; st.armSwing = 0.6; st.grip = 0.5;
      // giants move slowly: animate in slow motion relative to ground speed
      const sp = st.speed; st.speed = sp / SCALE;
      animateBiped(rig, st, dt);
      st.speed = sp;
      rig.head.rotation.x = 0.55 + (st.scan || 0) * 0.2;
      rig.neck.rotation.y = Math.sin(st.t * 0.25) * 0.6 + (st.lookAt || 0);
      beam.visible = st.beam !== false;
      beamM.opacity = 0.07 + (st.alarm || 0) * 0.12;
    },
    sketchPose(st) { st.beam = false; for (let i = 0; i < 30; i++) this.animate(st, 1 / 30); this.root.scale.setScalar(1); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.colossus = buildColossus;

// 15 --------------------------------------------------------------- THE COLOSSUS
D.colossus = {
  name: 'The Colossus', speed: 3.0, chase: 3.0, detect: 999, dmg: 55, reach: 0, cd: 1, memory: 999, noclip: true, xray: true, noAttack: true, noLeash: true, viewDist: 220, voice: 'boom', silent: true,
  num: 'Φ-15 · Megalophobia', cls: 'Lethal', size: '~17 m tall',
  desc: 'A grey stone giant walking through the fog on the horizon, so big that its footsteps arrive as earthquakes. One lamp of an eye sweeps the ground ahead of it.',
  notes: 'It walks a slow, wide circle around you and never comes close on its own. What it does is look: if the beam of its eye finds you standing in the open, it turns, it raises its foot, and it brings it down where you are.',
  tips: ['Watch the beam on the ground, not the giant.', 'When the light turns red, run sideways — far.', 'Cover breaks its line of sight.'],
  sketch: [['head', 'searchlight eye'], ['chest', 'stone'], ['foot', 'one step: 12 m']],
  spawnFn(m, type) { const P = PL(m).pos; const a = m.rng.next() * TAU; return m.make(type, P.x + Math.cos(a) * 60, P.z + Math.sin(a) * 60); },
  init(m, e) { e.orbit = m.rng.next() * TAU; e.alarm = 0; e.mode = 'walk'; e.modeT = 0; },
  frame(m, e, dt, d) {
    const pl = PL(m), P = pl.pos;
    e.modeT += dt;
    // footstep tremors
    const ph2 = Math.floor(e.st.phase / Math.PI);
    if (ph2 !== e.stepP) { e.stepP = ph2; if (d < 120) { pl.addTrauma(clamp(1 - d / 110, 0, 0.5) * 0.4); m.game.audio.entity(e.type, 'step', e.pos, pl); } }
    // where the eye's beam lands
    const sweep = Math.sin(e.st.t * 0.25) * 0.6;
    const a = e.yaw + sweep;
    const gx = e.pos.x + Math.sin(a) * 30, gz = e.pos.z + Math.cos(a) * 30;
    const inB = Math.hypot(P.x - gx, P.z - gz) < 8 && !(m.world.gen && m.world.gen.coveredAt && m.world.gen.coveredAt(m.world, P.x, P.z));
    if (e.mode === 'walk') {
      e.alarm = clamp(e.alarm + (inB ? dt / 1.4 : -dt / 3), 0, 1);
      e.st.alarm = e.alarm;
      if (e.alarm >= 1) { e.mode = 'stomp'; e.modeT = 0; e.target = [P.x, P.z]; m.game.audio.entity(e.type, 'alert', e.pos, pl); m.game.hud.flash('IT SEES YOU. MOVE.', 1800); }
    } else if (e.mode === 'stomp') {
      e.speed = 0; e.yaw = lerp(e.yaw, Math.atan2(e.target[0] - e.pos.x, e.target[1] - e.pos.z), Math.min(1, dt * 2));
      if (e.modeT > 1.0 && e.modeT < 1.6) { e.target[0] = lerp(e.target[0], P.x, dt * 0.8); e.target[1] = lerp(e.target[1], P.z, dt * 0.8); }
      if (e.modeT > 2.2 && !e.stomped) {
        e.stomped = true;
        const dd = Math.hypot(P.x - e.target[0], P.z - e.target[1]);
        m.fx.burst(e.target[0], 0.05, e.target[1], 80, 6, 7, [0.32, 0.3, 0.28], 1.8); m.fx.crater(e.target[0], e.target[1], 4);
        pl.addTrauma(clamp(1 - dd / 30, 0.2, 1));
        m.game.audio.entity(e.type, 'attack', e.pos, pl);
        if (dd < 5.5) strike(m, e, e.def.dmg, 9);
      }
      if (e.modeT > 3.5) { e.mode = 'walk'; e.alarm = 0; e.stomped = false; }
      e.threat = 1;
      return 'static';
    }
    e.threat = e.alarm * 0.8;
    return null;
  },
  think(m, e, d) {
    if (e.mode !== 'walk') return;
    const P = PL(m).pos;
    e.orbit += 0.004;
    const R = 55;
    e.state = 'wander';
    e.path = [[P.x + Math.cos(e.orbit) * R, P.z + Math.sin(e.orbit) * R]];
    if (d > 110) { place(m, e, P.x + Math.cos(e.orbit) * R, P.z + Math.sin(e.orbit) * R); }
  },
};

})();
