// =============================================================================
//  The Deep Hand   (entity id: 'deephand')
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
const { clamp, ellipsoid, lerp, limbGeo, Rig, xf } = __mod['src/entities/rig.js'];
const { fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { eyeball } = __mod['src/phobia/models_a.js'];
const { D, PL, place, strike } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 19  THE DEEP HAND (bathophobia)
function buildDeepHand() {
  const rig = new Rig({ ...HUMAN });
  const t = organic('deephand', { base: '#cfc8c0', dark: '#7a726a', light: '#efe8e0', veins: 0.8, vein: '#5a4a6a', pores: 0.3, wrinkle: 0.85, wrinkleF: 70, mottle: 0.4, repeat: [1, 4] });
  const skin = fleshMat(t, { rough: 0.35, bumpScale: 2 });
  const arms = [];
  for (const s of [-1, 1]) {
    // an arm that comes up out of the pit, over the lip, along the floor toward you
    const root = new THREE.Group(); root.position.set(s * 0.6, -3.0, -0.4); rig.root.add(root);
    const segs = [];
    let parent = root;
    for (let i = 0; i < 9; i++) {
      const g = new THREE.Group(); if (i > 0) g.position.y = 0.48; parent.add(g);
      const r0 = 0.09 - i * 0.006, r1 = 0.085 - i * 0.006;
      const m = new THREE.Mesh(xf(limbGeo(0.5, r1, r0, 0.01), { rx: Math.PI }), skin); m.castShadow = true; g.add(m);
      segs.push(g); parent = g;
    }
    // a hand with long fingers at the end
    const hand = new THREE.Group(); hand.position.y = 0.48; parent.add(hand);
    hand.add(new THREE.Mesh(xf(ellipsoid(0.07, 0.1, 0.03), { y: 0.08 }), skin));
    const fingers = [];
    for (let k = 0; k < 4; k++) {
      const f = new THREE.Group(); f.position.set((k - 1.5) * 0.035, 0.17, 0); hand.add(f);
      const f1 = new THREE.Mesh(xf(limbGeo(0.16, 0.014, 0.011), { rx: Math.PI }), skin); f.add(f1);
      const f2g = new THREE.Group(); f2g.position.y = 0.16; f.add(f2g);
      f2g.add(new THREE.Mesh(xf(limbGeo(0.13, 0.011, 0.007), { rx: Math.PI }), skin));
      fingers.push({ f, f2g });
    }
    arms.push({ root, segs, hand, fingers, s });
  }
  // the top of a bald head and two pale eyes just over the edge
  const head = new THREE.Group(); head.position.set(0, -1.0, -0.8); rig.root.add(head);
  head.add(new THREE.Mesh(ellipsoid(0.32, 0.36, 0.32), skin));
  for (const s of [-1, 1]) { const e = eyeball(0.05, '#c8c0a8', { milky: true }); e.position.set(s * 0.12, 0.05, 0.28); head.add(e); }
  rig.finalize();
  return result(rig, {
    kind: 'pit', height: 2.6, radius: 0.5, eyeY: 0.3, head,
    animate(st, dt) {
      st.t += dt;
      const reach = clamp(st.reach || 0, 0, 1);
      head.position.y = lerp(-1.6, -0.25, clamp(reach * 1.5 + (st.peek || 0), 0, 1)) + Math.sin(st.t * 0.6) * 0.03;
      for (const A of arms) {
        // the arm rises vertically, then bends over the edge and lays along the floor
        A.root.position.y = lerp(-4.2, -3.0, clamp(reach * 2, 0, 1));
        A.segs.forEach((g, i) => {
          const bend = i >= 5 ? lerp(0.1, 0.42, reach) : 0;
          g.rotation.x = bend + Math.sin(st.t * 2 + i * 0.6 + A.s) * 0.04;
          g.rotation.z = A.s * 0.03 * Math.sin(st.t + i);
        });
        A.hand.rotation.x = reach * 0.6;
        for (const F of A.fingers) { const c = (st.attack || 0) > 0.3 ? 1.2 : 0.2 + Math.sin(st.t * 3 + F.f.position.x * 30) * 0.15; F.f.rotation.x = c * 0.6; F.f2g.rotation.x = c * 0.8; }
      }
    },
    sketchPose(st) { st.reach = 0.8; this.animate(st, 0.1); this.root.position.y = 3.5; },
    anchors(key) { const v = V(); (key === 'head' ? this.head : arms[0].hand).getWorldPosition(v); return v; },
  });
}


__mod['src/entities/registry.js'].BUILDERS.deephand = buildDeepHand;

// 19 --------------------------------------------------------------- THE DEEP HAND
D.deephand = {
  name: 'The Deep Hand', speed: 0, chase: 0, detect: 6, dmg: 18, reach: 3.6, cd: 4, memory: 1, noAttack: true, noLeash: true, voice: 'scrape', silent: true, anywhere: true,
  num: 'Φ-19 · Bathophobia', cls: 'Lethal (indirectly)', size: 'arms ~4.5 m each',
  desc: 'Two long, pale arms folded over the lip of a pit, and the top of a bald head just below the edge, watching.',
  notes: 'It lives in the shafts and waits for something to walk along the edge. Then it grabs and pulls. The grab itself is not what kills.',
  tips: ['Stay well back from the edges of pits.', 'Pale fingers on the rim mean one is there.', 'If it grabs you, sprint away from the edge immediately.'],
  sketch: [['head', 'just below the edge'], ['hand', 'very long fingers'], ['foot', 'lives in pits']],
  spawnFn(m, type, near) {
    const g = m.world.gen;
    const P = near ? { x: near[0], z: near[1] } : PL(m).pos;
    const s = g && g.edgeSpot ? g.edgeSpot(m.world, P.x, P.z, 10, 40, m.rng) : null;
    if (!s) return null;
    const e = m.make(type, s.x, s.z); e.yaw = Math.atan2(s.nx, s.nz); return e;
  },
  frame(m, e, dt, d) {
    const pl = PL(m), P = pl.pos;
    e.cd -= dt; e.speed = 0;
    e.st.peek = clamp(1 - d / 10, 0, 1) * 0.4;
    // reach toward the player when they walk along its edge
    const fx = Math.sin(e.yaw), fz = Math.cos(e.yaw);
    const front = (P.x - e.pos.x) * fx + (P.z - e.pos.z) * fz;
    const close = d < 3.8 && front > -0.5;
    if (close && e.cd <= 0 && !e.grab) { e.grab = 0.001; e.cd = e.def.cd; m.game.audio.entity(e.type, 'alert', e.pos, pl); }
    if (e.grab) {
      e.grab += dt;
      e.st.reach = Math.min(1, e.grab / 0.35); e.st.attack = e.grab > 0.35 ? 1 : 0;
      if (!e.hit && e.grab > 0.4 && d < 4.2) { e.hit = true; strike(m, e, e.def.dmg, 0); const k = 7.5; pl.vel.x -= fx * k; pl.vel.z -= fz * k; pl.addTrauma(0.5); }
      if (e.grab > 1.6) { e.grab = 0; e.hit = false; }
    } else e.st.reach = Math.max(0, (e.st.reach || 0) - dt * 0.8);
    if (d > 45) { const s = m.world.gen && m.world.gen.edgeSpot ? m.world.gen.edgeSpot(m.world, P.x, P.z, 12, 35, m.rng) : null; if (s) { place(m, e, s.x, s.z); e.yaw = Math.atan2(s.nx, s.nz); } }
    e.threat = e.grab ? 1 : 0;
    return 'static';
  },
};

})();
