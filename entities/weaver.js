// =============================================================================
//  The Weaver   (entity id: 'weaver')
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
const { clamp, ellipsoid, glowMat, lerp, limbGeo, paintTex, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { fleshMat, HUMAN, mix3, organic, result, sm, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, hunt, inBeam, ph, PL, place, spotAround } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 1  THE WEAVER (arachnophobia)
const spiderTex = () => organic('weaverHair', { base: '#2a2118', dark: '#0e0a07', light: '#5a4630', veins: 0, pores: 0.8, poreF: 120, wrinkle: 0.9, wrinkleF: 220, mottle: 0.8 });

const abdomenTex = () => tex('weaverAbd', () => paintTex(256, 256, (u, v, N, out) => {
  const m = N.fbm(u, v, 5, 4);
  let c = mix3([0.13, 0.1, 0.07], [0.04, 0.03, 0.02], sm(0.3, 0.7, m));
  // a pale chevron pattern down the back and a skull-ish blotch
  const cx = Math.abs(u - 0.5);
  const chev = sm(0.04, 0.0, Math.abs(((v * 6 + cx * 5) % 1) - 0.5) - 0.3) * sm(0.25, 0.05, cx) * sm(0.15, 0.3, v) * sm(0.95, 0.8, v);
  c = mix3(c, [0.62, 0.52, 0.36], chev * 0.8);
  const hair = Math.pow(Math.abs(Math.sin((u * 340 + N.fbm(u, v, 30, 2) * 8))), 12);
  c = mix3(c, [0.5, 0.42, 0.3], hair * 0.35);
  out.h = 0.5 + hair * 0.3 - chev * 0.1;
  return c;
}, { bump: true }));


function buildWeaver() {
  const rig = new Rig({ ...HUMAN });
  const t = spiderTex();
  const chit = fleshMat(t, { rough: 0.9, bumpScale: 3 });
  const at = abdomenTex();
  const abdM = skinMat('#bdbdbd', { map: at.map, bump: at.bump, bumpScale: 2, rough: 0.8 });
  const body = new THREE.Group(); body.position.y = 0.75; rig.root.add(body);
  const add = (g, m = chit, parent = body) => { const me = new THREE.Mesh(g, m); me.castShadow = true; parent.add(me); return me; };
  add(ellipsoid(0.24, 0.15, 0.27));
  const abd = new THREE.Group(); abd.position.set(0, 0.06, -0.26); body.add(abd);
  add(xf(ellipsoid(0.36, 0.3, 0.46), { z: -0.38, y: 0.08 }), abdM, abd);
  // spinnerets
  for (const s of [-1, 1]) add(xf(new THREE.ConeGeometry(0.03, 0.09, 6), { x: s * 0.03, y: -0.02, z: -0.83, rx: -Math.PI / 2 }), chit, abd);
  // eight eyes in two rows, glossy black with a red glint
  const eyeM = skinMat('#050404', { rough: 0.05, emissive: '#3a0402', emissiveIntensity: 0.6 });
  [[-0.05, 0.1, 0.03], [0.05, 0.1, 0.03], [-0.12, 0.08, 0.02], [0.12, 0.08, 0.02], [-0.03, 0.14, 0.018], [0.03, 0.14, 0.018], [-0.09, 0.13, 0.015], [0.09, 0.13, 0.015]]
    .forEach(([x, y, r]) => add(xf(ellipsoid(r, r, r * 0.8), { x, y, z: 0.245 }), eyeM));
  // chelicerae with curved fangs
  const fangs = [];
  for (const s of [-1, 1]) {
    const ch = new THREE.Group(); ch.position.set(s * 0.06, -0.02, 0.24); body.add(ch);
    add(xf(ellipsoid(0.05, 0.08, 0.05), { y: -0.05 }), chit, ch);
    const f = new THREE.Group(); f.position.y = -0.12; ch.add(f);
    add(xf(new THREE.ConeGeometry(0.018, 0.12, 6), { y: -0.05, z: 0.02, rx: Math.PI + 0.5 }), skinMat('#120806', { rough: 0.2 }), f);
    fangs.push({ ch, f, s });
  }
  // pedipalps
  const palps = [];
  for (const s of [-1, 1]) {
    const pg = new THREE.Group(); pg.position.set(s * 0.12, -0.03, 0.22); body.add(pg);
    add(xf(limbGeo(0.22, 0.025, 0.02), { rx: -1.2, rz: s * 0.4 }), chit, pg);
    palps.push(pg);
  }
  const legs = [];
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) {
    const root = new THREE.Group(); root.position.set(s * 0.2, 0.02, 0.14 - i * 0.1); body.add(root);
    root.rotation.y = (s > 0 ? 0 : Math.PI) + s * (0.75 - i * 0.48);
    const femur = new THREE.Group(); root.add(femur);
    add(xf(limbGeo(0.62, 0.05, 0.04, 0.012), { rz: Math.PI / 2 }), chit, femur);
    const tibia = new THREE.Group(); tibia.position.x = 0.62; femur.add(tibia);
    add(xf(limbGeo(0.72, 0.04, 0.026, 0.008), { rz: Math.PI / 2 }), chit, tibia);
    const tars = new THREE.Group(); tars.position.x = 0.72; tibia.add(tars);
    add(xf(limbGeo(0.28, 0.024, 0.01), { rz: Math.PI / 2 }), chit, tars);
    legs.push({ femur, tibia, tars, s, i, ph: (i % 2 ? Math.PI : 0) + (s > 0 ? 0 : Math.PI) });
  }
  // the silk line it hangs from
  const silk = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1, 4), glowMat('#d8d4c8', { transparent: true, opacity: 0.6 }));
  silk.geometry.translate(0, 0.5, 0); rig.root.add(silk); silk.visible = false;
  rig.finalize();
  return result(rig, {
    kind: 'arthropod', height: 1.2, radius: 0.6, eyeY: 0.85, body,
    animate(st, dt) {
      st.t += dt;
      const v = st.speed;
      st.phase += v * dt * 5.0;
      const ph = st.phase, moveK = clamp(v / 0.5, 0, 1);
      const hang = st.hang || 0;
      body.position.y = 0.72 + Math.abs(Math.sin(ph * 2)) * 0.03 * moveK - (st.attack || 0) * 0.2 + hang * 0.0;
      body.rotation.x = -(st.attack || 0) * 0.4 + hang * Math.PI * 0.5 + Math.sin(st.t * 1.3) * 0.02;
      abd.rotation.x = Math.sin(st.t * 0.9) * 0.05 + hang * 0.3;
      for (const L of legs) {
        const p = ph + L.ph;
        const lift = Math.max(0, Math.sin(p)) * moveK;
        const curl = hang * 0.6;
        L.femur.rotation.z = 0.85 + lift * 0.3 + curl;
        L.femur.rotation.y = Math.cos(p) * 0.3 * moveK + Math.sin(st.t * 7 + L.i) * 0.01;
        L.tibia.rotation.z = -1.85 + lift * 0.2 - curl * 0.8;
        L.tars.rotation.z = -0.5 - curl * 0.5;
      }
      for (const F of fangs) { F.f.rotation.x = 0.2 + (st.attack || 0) * 0.9 + (st.chasing ? Math.abs(Math.sin(st.t * 9)) * 0.2 : 0); F.ch.rotation.z = F.s * Math.sin(st.t * 5) * 0.05; }
      for (const p of palps) p.rotation.x = Math.sin(st.t * 3 + p.position.x * 50) * 0.25;
      silk.visible = (st.thread || 0) > 0.05;
      if (silk.visible) { silk.scale.y = st.thread; silk.position.y = body.position.y; }
    },
    anchors(key) { const v = V(); body.getWorldPosition(v); if (key === 'head') v.z += 0.3; else if (key === 'foot') { v.x += 1.1; v.y = 0.05; } else if (key === 'hand') v.z += 0.5; return v; },
  });
}


