// =============================================================================
//  The Dread   (entity id: 'dread')
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
const { smokeWisps } = __mod['src/phobia/models_b.js'];
const { animateBiped, canvasTex, ellipsoid, glowMat, lerp, limbGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, headOn, HUMAN, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, ph, spotAround } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 31  THE DREAD (phobophobia)
const tunnelFace = () => tex('tunnel', () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  for (let i = 12; i > 0; i--) { g.strokeStyle = `rgba(${40 + i * 10},${30 + i * 6},${40 + i * 8},${0.5})`; g.lineWidth = 3; g.beginPath(); g.ellipse(w / 2, h / 2 + i * 3, i * 20, i * 24, 0, 0, Math.PI * 2); g.stroke(); }
  g.fillStyle = '#c8c8d8'; g.beginPath(); g.arc(w / 2, h / 2, 5, 0, Math.PI * 2); g.fill();
}));


function buildDread() {
  const p = { ...HUMAN, hipH: 1.1, chestW: 0.34, armR: 0.65, legR: 0.6, upperArm: 0.45, foreArm: 0.45, headR: 0.14 };
  const rig = new Rig(p);
  const dark = skinMat('#08060a', { rough: 1 });
  buildBody(rig, p, { skin: dark, top: dark, bottom: dark, shoes: dark }, { fingerLen: 0.16, fingerVar: true, claws: 0.02 });
  headOn(rig, p, dark, 1.0, 1.2, 1.05);
  face(rig, p, null, glowMat('#ffffff', { map: tunnelFace() }), { r: 1.04 });
  // more arms than it should have, reaching from the back
  const extra = [];
  for (let i = 0; i < 4; i++) {
    const s = i % 2 ? 1 : -1;
    const sh = rig.joint(rig.chest, s * 0.1, 0.15 + Math.floor(i / 2) * 0.12, -0.12);
    const el = rig.joint(sh, 0, -0.5, 0);
    const wr = rig.joint(el, 0, -0.5, 0);
    rig.attach(sh, limbGeo(0.5, 0.03, 0.022), dark, { parent: rig.chest, child: el, bw: 0.03 });
    rig.attach(el, limbGeo(0.5, 0.022, 0.014), dark, { parent: sh, child: wr, bw: 0.02 });
    rig.attach(wr, xf(ellipsoid(0.03, 0.08, 0.012), { y: -0.08 }), dark, { parent: el, axis: [0, -1, 0], len: 0.1 });
    extra.push({ sh, el, s, k: i });
  }
  const wisps = smokeWisps(rig, 24, 0x000000, 0.3);
  return result(rig, {
    kind: 'biped', height: 2.1, radius: 0.34, eyeY: 1.95,
    animate(st, dt) {
      st.lean = 0.12; st.hunch = 0.2; st.stride = 1.8; st.armSwing = 0.4; st.grip = 0.4; st.armsOut = 0.3;
      animateBiped(rig, st, dt);
      for (const E of extra) { E.sh.rotation.x = -1.2 + Math.sin(st.t * 1.4 + E.k) * 0.4; E.sh.rotation.z = E.s * (0.9 + Math.sin(st.t + E.k) * 0.3); E.el.rotation.x = -0.6 + Math.cos(st.t * 1.9 + E.k) * 0.3; }
      const g = st.grow || 1; rig.root.scale.setScalar(lerp(rig.root.scale.x, g, Math.min(1, dt * 2)));
      wisps(st.t);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.dread = buildDread;

// 31 --------------------------------------------------------------- THE DREAD
D.dread = {
  name: 'The Dread', speed: 1.0, chase: 3.0, detect: 18, dmg: 30, reach: 1.6, cd: 1.2, memory: 12, xray: true, voice: 'heart',
  num: 'Φ-31 · Phobophobia', cls: 'Lethal', size: 'as big as your fear',
  desc: 'A shadow with too many arms and a tunnel where its face should be. It is exactly as large as you are afraid.',
  notes: 'It grows and quickens with your FEAR: darkness, being hurt, being chased, seeing things. At high fear you start seeing others that are not there. Calm down — light, health, distance — and it shrinks.',
  tips: ['Stand in light and catch your breath to bring FEAR down.', 'Keep your health up — pain feeds it.', 'The things at the edge of your vision are not real. Probably.'],
  sketch: [['head', 'a tunnel'], ['hand', 'six arms'], ['chest', 'grows with fear']],
  frame(m, e, dt, d) {
    const f = ph(m) ? ph(m).meterValue('fear') : 0.3;
    e.st.grow = 0.65 + f * 0.9;
    e.dmgMul = 0.6 + f;
    e.hallT = (e.hallT || 6) - dt;
    if (f > 0.55 && e.hallT <= 0) { e.hallT = 7 + m.rng.next() * 7; const s = spotAround(m, 1, 9, 16, false, 1.4); if (s) { const h = m.make('phantom', s[0], s[1], true); h.ttl = 14; } }
    return null;
  },
  speedFn(m, e, want) { const f = ph(m) ? ph(m).meterValue('fear') : 0.3; return want * (0.45 + f * 1.15); },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
