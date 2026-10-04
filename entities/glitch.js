// =============================================================================
//  Corrupted   (entity id: 'glitch')
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
const { animateBiped, canvasTex, clamp, Rig, skinMat } = __mod['src/entities/rig.js'];
const { buildBody, headOn, HUMAN, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, faceYaw, ph, PL, place, spotAround, strike } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 35  CORRUPTED (cyberphobia)
const pixelTex = () => tex('pixels', () => canvasTex(128, 128, (g, w, h) => {
  for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) {
    const r = Math.random();
    g.fillStyle = r < 0.5 ? `rgb(${10 + Math.random() * 30},${20 + Math.random() * 30},${30 + Math.random() * 40})` : r < 0.75 ? `rgb(0,${150 + Math.random() * 100},${200 + Math.random() * 55})` : r < 0.9 ? `rgb(${200 + Math.random() * 55},0,${150 + Math.random() * 100})` : '#f0f0f0';
    g.fillRect(x, y, 8, 8);
  }
}, { repeat: true }));


function buildGlitch() {
  const p = { ...HUMAN, headR: 0.12 };
  const rig = new Rig(p);
  const px = pixelTex(); px.repeat.set(3, 3);
  const mat = skinMat('#ffffff', { map: px, rough: 0.6, emissive: '#ffffff', emissiveIntensity: 0.55, emissiveMap: px });
  buildBody(rig, p, { skin: mat, top: mat, bottom: mat, shoes: mat }, { fingerLen: 0.09 });
  headOn(rig, p, mat, 1.1, 1.1, 1.1);
  // loose voxels breaking off and orbiting
  const cubes = [];
  for (let i = 0; i < 30; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), mat);
    rig.root.add(c); cubes.push({ c, a: Math.random() * 6.28, r: 0.3 + Math.random() * 0.4, y: 0.3 + Math.random() * 1.6, sp: 1 + Math.random() * 3 });
  }
  let jit = 0;
  const jb = [rig.head, rig.arms[0].el, rig.arms[1].sh, rig.chest].map((b) => ({ b, x: b.position.x, o: 0 }));
  return result(rig, {
    kind: 'biped', height: 1.85, radius: 0.32, eyeY: 1.7,
    animate(st, dt) {
      st.stride = 1.4; st.grip = 0.5; st.armSwing = 0.6;
      animateBiped(rig, st, dt);
      jit -= dt;
      if (jit <= 0) {
        jit = 0.05 + Math.random() * 0.3;
        // a few joints snap to the wrong place for a frame or two
        for (const j of jb) j.o += (Math.random() < 0.25 ? (Math.random() - 0.5) * 0.15 : 0);
        px.offset.set(Math.floor(Math.random() * 8) / 8, Math.floor(Math.random() * 8) / 8);
      }
      for (const j of jb) { j.o *= 0.7; j.b.position.x = j.x + j.o; }
      for (const c of cubes) { c.a += dt * c.sp; c.c.position.set(Math.cos(c.a) * c.r, c.y + Math.sin(st.t * 3 + c.a) * 0.05, Math.sin(c.a) * c.r); c.c.visible = Math.random() > 0.05; }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.glitch = buildGlitch;

// 35 --------------------------------------------------------------- CORRUPTED
D.glitch = {
  name: 'Corrupted', speed: 0, chase: 0, detect: 999, dmg: 28, reach: 1.4, cd: 1.0, memory: 999, xray: true, voice: 'static', silent: true,
  num: 'Φ-35 · Cyberphobia', cls: 'Hostile', size: '1.85 m (resolution varies)',
  desc: 'A person rendered in broken pixels, pieces of it snapping out of place, cubes of it orbiting loose.',
  notes: 'It does not walk. It skips — vanishing and reappearing a few metres closer, again and again. Looking at it freezes it in place but corrupts everything around you, and look too long and it skips somewhere you are not looking.',
  tips: ['Glance, do not stare.', 'Count the skips: it moves on a beat.', 'Static on the screen means it is close.'],
  sketch: [['head', 'low resolution'], ['chest', 'loose voxels'], ['foot', 'skips, never walks']],
  init(m, e) { e.skipT = 0.6; },
  frame(m, e, dt, d, looked) {
    e.skipT -= dt;
    if (ph(m)) ph(m).glitch = Math.max(ph(m).glitch || 0, clamp(1 - d / 14, 0, 1) * (looked > 0 ? 1 : 0.5));
    if (looked > 0 && d < 30) { e.stareT = (e.stareT || 0) + dt; if (e.stareT > 2.5) { e.stareT = 0; const s = spotAround(m, -1, 5, 9, true, 1.0); if (s) { place(m, e, s[0], s[1]); m.game.audio.entity(e.type, 'voice', e.pos, PL(m)); } } }
    else e.stareT = 0;
    if (e.skipT <= 0 && !(looked > 0)) {
      e.skipT = (0.5 + m.rng.next() * 0.35) / m.diff.speed;
      const P = PL(m).pos;
      const path = m.nav.findPath(e.pos.x, e.pos.z, P.x, P.z, 900);
      if (path && path.length) {
        let left = 2.6, x = e.pos.x, z = e.pos.z;
        for (const [px, pz] of path) { const l = Math.hypot(px - x, pz - z); if (l >= left) { x += (px - x) / l * left; z += (pz - z) / l * left; left = 0; break; } left -= l; x = px; z = pz; }
        e.pos.x = x; e.pos.z = z; e.yaw = faceYaw(m, e);
        if (d < 26) m.game.audio.entity(e.type, 'step', e.pos, PL(m));
      }
    }
    e.state = 'chase';
    if (d < e.def.reach && e.cd <= 0) { e.cd = e.def.cd; strike(m, e, e.def.dmg, 3); }
    e.cd -= dt;
    e.threat = clamp(1 - d / 18, 0, 1);
    e.speed = 1.2;
    return 'static';
  },
};

})();
