// =============================================================================
//  The Squeeze   (entity id: 'squeeze')
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
const { animateSpider, ellipsoid, limbGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, ph } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 16  THE SQUEEZE (claustrophobia)
function buildSqueeze() {
  const p = { ...HUMAN, hipH: 0.9, thigh: 0.5, shin: 0.5, spine: 0.4, chestH: 0.34, neck: 0.22, shoulderW: 0.42, upperArm: 0.5, foreArm: 0.52, chestW: 0.34, armR: 0.65, legR: 0.6, headR: 0.1 };
  const rig = new Rig(p);
  const t = organic('squeeze', { base: '#c4b4a4', dark: '#7a6a5c', light: '#e8dccc', veins: 0.6, vein: '#6a3a40', pores: 0.5, wrinkle: 0.9, wrinkleF: 120, mottle: 0.5, drips: 0.3 });
  const skin = fleshMat(t, { rough: 0.25, bumpScale: 2.0 });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.22, fingerR: 0.7, claws: 0.02, footLen: 0.2, chestDepth: 0.38, neckR: 0.7, ribs: true, fingerVar: true });
  headOn(rig, p, skin, 1.25, 0.75, 1.1);
  const hl = headLift(p);
  // a face pressed flat, as if it lives between walls
  const eye = skinMat('#0a0808', { rough: 0.05 });
  for (const s of [-1, 1]) rig.attach(rig.head, xf(ellipsoid(0.022, 0.009, 0.01), { x: s * 0.05, y: hl + 0.01, z: 0.105 }), eye, { rigid: true, shadow: false });
  rig.attach(rig.head, xf(ellipsoid(0.07, 0.006, 0.01), { y: hl - 0.04, z: 0.105 }), eye, { rigid: true, shadow: false });
  // a second, longer pair of arms
  const extra = [];
  for (const s of [-1, 1]) {
    const sh = rig.joint(rig.spine, s * 0.15, 0.15, 0);
    const el = rig.joint(sh, 0, -0.55, 0);
    const wr = rig.joint(el, 0, -0.55, 0);
    rig.attach(sh, limbGeo(0.55, 0.035, 0.026, 0.01), skin, { parent: rig.spine, child: el, bw: 0.04 });
    rig.attach(el, limbGeo(0.55, 0.026, 0.018), skin, { parent: sh, child: wr, bw: 0.03 });
    rig.attach(wr, xf(ellipsoid(0.03, 0.07, 0.012), { y: -0.07 }), skin, { parent: el, axis: [0, -1, 0], len: 0.1 });
    extra.push({ sh, el, s });
  }
  return result(rig, {
    kind: 'spider', height: 0.8, radius: 0.36, eyeY: 0.6,
    animate(st, dt) {
      st.twitch = st.chasing ? 1 : 0.4; st.stride = 1.3; st.pitch = 1.5; st.hipK = 0.32;
      animateSpider(rig, st, dt);
      for (const E of extra) {
        const ph = st.phase + (E.s > 0 ? Math.PI : 0);
        E.sh.rotation.x = -1.3 + Math.sin(ph) * 0.5;
        E.sh.rotation.z = E.s * 1.2;
        E.el.rotation.x = -0.8 + Math.cos(ph) * 0.4;
      }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.squeeze = buildSqueeze;

// 16 --------------------------------------------------------------- THE SQUEEZE
D.squeeze = {
  name: 'The Squeeze', speed: 1.0, chase: 5.6, detect: 10, dmg: 26, reach: 1.3, cd: 1.0, memory: 7, crawlerish: true, voice: 'creak',
  num: 'Φ-16 · Claustrophobia', cls: 'Hostile', size: '2.5 m long, 0.5 m high',
  desc: 'A long, flattened, pale thing with four arms that lives in the gaps — crawlspaces, ducts, the low halls between real rooms.',
  notes: 'In a tight passage it is terrifyingly fast; it was made for them. In a big open room it is clumsy and slow and seems almost afraid.',
  tips: ['Get to a wide room. It slows to a crawl in the open.', 'Pressure and panic make you clumsy: breathe in the open rooms too.', 'Never back into a dead end.'],
  sketch: [['head', 'flattened face'], ['hand', 'four arms'], ['foot', 'lives in crawlspaces']],
  speedFn(m, e, want) {
    const S = m.world.S, gx = Math.floor(e.pos.x / S), gz = Math.floor(e.pos.z / S);
    let open = 0;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.nav.step(gx, gz, dx, dz)) open++;
    e.tight = open <= 2;
    return want * (e.tight ? 1.0 : 0.3);
  },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
