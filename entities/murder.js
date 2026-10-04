// =============================================================================
//  The Murder   (entity id: 'murder')
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
const { V } = __mod['src/phobia/models_a.js'];
const { clamp, ellipsoid, glowMat, lerp, paintTex, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { face, HUMAN, result, sm, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, ph, PL, strike, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 4  THE MURDER (ornithophobia)
const featherTex = () => tex('feather', () => paintTex(128, 64, (u, v, N, out) => {
  const shaft = sm(0.03, 0.0, Math.abs(v - 0.5));
  const barbs = Math.pow(Math.abs(Math.sin((u * 60 + Math.abs(v - 0.5) * 30))), 4);
  const edge = (Math.abs(v - 0.5) * 2 < 0.85 - u * 0.2) ? 1 : 0;
  out.a = edge;
  const k = 0.05 + barbs * 0.04 + shaft * 0.1 + N.fbm(u, v, 8, 2) * 0.03;
  out.h = 0.5 + barbs * 0.2;
  return [k * 0.9, k * 0.95, k * 1.2];
}, { bump: true }));


function crowMesh(mats) {
  const g = new THREE.Group();
  const add = (geo, m) => { const me = new THREE.Mesh(geo, m); me.castShadow = true; g.add(me); return me; };
  add(xf(ellipsoid(0.07, 0.065, 0.16), {}), mats.body);
  add(xf(ellipsoid(0.055, 0.055, 0.06), { z: 0.15, y: 0.03 }), mats.body);
  add(xf(new THREE.ConeGeometry(0.018, 0.08, 6), { z: 0.23, y: 0.025, rx: Math.PI / 2 }), mats.beak);
  for (const s of [-1, 1]) add(xf(ellipsoid(0.008, 0.008, 0.006), { x: s * 0.04, y: 0.045, z: 0.18 }), mats.eye);
  add(xf(new THREE.ConeGeometry(0.05, 0.14, 4), { z: -0.2, rx: -Math.PI / 2, sy: 0.3 }), mats.body);
  const wings = [];
  for (const s of [-1, 1]) {
    const piv = new THREE.Group(); piv.position.set(s * 0.05, 0.03, 0.02); g.add(piv);
    const geo = new THREE.PlaneGeometry(0.34, 0.16, 3, 1); geo.rotateX(-Math.PI / 2); geo.translate(s * 0.17, 0, -0.03);
    const w = new THREE.Mesh(geo, mats.wing); w.castShadow = true; piv.add(w);
    wings.push({ piv, s });
  }
  return { g, wings };
}


function buildMurder() {
  const rig = new Rig({ ...HUMAN });
  const ft = featherTex();
  const mats = {
    body: skinMat('#151820', { rough: 0.45, map: ft.map, bump: ft.bump, bumpScale: 0.6 }),
    wing: skinMat('#ffffff', { map: ft.map, bump: ft.bump, bumpScale: 1, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, rough: 0.5 }),
    beak: skinMat('#1a1a1c', { rough: 0.25 }),
    eye: glowMat('#d8c070'),
  };
  const N = 22;
  const birds = [];
  for (let i = 0; i < N; i++) {
    const c = crowMesh(mats);
    const s = 0.8 + Math.random() * 0.5; c.g.scale.setScalar(s);
    rig.root.add(c.g);
    birds.push({ ...c, a: Math.random() * Math.PI * 2, r: 0.6 + Math.random() * 2.4, h: Math.random() * 1.8, sp: 0.9 + Math.random() * 0.9, ph: Math.random() * 9, dir: Math.random() < 0.8 ? 1 : -1 });
  }
  rig.finalize();
  const center = new THREE.Group(); rig.root.add(center);
  return result(rig, {
    kind: 'flock', height: 3.2, radius: 0.6, eyeY: 2.6, body: center,
    animate(st, dt) {
      st.t += dt;
      const dive = clamp(st.dive || 0, 0, 1);
      const alt = (st.alt ?? 2.6);
      for (const b of birds) {
        b.a += dt * b.sp * b.dir * (1.2 + dive * 2.4);
        const r = b.r * (1 - dive * 0.75) * (1 + Math.sin(st.t * 0.5 + b.ph) * 0.15);
        const y = alt - dive * 1.3 + b.h * (1 - dive * 0.6) + Math.sin(st.t * 1.7 + b.ph) * 0.2;
        const x = Math.cos(b.a) * r, z = Math.sin(b.a) * r;
        // face the direction of travel around the circle
        b.g.position.set(x, y, z);
        b.g.rotation.set(dive * 0.6, -b.a - (b.dir > 0 ? 0 : Math.PI), b.dir * -0.5 * (1 - dive));
        const flap = Math.sin(st.t * (14 + b.sp * 6) + b.ph);
        for (const w of b.wings) w.piv.rotation.z = w.s * (flap * 0.9 + 0.1);
      }
    },
    sketchPose(st) { st.alt = 1.2; for (let i = 0; i < 20; i++) this.animate(st, 0.05); },
    anchors(key) { return V().set(0.3, key === 'head' ? 2.2 : key === 'foot' ? 0.8 : 1.6, 0); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.murder = buildMurder;

// 4 ---------------------------------------------------------------- THE MURDER
D.murder = {
  name: 'The Murder', speed: 2.4, chase: 4.2, detect: 26, dmg: 9, reach: 1.7, cd: 0.6, memory: 10, fly: true, noclip: true, voice: 'caw', noAttack: true, silent: true, viewDist: 80,
  num: 'Φ-04 · Ornithophobia', cls: 'Hostile', size: 'twenty-odd crows', anywhere: true,
  desc: 'A flock of crows that moves like one animal. It circles overhead in silence and then comes down all at once.',
  notes: 'The flock watches for movement. It gathers above you, tightening its circle, and dives. A wanderer standing perfectly still in a crouch is ignored more often than not.',
  tips: ['When the circle tightens, crouch and freeze.', 'Under a roof they cannot dive at you.', 'Each dive only takes a little — it is the number of dives that kills.'],
  sketch: [['head', 'eyes like brass'], ['chest', 'one mind'], ['foot', 'dives in a column']],
  init(m, e) { e.st.alt = 6; e.mode = 'drift'; e.modeT = 0; e.diveIn = 6 + m.rng.next() * 5; },
  frame(m, e, dt, d) {
    const pl = PL(m), P = pl.pos;
    e.modeT += dt;
    const still = (pl.walkSpeed || 0) < 0.3 && pl.stance !== 'stand';
    const covered = m.world.gen && m.world.gen.coveredAt ? m.world.gen.coveredAt(m.world, P.x, P.z) : false;
    if (e.mode === 'dive') {
      e.st.dive = Math.min(1, e.st.dive + dt * 2);
      e.st.alt = lerp(e.st.alt, 1.1, Math.min(1, dt * 3));
      const dx = P.x - e.pos.x, dz = P.z - e.pos.z, l = Math.hypot(dx, dz) || 1;
      const sp = 9 * m.diff.speed;
      e.pos.x += dx / l * Math.min(l, sp * dt); e.pos.z += dz / l * Math.min(l, sp * dt);
      if (!e.hit && l < 1.8) { e.hit = true; strike(m, e, e.def.dmg, 1); pl.addTrauma(0.3); m.game.audio.entity(e.type, 'attack', e.pos, pl); }
      if (e.modeT > 1.6 || (still && e.modeT < 0.6) || covered) { e.mode = 'drift'; e.modeT = 0; e.hit = false; e.diveIn = 4 + m.rng.next() * 6; }
      e.threat = 1;
      return 'static';
    }
    e.st.dive = Math.max(0, (e.st.dive || 0) - dt);
    e.st.alt = lerp(e.st.alt, e.mode === 'gather' ? 4.2 : 6.5, Math.min(1, dt));
    if (e.mode === 'gather') {
      e.threat = 0.4;
      const a = e.modeT * 0.8, r = 3;
      const tx = P.x + Math.sin(a) * r, tz = P.z + Math.cos(a) * r;
      e.pos.x = lerp(e.pos.x, tx, Math.min(1, dt * 1.2)); e.pos.z = lerp(e.pos.z, tz, Math.min(1, dt * 1.2));
      if (e.modeT > e.diveIn && !still && !covered) { e.mode = 'dive'; e.modeT = 0; m.game.audio.entity(e.type, 'alert', e.pos, pl); }
      if (d > 40) e.mode = 'drift';
      return 'static';
    }
    e.threat = 0;
    if (d < 24 && !still) { e.mode = 'gather'; e.modeT = 0; }
    return null;
  },
  think(m, e, d) {
    if (e.mode !== 'drift') return;
    if (!e.path || !e.path.length) { const P = PL(m).pos; const a = m.rng.next() * TAU; e.path = [[P.x + Math.cos(a) * 18, P.z + Math.sin(a) * 18]]; }
  },
};

})();
