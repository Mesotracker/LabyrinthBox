// =============================================================================
//  The Lure   (entity id: 'lure')
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
const { chain, eyeball, haloMat, sprite, V } = __mod['src/phobia/models_a.js'];
const { clamp, ellipsoid, glowMat, lerp, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { face, fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, faceYaw, inBeam, PL, place, spotAround, strike } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 12  THE LURE (thalassophobia)
function buildLure() {
  const rig = new Rig({ ...HUMAN });
  const t = organic('angler', { base: '#2a3034', dark: '#0a0c0e', light: '#4a5458', veins: 0.4, vein: '#1a2a3a', pores: 0.7, poreF: 50, wrinkle: 0.6, wrinkleF: 40, mottle: 0.8 });
  const skin = fleshMat(t, { rough: 0.25, bumpScale: 2.6 });
  const body = new THREE.Group(); rig.root.add(body);
  const add = (g, m = skin, parent = body) => { const me = new THREE.Mesh(g, m); me.castShadow = true; parent.add(me); return me; };
  // a head that is mostly mouth, rising out of black water
  add(xf(ellipsoid(0.7, 0.55, 0.75), { y: 0, z: 0 }));
  const jaw = new THREE.Group(); jaw.position.set(0, -0.15, 0.2); body.add(jaw);
  add(xf(ellipsoid(0.72, 0.35, 0.8), { y: -0.2, z: 0.15 }), skin, jaw);
  const gullet = skinMat('#050203', { rough: 0.2 });
  add(xf(ellipsoid(0.6, 0.18, 0.62), { y: -0.18, z: 0.35 }), gullet);
  const tooth = skinMat('#d8e0e0', { rough: 0.1, transparent: true, opacity: 0.85 });
  const tu = [], tl = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 25 - 0.5) * 3.0, len = 0.1 + Math.abs(Math.sin(i * 3.7)) * 0.22;
    tu.push(xf(new THREE.ConeGeometry(0.012, len, 4), { x: Math.sin(a) * 0.62, y: -0.2 - len / 2, z: 0.2 + Math.cos(a) * 0.6, rx: Math.PI + 0.3 }));
    tl.push(xf(new THREE.ConeGeometry(0.012, len * 0.9, 4), { x: Math.sin(a) * 0.6, y: -0.05 + len / 2, z: 0.35 + Math.cos(a) * 0.62, rx: -0.3 }));
  }
  add(merge(tu), tooth); add(merge(tl), tooth, jaw);
  for (const s of [-1, 1]) { const e = eyeball(0.05, '#7a8a8a', { milky: true }); e.position.set(s * 0.42, 0.25, 0.48); body.add(e); }
  // the illicium: a stalk arcing forward with the glowing bulb
  const stalkRoot = new THREE.Group(); stalkRoot.position.set(0, 0.45, 0.3); body.add(stalkRoot);
  const stalk = chain(stalkRoot, 8, 0.16, 0.025, 0.012, skin, [0, 1, 0]);
  const tip = stalk[stalk.length - 1];
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), glowMat('#bff8ff'));
  bulb.position.y = 0.2; tip.add(bulb);
  const glow = sprite(haloMat('#8ff0ff').map, 0x8ff0ff, 1.6, 0.55); glow.material.blending = THREE.AdditiveBlending; bulb.add(glow);
  rig.finalize();
  return result(rig, {
    kind: 'lure', height: 2.0, radius: 0.7, eyeY: 0.5, body, bulb, glow,
    animate(st, dt) {
      st.t += dt;
      const rise = clamp(st.rise || 0, 0, 1);
      body.position.y = lerp(-1.4, 0.15, rise) + Math.sin(st.t * 0.9) * 0.05;
      body.rotation.x = -rise * 0.25;
      jaw.rotation.x = rise * 0.25 + (st.attack || 0) * 0.7;
      // the stalk bobs the bulb in slow, inviting circles; it stays at eye level even with the body sunk
      stalk.forEach((g, i) => { g.rotation.x = 0.18 + Math.sin(st.t * 0.8 + i * 0.4) * 0.05 + (1 - rise) * (i < 2 ? -0.1 : 0.02); g.rotation.z = Math.sin(st.t * 0.6 + i * 0.3) * 0.06; });
      stalkRoot.position.y = 0.45 + (1 - rise) * 0.9;
      glow.material.opacity = 0.45 + Math.sin(st.t * 2.1) * 0.1;
    },
    sketchPose(st) { st.rise = 1; this.animate(st, 0.1); },
    anchors(key) { const v = V(); if (key === 'head') bulb.getWorldPosition(v); else if (key === 'chest') jaw.getWorldPosition(v); else body.getWorldPosition(v); return v; },
  });
}


__mod['src/entities/registry.js'].BUILDERS.lure = buildLure;

// 12 --------------------------------------------------------------- THE LURE
D.lure = {
  name: 'The Lure', speed: 0.7, chase: 1.6, detect: 30, dmg: 42, reach: 1.9, cd: 3, memory: 30, voice: 'gurgle', noAttack: true, silent: true, xray: true,
  num: 'Φ-12 · Thalassophobia', cls: 'Lethal', size: 'unknown; the mouth alone is 1.5 m wide',
  desc: 'A soft light bobbing just above the black water, like a lamp someone left floating. Under it is a mouth.',
  notes: 'It drifts toward warm things in the water, slowly, keeping only its light above the surface. When it is close enough it rises and bites. Bright light in its face sends it back down.',
  tips: ['Never walk toward a light in the water.', 'Shine your flashlight at the bulb to drive it off.', 'Stay out of deep water when you can.'],
  sketch: [['head', 'the bulb'], ['chest', 'needle teeth'], ['foot', 'mostly submerged']],
  init(m, e) { e.st.rise = 0; e.mode = 'drift'; e.modeT = 0; },
  frame(m, e, dt, d, looked) {
    e.modeT += dt;
    const pl = PL(m);
    if (e.mode === 'rise') {
      e.st.rise = Math.min(1, e.st.rise + dt * 2.5); e.speed = 0; e.yaw = faceYaw(m, e); e.threat = 1;
      if (e.st.rise >= 1 && !e.bit) { e.bit = true; e.st.attack = 1; if (d < 2.6) strike(m, e, e.def.dmg, 2); m.game.audio.entity(e.type, 'attack', e.pos, pl); }
      if (e.modeT > 1.6) { e.mode = 'sink'; e.modeT = 0; e.bit = false; e.st.attack = 0; }
      return 'static';
    }
    if (e.mode === 'sink') { e.st.rise = Math.max(0, e.st.rise - dt * 1.2); if (e.st.rise <= 0) { e.mode = 'drift'; e.modeT = 0; const s = spotAround(m, -1, 14, 24, false, 2); if (s) place(m, e, s[0], s[1]); } return 'static'; }
    if (inBeam(m, e, looked, d, 0.85) && d < 16) { e.lit = (e.lit || 0) + dt; if (e.lit > 1.1) { e.lit = 0; e.mode = 'sink'; m.game.audio.entity(e.type, 'voice', e.pos, pl); m.game.bus.emit('banish', e.type); } }
    if (d < 2.8 && e.modeT > 1.5) { e.mode = 'rise'; e.modeT = 0; }
    e.threat = d < 8 ? 0.5 : 0;
    return null;
  },
  think(m, e) { if (e.mode === 'drift') chaseTo(m, e); },
};

})();
