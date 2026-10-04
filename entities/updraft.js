// =============================================================================
//  The Updraft   (entity id: 'updraft')
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
const { clamp, paintTex, Rig, skinMat } = __mod['src/entities/rig.js'];
const { cloth, face, HUMAN, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 14  THE UPDRAFT (acrophobia)
const ribbonTex = () => tex('ribbon', () => paintTex(64, 256, (u, v, N, out) => {
  const edge = Math.abs(u - 0.5) * 2;
  const tear = N.fbm(u * 2, v * 6, 6, 3);
  out.a = clamp((1 - edge) * 2.2 - (tear - 0.4) * 2.5, 0, 1) * (1 - Math.pow(v, 3));
  const k = 0.7 + N.fbm(u, v, 10, 3) * 0.25;
  return [0.78 * k, 0.8 * k, 0.82 * k];
}));


function buildUpdraft() {
  const rig = new Rig({ ...HUMAN });
  const mat = skinMat('#d0d4d8', { map: ribbonTex().map, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide, rough: 0.95, depthWrite: false });
  mat.opacity = 0.75;
  const ribbons = [];
  for (let i = 0; i < 26; i++) {
    const geo = new THREE.PlaneGeometry(0.3, 2.2, 1, 12);
    const m = new THREE.Mesh(geo, mat);
    rig.root.add(m);
    ribbons.push({ m, geo, base: geo.attributes.position.array.slice(), a: Math.random() * 6.28, r: 0.3 + Math.random() * 1.2, y: 0.4 + Math.random() * 2.2, sp: 0.6 + Math.random() * 1.2 });
  }
  // a face pressed out of the cloth, now and then
  const faceM = skinMat('#c8ccd0', { rough: 0.9, transparent: true, opacity: 0.0, depthWrite: false });
  const faceMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12, Math.PI / 2 - 1, 2, 0.5, 2), faceM);
  faceMesh.position.y = 2.0; rig.root.add(faceMesh);
  rig.finalize();
  return result(rig, {
    kind: 'haze', height: 3.0, radius: 0.5, eyeY: 2.0, faceMesh,
    animate(st, dt) {
      st.t += dt;
      const gust = (st.gust || 0);
      for (const r of ribbons) {
        r.a += dt * r.sp * (1 + gust * 3);
        const pa = r.geo.attributes.position;
        for (let k = 0; k < pa.count; k++) {
          const y0 = r.base[k * 3 + 1];
          const v = (y0 + 1.1) / 2.2;
          const ang = r.a + v * 1.8;
          const rad = r.r * (0.6 + v * 0.8) * (1 + gust * 0.6);
          const x0 = r.base[k * 3];
          pa.setXYZ(k, Math.cos(ang) * rad + x0 * Math.sin(ang), r.y + y0 * 0.8 + Math.sin(st.t * 2 + v * 5) * 0.1, Math.sin(ang) * rad - x0 * Math.cos(ang));
        }
        pa.needsUpdate = true;
      }
      faceM.opacity = clamp(Math.sin(st.t * 0.37) * 2 - 1.2, 0, 0.6) + gust * 0.3;
      faceMesh.rotation.y = st.look || 0;
    },
    anchors(key) { return V().set(0.4, { head: 2.0, chest: 1.4, foot: 0.5, hand: 1.0 }[key] ?? 1, 0); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.updraft = buildUpdraft;

// 14 --------------------------------------------------------------- THE UPDRAFT
D.updraft = {
  name: 'The Updraft', speed: 1.6, chase: 2.8, detect: 30, dmg: 0, reach: 0, cd: 1, memory: 30, noclip: true, haze: false, xray: true, noAttack: true, voice: 'gust', silent: true, anywhere: true,
  num: 'Φ-14 · Acrophobia', cls: 'Lethal (indirectly)', size: '~4 m of torn cloth',
  desc: 'Grey ribbons of cloth whirling in a column with no wind to hold them up. Sometimes there is a face in it.',
  notes: 'It cannot hurt you itself. It does not need to. It drifts in over the walkways and shoves, hard, toward the nearest edge.',
  tips: ['Crouch when it is close: you are harder to push.', 'Keep to the middle of walkways and away from gaps in the railing.', 'Listen for the gust before it arrives.'],
  sketch: [['head', 'a face, sometimes'], ['chest', 'no body at all'], ['foot', 'pushes']],
  frame(m, e, dt, d) {
    const pl = PL(m);
    e.st.gust = clamp(1 - d / 5, 0, 1);
    e.gustT = (e.gustT || 0) - dt;
    if (d < 4.2 && e.gustT <= 0) {
      e.gustT = 2.8 + m.rng.next() * 2;
      const a = Math.atan2(pl.pos.x - e.pos.x, pl.pos.z - e.pos.z) + (m.rng.next() - 0.5) * 1.2;
      const k = pl.stance === 'stand' ? 7.5 : 3.2;
      pl.vel.x += Math.sin(a) * k; pl.vel.z += Math.cos(a) * k;
      pl.addTrauma(0.35);
      m.game.audio.entity(e.type, 'attack', e.pos, pl);
    }
    e.threat = clamp(1 - d / 10, 0, 1) * 0.8;
    return null;
  },
  think(m, e) { const P = PL(m).pos; e.state = 'chase'; e.path = [[P.x, P.z]]; },
};

})();
