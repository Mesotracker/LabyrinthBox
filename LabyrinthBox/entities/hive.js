// =============================================================================
//  The Hive   (entity id: 'hive')
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
const { animateBiped, latheGeo, paintTex, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, headLift, HUMAN, mix3, result, sm, tex } = __mod['src/entities/models.js'].HELPERS;
const { haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { D, hunt, ph, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 22  THE HIVE (trypophobia)
const holeTex = () => tex('holes', () => paintTex(512, 512, (u, v, N, out) => {
  const [d1, d2] = N.cell(u, v, 26);
  const cluster = sm(0.35, 0.65, N.fbm(u, v, 4, 3));
  const hole = sm(0.17, 0.1, d1) * cluster;
  const rim = sm(0.24, 0.17, d1) * (1 - sm(0.17, 0.12, d1)) * cluster;
  const m = N.fbm(u + 3, v, 6, 4);
  let c = mix3([0.66, 0.5, 0.42], [0.5, 0.32, 0.28], m);
  c = mix3(c, [0.75, 0.45, 0.42], rim * 0.8);
  c = mix3(c, [0.06, 0.03, 0.02], hole);
  // something pale moving in some of the holes
  const larva = hole * sm(0.6, 0.7, N.n2(Math.floor(u * 26) + 0.5, Math.floor(v * 26) + 0.5, 1, 1)) * sm(0.06, 0.03, d1);
  c = mix3(c, [0.9, 0.86, 0.72], larva);
  out.h = 0.5 - hole * 0.6 + rim * 0.25 + larva * 0.4 + (d2 - d1) * 0.05;
  return c;
}, { bump: true }));


function buildHive() {
  const p = { ...HUMAN, hipH: 1.0, chestW: 0.38, armR: 0.95, legR: 0.9, headR: 0.14 };
  const rig = new Rig(p);
  const t = holeTex();
  const skin = skinMat('#c0c0c0', { map: t.map, bump: t.bump, bumpScale: 4, rough: 0.4 });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.1, chestDepth: 0.66, belly: 1.1 });
  const hl = headLift(p);
  // a head like a lotus seed pod: flat top full of holes
  rig.attach(rig.head, xf(latheGeo([[-0.1, 0.06], [0.0, 0.12], [0.12, 0.17], [0.16, 0.16], [0.17, 0.01]], 1, 22), { y: hl - 0.05 }), skin, { parent: rig.neck, axis: [0, 1, 0], len: 1, bw: 0.02 });
  const swarm = [];
  const map = haloMat('#ffffff').map;
  for (let i = 0; i < 46; i++) { const s = sprite(map, 0x1a1408, 0.035, 0.9); rig.root.add(s); swarm.push({ s, a: Math.random() * 6.28, r: 0.3 + Math.random() * 1.0, y: 0.4 + Math.random() * 1.8, sp: 2 + Math.random() * 4, ph: Math.random() * 9 }); }
  return result(rig, {
    kind: 'biped', height: 2.0, radius: 0.36, eyeY: 1.85,
    animate(st, dt) {
      st.lean = 0.1; st.hunch = 0.2; st.stride = 1.4; st.armSwing = 0.6; st.grip = 0.5; st.tilt = Math.sin(st.t * 0.8) * 0.2;
      animateBiped(rig, st, dt);
      const k = 1 + (st.chasing ? 0.6 : 0) + (st.attack || 0);
      for (const b of swarm) { b.a += dt * b.sp; b.s.position.set(Math.cos(b.a) * b.r * k + Math.sin(st.t * 7 + b.ph) * 0.08, b.y + Math.sin(st.t * 3 + b.ph) * 0.2, Math.sin(b.a * 1.3) * b.r * k); }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.hive = buildHive;

// 22 --------------------------------------------------------------- THE HIVE
D.hive = {
  name: 'The Hive', speed: 1.0, chase: 3.3, detect: 12, dmg: 18, reach: 1.45, cd: 1.1, memory: 7, voice: 'buzz',
  num: 'Φ-22 · Trypophobia', cls: 'Hostile', size: '2.0 m',
  desc: 'A body covered in clusters of small round holes, rims pink and swollen. Some of the holes are not empty. A cloud of something small follows it everywhere.',
  notes: 'The swarm around it bites. Standing near it wears you down even if it never lands a blow, and its touch leaves something burrowing under the skin.',
  tips: ['Keep more than five metres away — the swarm is the real danger.', 'Drink to flush out what it leaves in you.', 'The buzzing gets louder before you see it.'],
  sketch: [['head', 'lotus-pod head'], ['chest', 'clustered holes'], ['hand', 'a swarm']],
  frame(m, e, dt, d) {
    if (d < 5) { const pl = PL(m); pl.stamina = Math.max(0, pl.stamina - dt * 10); if (m.rng.next() < dt * 1.2) pl.damage(2, null); }
    return null;
  },
  onHit(m) { if (ph(m)) ph(m).addBleed(6, 1.8, 'infest'); },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