__mod['src/entities/registry.js'].BUILDERS.weaver = buildWeaver;

// 1 ---------------------------------------------------------------- THE WEAVER
D.weaver = {
  name: 'The Weaver', speed: 1.0, chase: 4.6, detect: 9, dmg: 26, reach: 1.5, cd: 1.1, memory: 5, noLeash: false, voice: 'chitter',
  num: 'Φ-01 · Arachnophobia', cls: 'Hostile', size: '2.6 m leg span', anywhere: true,
  desc: 'A spider the size of a car tyre, furred, eight wet black eyes. It waits on the ceiling over doorways and drops on whatever walks underneath.',
  notes: 'Webs strung across corridors are its tripwires: walking into one slows you and tells it exactly where you are. It climbs back up after a short chase and picks another ceiling.',
  tips: ['Sweep the ceiling with your flashlight before you walk under it — light makes it scuttle off.', 'Go around webs, not through them.', 'After it drops, run: it gives up after a few seconds and climbs back.'],
  sketch: [['head', 'eight eyes'], ['chest', 'chevroned abdomen'], ['foot', '2.6 m across']],
  init(m, e) { e.mode = 'ceiling'; e.st.hang = 1; e.modeT = 0; e.pos.y = 2.0; },
  frame(m, e, dt, d, looked) {
    const ceil = Math.min(m.ceiling(), 4.5);
    const hangY = ceil - 0.95;
    e.modeT += dt;
    const pl = PL(m);
    if (e.mode === 'ceiling') {
      e.pos.y = lerp(e.pos.y, hangY, Math.min(1, dt * 3));
      e.st.hang = lerp(e.st.hang, 1, Math.min(1, dt * 4)); e.st.thread = 0;
      e.speed = 0; e.state = 'wander';
      // a beam of light sends it skittering off to another ceiling
      if (inBeam(m, e, looked, d, 0.8) && d < 14) { e.litT = (e.litT || 0) + dt; if (e.litT > 0.7) { e.litT = 0; m.game.audio.entity(e.type, 'voice', e.pos, pl); const s = spotAround(m, 1, 9, 18, true, 1.4) || spotAround(m, -1, 8, 16); if (s) place(m, e, s[0], s[1]); } }
      else e.litT = 0;
      const hx = Math.hypot(pl.pos.x - e.pos.x, pl.pos.z - e.pos.z);
      if ((hx < 2.4 || (ph(m) && ph(m).webAlert && hx < 14)) && e.modeT > 2) {
        e.mode = 'drop'; e.modeT = 0; m.game.audio.entity(e.type, 'alert', e.pos, pl); pl.addTrauma(0.3);
        if (ph(m)) ph(m).webAlert = false;
      }
      return 'static';
    }
    if (e.mode === 'drop') {
      e.pos.y = Math.max(0, e.pos.y - dt * 7);
      e.st.thread = Math.max(0, ceil - e.pos.y - 0.75);
      e.st.hang = Math.max(0, e.st.hang - dt * 3);
      if (e.pos.y <= 0) { e.mode = 'hunt'; e.modeT = 0; e.st.thread = 0; m.alert(e); }
      return 'static';
    }
    if (e.mode === 'hunt') { e.st.thread = 0; if (e.modeT > 9 && d > 5) { e.mode = 'climb'; e.modeT = 0; m.routeAway(e, 10); } return null; }
    if (e.mode === 'climb') {
      if (e.modeT < 2.5) return null;
      e.pos.y = Math.min(hangY, e.pos.y + dt * 3);
      e.st.thread = Math.max(0, ceil - e.pos.y - 0.75);
      e.st.hang = Math.min(1, e.st.hang + dt * 2);
      if (e.pos.y >= hangY - 0.05) { e.mode = 'ceiling'; e.modeT = 0; }
      return 'static';
    }
    return null;
  },
  think(m, e, d, sees) { if (e.mode === 'hunt' || e.mode === 'climb') { if (e.mode === 'climb') { if (!e.path) m.routeAway(e, 10); return; } chaseTo(m, e); } },
};

})();
