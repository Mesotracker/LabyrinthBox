// =============================================================================
//  The Restless Dead   (entity id: 'mourner')
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
const { animateBiped, canvasTex, clamp, latheGeo, lerp, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, face, fleshMat, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, PL, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 10  THE RESTLESS DEAD (necrophobia)
const corpseFace = () => tex('corpseface', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#9aa29a', ['#6a7268', '#b8bcb0', '#5a4a5a']);
  for (const x of [0.34, 0.66]) {
    const r = g.createRadialGradient(w * x, h * 0.42, 2, w * x, h * 0.42, w * 0.12);
    r.addColorStop(0, '#0a0808'); r.addColorStop(0.5, '#2a2228'); r.addColorStop(1, 'rgba(70,60,70,0)');
    g.fillStyle = r; g.beginPath(); g.ellipse(w * x, h * 0.42, w * 0.12, h * 0.1, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(210,214,200,0.9)'; g.beginPath(); g.ellipse(w * x, h * 0.43, w * 0.03, h * 0.012, 0, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = '#100608'; g.beginPath(); g.ellipse(w * 0.5, h * 0.75, w * 0.11, h * 0.09, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#b8b098'; for (let i = 0; i < 7; i++) g.fillRect(w * (0.41 + i * 0.026), h * 0.67, w * 0.018, h * 0.03);
}));


function buildMourner(rng) {
  const p = { ...HUMAN, chestW: 0.32, armR: 0.7, legR: 0.68, headR: 0.11 };
  const rig = new Rig(p);
  const t = organic('corpse', { base: '#8a948c', dark: '#4a5250', light: '#b0b8ae', veins: 0.85, vein: '#3a3a5a', pores: 0.4, mottle: 0.85, wrinkle: 0.4, patches: rng && rng.chance(0.5) ? 3 : 0 });
  const skin = fleshMat(t, { rough: 0.6, bumpScale: 1.6 });
  const shT = cloth('shroud', { base: '#c8c0ac', dark: '#7a7060', stain: '#5a3a2a', weave: 60, stains: 0.8, wear: 0.6 });
  const shroud = skinMat('#b0b0b0', { map: shT.map, bump: shT.bump, bumpScale: 1.3, rough: 0.95, side: THREE.DoubleSide });
  buildBody(rig, p, { skin, top: skin, bottom: shroud, shoes: skin }, { fingerLen: 0.09, chestDepth: 0.5, ribs: true, neckR: 0.8 });
  headOn(rig, p, skin, 0.95, 1.15, 1.05);
  face(rig, p, null, skinMat('#ffffff', { map: corpseFace(), rough: 0.6 }), { sx: 0.95 });
  // Y-incision stitched shut
  const st2 = [];
  for (let i = 0; i < 12; i++) st2.push(xf(new THREE.BoxGeometry(0.03, 0.004, 0.004), { y: 0.02 + i * 0.03, z: p.chestW * 0.44, rz: (i % 2 ? 0.3 : -0.3) }));
  rig.attach(rig.chest, merge(st2), skinMat('#1a1010', { rough: 0.7 }), { rigid: true, shadow: false });
  // a toe tag
  rig.attach(rig.legs[0].an, xf(new THREE.BoxGeometry(0.05, 0.002, 0.03), { y: -0.06, z: 0.2, rx: 0.4 }), skinMat('#d8d0b8', { rough: 0.8 }), { rigid: true, shadow: false });
  const wrap = rig.attach(rig.hips, latheGeo([[-0.5, 0.2], [-0.2, 0.2], [0.05, 0.18]], 0.75, 18), shroud, { rigid: true });
  void wrap;
  const pivot = rig.body;
  return result(rig, {
    kind: 'biped', height: 1.8, radius: 0.32, eyeY: 1.6,
    animate(st, dt) {
      const lie = clamp(st.lying ?? 0, 0, 1);
      st.lean = 0.35; st.hunch = 0.3; st.stride = 1.25; st.armsOut = 0.3; st.grip = 0.6; st.tilt = 0.35;
      animateBiped(rig, st, dt);
      // lying flat on its back; it sits up and gets to its feet as `lying` falls
      pivot.rotation.x = -lie * Math.PI / 2;
      pivot.position.y = lie * 0.15;
      pivot.position.z = -lie * 0.9;
      if (lie > 0.05) {
        for (const L of rig.legs) { L.hip.rotation.x = lerp(L.hip.rotation.x, 0, lie); L.kn.rotation.x = lerp(L.kn.rotation.x, 0.05, lie); }
        for (const A of rig.arms) { A.sh.rotation.x = lerp(A.sh.rotation.x, 0, lie); A.sh.rotation.z = A.side * 0.15 * lie; }
        rig.head.rotation.y = lerp(rig.head.rotation.y, 0.6, lie);
      }
      if (st.twitch) rig.arms[1].el.rotation.x -= Math.max(0, Math.sin(st.t * 23)) * 0.4;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.mourner = buildMourner;

// 10 --------------------------------------------------------------- THE RESTLESS DEAD
D.mourner = {
  name: 'The Restless Dead', speed: 1.1, chase: 3.6, detect: 8, dmg: 22, reach: 1.35, cd: 1.1, memory: 7, voice: 'groan',
  num: 'Φ-10 · Necrophobia', cls: 'Hostile', size: '1.8 m',
  desc: 'Bodies under sheets, on gurneys, on the floor. Grey skin, a stitched Y down the chest, a tag on one toe. Most of them are only bodies.',
  notes: 'Some are not. They wake when someone walks close or runs nearby, sit up all at once and come shambling after you. When they lose you they lie down again wherever they are — and you cannot tell which ones they were.',
  tips: ['Give every body a wide berth.', 'Never run past a row of them.', 'If one twitches, it is awake.'],
  sketch: [['head', 'sunken eyes'], ['chest', 'autopsy stitches'], ['foot', 'toe tag']],
  init(m, e) { e.st.lying = 1; e.mode = 'dead'; e.sleeper = m.rng.next() < 0.35; },
  frame(m, e, dt, d) {
    e.modeT = (e.modeT || 0) + dt;
    if (e.mode === 'dead') { e.st.lying = Math.min(1, e.st.lying + dt * 0.8); e.speed = 0; e.st.twitch = !e.sleeper && d < 6 && Math.sin(m.time * 3 + e.pos.x) > 0.95; return 'static'; }
    if (e.mode === 'rise') { e.st.lying = Math.max(0, e.st.lying - dt * 0.9); e.speed = 0; e.st.twitch = true; e.threat = 0.7; if (e.st.lying <= 0) { e.mode = 'hunt'; e.modeT = 0; m.alert(e); } return 'static'; }
    e.st.twitch = false;
    return null;
  },
  think(m, e, d, sees) {
    const pl = PL(m);
    if (e.mode === 'dead') {
      if (e.sleeper) return;
      if ((d < 3.3 && pl.stance === 'stand') || (pl.sprinting && d < 9) || d < 1.6) { e.mode = 'rise'; e.modeT = 0; m.game.audio.entity(e.type, 'alert', e.pos, pl); }
      return;
    }
    if (e.mode === 'hunt') {
      hunt(m, e, d, sees);
      if (e.state === 'wander' && e.modeT > 6) { e.mode = 'dead'; e.modeT = 0; e.path = null; e.yaw = m.rng.next() * TAU; }
    }
  },
};

})();
