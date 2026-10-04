// =============================================================================
//  The Absence   (entity id: 'absence')
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
const { V } = __mod['src/phobia/models_b.js'];
const { canvasTex, clamp, glowMat, Rig } = __mod['src/entities/rig.js'];
const { HUMAN, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { chaseTo, D, ph, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 18  THE ABSENCE (kenophobia)
function buildAbsence() {
  const rig = new Rig({ ...HUMAN });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 20), glowMat('#000000', { fog: false }));
  core.position.y = 1.5; rig.root.add(core);
  // a rim where the light bends: dark halo, then a thin pale ring
  const ringMap = tex('absRing', () => canvasTex(256, 256, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, w * 0.18, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(0,0,0,1)'); r.addColorStop(0.45, 'rgba(0,0,0,0.85)'); r.addColorStop(0.62, 'rgba(200,200,210,0.18)'); r.addColorStop(0.68, 'rgba(0,0,0,0.4)'); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  }));
  const ring = sprite(ringMap, 0xffffff, 3.2, 0.95); ring.position.y = 1.5; rig.root.add(ring);
  const motes = [];
  const moteMap = haloMat('#ffffff').map;
  for (let i = 0; i < 40; i++) {
    const s = sprite(moteMap, 0xbfc0c8, 0.05, 0.7);
    rig.root.add(s); motes.push({ s, a: Math.random() * 6.28, b: Math.random() * 3.14, r: 0.7 + Math.random() * 2.2, sp: 0.3 + Math.random() * 0.6 });
  }
  rig.finalize();
  return result(rig, {
    kind: 'haze', height: 2.4, radius: 0.5, eyeY: 1.5, core, ring,
    animate(st, dt) {
      st.t += dt;
      const pulse = 1 + Math.sin(st.t * 0.7) * 0.06 + (st.attack || 0) * 0.3;
      core.scale.setScalar(pulse * (st.grow || 1));
      ring.scale.setScalar(3.2 * pulse * (st.grow || 1));
      core.position.y = ring.position.y = 1.5 + Math.sin(st.t * 0.4) * 0.1;
      for (const m of motes) {
        m.r -= dt * m.sp * 0.6;
        if (m.r < 0.55) { m.r = 2.6 + Math.random() * 0.8; m.a = Math.random() * 6.28; m.b = Math.random() * 3.14; }
        m.a += dt * m.sp * 1.5;
        m.s.position.set(Math.cos(m.a) * Math.sin(m.b) * m.r, 1.5 + Math.cos(m.b) * m.r * 0.6, Math.sin(m.a) * Math.sin(m.b) * m.r);
        m.s.material.opacity = clamp((m.r - 0.55) / 1.2, 0, 0.7);
      }
    },
    anchors(key) { return V().set(0.4, { head: 2.0, chest: 1.5, foot: 0.9, hand: 1.2 }[key] ?? 1.5, 0); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.absence = buildAbsence;

// 18 --------------------------------------------------------------- THE ABSENCE
D.absence = {
  name: 'The Absence', speed: 0.8, chase: 1.25, detect: 999, dmg: 24, reach: 1.7, cd: 1.4, memory: 999, noclip: true, xray: true, voice: 'void', silent: true, anywhere: true,
  num: 'Φ-18 · Kenophobia', cls: 'Hostile', size: '1.1 m across, growing',
  desc: 'A hole in the air. Light bends around its rim, sound goes quiet near it, and the lamps it passes go out and stay out.',
  notes: 'It drifts toward you through walls, slow and patient. It swallows the light and the sound around it, so the first sign is often that everything has gone very quiet and very dark.',
  tips: ['If the hum stops, move.', 'It is slow — just never stop moving for long.', 'Lit rooms stay lit only until it passes through them.'],
  sketch: [['head', 'light bends around it'], ['chest', 'nothing'], ['foot', 'swallows lamps']],
  frame(m, e, dt, d) {
    e.lightT = (e.lightT || 0) - dt;
    if (e.lightT <= 0) {
      e.lightT = 0.25;
      for (const fx of m.game.lights.fixtures.values()) {
        if (Math.abs(fx.x - e.pos.x) > 6 || Math.abs(fx.z - e.pos.z) > 6) continue;
        m.game.lights.setOverride(fx, 0, 25);
      }
    }
    e.st.grow = 1 + Math.min(0.8, m.time / 400);
    if (ph(m)) ph(m).hush = Math.max(ph(m).hush || 0, clamp(1 - d / 12, 0, 1));
    e.threat = clamp(1 - d / 14, 0, 1);
    return null;
  },
  think(m, e) { chaseTo(m, e); e.path = [[PL(m).pos.x, PL(m).pos.z]]; },
};

})();
