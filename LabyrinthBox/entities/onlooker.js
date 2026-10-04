// =============================================================================
//  The Onlooker   (entity id: 'onlooker')
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
const { animateBiped, canvasTex, clamp, Rig, skinMat } = __mod['src/entities/rig.js'];
const { buildBody, face, headLift, headOn, HUMAN, noiseFill, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { eyeball } = __mod['src/phobia/models_a.js'];
const { chaseTo, D, faceYaw, hunt, ph, PL, place, spotAround, visibleToPlayer } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 20  THE ONLOOKER (scopophobia)
const eyeSkin = () => tex('eyeskin', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#b89a8a', ['#7a5a4a', '#d8bcac', '#5a3a3a']);
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = 6 + Math.random() * 16, a = Math.random() * Math.PI;
    g.save(); g.translate(x, y); g.rotate(a);
    g.fillStyle = '#4a2a2a'; g.beginPath(); g.ellipse(0, 0, r * 1.5, r * 0.75, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#efe6d6'; g.beginPath(); g.ellipse(0, 0, r * 1.3, r * 0.6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = ['#3a5a2a', '#5a3a1a', '#2a4a7a', '#6a6a6a'][i % 4]; g.beginPath(); g.arc((Math.random() - 0.5) * r * 0.6, 0, r * 0.45, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#050505'; g.beginPath(); g.arc((Math.random() - 0.5) * r * 0.3, 0, r * 0.2, 0, Math.PI * 2); g.fill();
    g.restore();
  }
}));


function buildOnlooker() {
  const p = { ...HUMAN, hipH: 1.15, thigh: 0.55, shin: 0.55, chestW: 0.36, armR: 0.8, legR: 0.75, upperArm: 0.4, foreArm: 0.4, headR: 0.15 };
  const rig = new Rig(p);
  const skin = skinMat('#ffffff', { map: eyeSkin(), rough: 0.35 });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.12, chestDepth: 0.62 });
  headOn(rig, p, skin, 1.1, 1.1, 1.0);
  const hl = headLift(p);
  // one huge eye for a face, and real eyeballs set into the body that all turn to you
  const big = eyeball(0.11, '#5a7a3a'); big.position.set(0, hl, 0.08); rig.head.add(big);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.116, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), skinMat('#8a6a5a', { rough: 0.6 }));
  lid.position.copy(big.position); rig.head.add(lid);
  const eyes = [big];
  const host = [rig.chest, rig.chest, rig.chest, rig.spine, rig.spine, rig.arms[0].sh, rig.arms[1].sh, rig.arms[0].el, rig.arms[1].el, rig.legs[0].hip, rig.legs[1].hip, rig.head, rig.head];
  host.forEach((b, i) => {
    const e = eyeball(0.025 + (i % 3) * 0.01, ['#3a5a2a', '#5a3a1a', '#2a4a7a'][i % 3]);
    const a = (i * 2.4) % (Math.PI * 2);
    e.position.set(Math.sin(a) * 0.12, b === rig.head ? hl + 0.08 : (b === rig.chest ? 0.1 + (i % 3) * 0.08 : -0.05), Math.cos(a) * 0.12 + 0.03);
    b.add(e); eyes.push(e);
  });
  const tmp = new THREE.Vector3(), q = new THREE.Quaternion(), m = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0);
  let blink = 0;
  return result(rig, {
    kind: 'biped', height: 2.3, radius: 0.34, eyeY: 2.1, eyes,
    animate(st, dt) {
      st.lean = 0.02; st.hunch = 0.1; st.stride = 1.4; st.armSwing = 0.3; st.grip = 0.3; st.tilt = 0.15;
      animateBiped(rig, st, dt);
      blink -= dt;
      if (blink < -0.15) blink = 2 + Math.random() * 4;
      lid.rotation.x = blink < 0 ? Math.PI * 0.5 : -0.3 - (st.stare || 0) * 0.6;
      // every eyeball turns to the target (world space, written by the AI)
      if (st.target) {
        rig.root.updateMatrixWorld(true);
        for (const e of eyes) {
          e.getWorldPosition(tmp);
          m.lookAt(st.target, tmp, up);
          q.setFromRotationMatrix(m);
          const parentQ = e.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
          e.quaternion.copy(parentQ.multiply(q));
        }
      }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.onlooker = buildOnlooker;

// 20 --------------------------------------------------------------- THE ONLOOKER
D.onlooker = {
  name: 'The Onlooker', speed: 0, chase: 4.6, detect: 999, dmg: 34, reach: 1.45, cd: 1.2, memory: 10, xray: true, voice: 'stare', noLeash: true,
  num: 'Φ-20 · Scopophobia', cls: 'Hostile', size: '2.3 m',
  desc: 'A figure covered in eyes — real ones, wet, every colour — with one enormous eye for a face. All of them turn to look at you at once.',
  notes: 'It does nothing but stare. While it can see you, the feeling of being watched builds; staring back makes it build faster. Let it fill and every eye closes at once — and it is right behind you.',
  tips: ['Break its line of sight: walls, corners, doors.', 'Do not stare back.', 'The WATCHED meter drains when nothing can see you.'],
  sketch: [['head', 'one great eye'], ['chest', 'eyes in the skin'], ['hand', 'they all turn to you']],
  spawnFn(m, type, near) { const s = spotAround(m, 1, 14, 26, false, 1.4); return s ? m.make(type, s[0], s[1]) : null; },
  init(m, e) { e.mode = 'watch'; e.modeT = 0; },
  frame(m, e, dt, d, looked) {
    const pl = PL(m), P = pl.pos;
    e.modeT += dt;
    e.st.target = m.game.engine.camera.position;
    if (e.mode === 'watch') {
      e.freeze = true;
      const sees = d < 40 && m.world.visible(e.pos.x, 2.0, e.pos.z, P.x, pl.eyeY, P.z);
      e.seesP = sees;
      if (ph(m) && sees) ph(m).bumpWatched(dt * (looked > 0 ? 0.11 : 0.055) * m.diff.detect);
      e.st.stare = sees ? 1 : 0;
      e.yaw = faceYaw(m, e);
      // reposition when it has lost you for a while
      e.lostT = sees ? 0 : (e.lostT || 0) + dt;
      if (e.lostT > 9) { e.lostT = 0; const s = spotAround(m, 1, 14, 24, false, 1.3); if (s && !visibleToPlayer(m, s[0], s[1], 2)) place(m, e, s[0], s[1]); }
      if (ph(m) && ph(m).watched >= 1) {
        ph(m).watched = 0.2;
        const s = spotAround(m, -1, 2.5, 4, false, 0.4);
        if (s) place(m, e, s[0], s[1]);
        e.mode = 'hunt'; e.modeT = 0; e.freeze = false; m.alert(e); pl.addTrauma(0.5);
      }
      return 'static';
    }
    if (e.mode === 'hunt' && e.modeT > 7) { e.mode = 'watch'; e.modeT = 0; m.hide(e, 4); return 'skip'; }
    e.threat = e.mode === 'hunt' ? clamp(1 - d / 15, 0, 1) : 0;
    return null;
  },
  think(m, e) { if (e.mode === 'hunt') chaseTo(m, e); },
};

})();
