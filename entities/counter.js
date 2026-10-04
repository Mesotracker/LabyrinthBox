// =============================================================================
//  The Counter   (entity id: 'counter')
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
const { humanSkin } = __mod['src/phobia/models_b.js'];
const { animateBiped, glowMat, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, headLift, HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, faceYaw, hunt, PL, place, spotAround, visibleToPlayer } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 34  THE COUNTER (arithmophobia)
function buildCounter() {
  const p = { ...HUMAN, hipH: 1.0, chestW: 0.36, headR: 0.12 };
  const rig = new Rig(p);
  const jT = cloth('jumpsuit', { base: '#a8581a', dark: '#3a1a08', stain: '#2a1a10', weave: 90, stains: 0.6, wear: 0.4 });
  const suit = skinMat('#b0b0b0', { map: jT.map, bump: jT.bump, bumpScale: 1, rough: 0.9 });
  const skin = humanSkin('counterskin', '#b8a090');
  buildBody(rig, p, { skin, top: suit, bottom: suit, arms: suit, shoes: skinMat('#1a1a1a', { rough: 0.6 }), hands: skin }, { sleeve: true });
  const hl = headLift(p);
  // a flip-number display where the head should be
  const head = new THREE.Group(); head.position.y = hl + 0.02; rig.head.add(head);
  head.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.3, 0.3, 0.22), {}), skinMat('#1a1a1c', { rough: 0.4 })));
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 256;
  const ct = new THREE.CanvasTexture(cv); ct.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(xf(new THREE.PlaneGeometry(0.26, 0.26), { z: 0.111 }), glowMat('#ffffff', { map: ct }));
  head.add(screen);
  let shown = null;
  const draw = (n) => {
    const g = cv.getContext('2d');
    g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#1a1a1a'; g.fillRect(16, 16, 224, 108); g.fillRect(16, 132, 224, 108);
    g.fillStyle = n <= 2 ? '#ff2a1a' : '#f0e6c8'; g.font = 'bold 200px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(n), 128, 140);
    g.fillStyle = '#000'; g.fillRect(0, 126, 256, 6);
    ct.needsUpdate = true;
  };
  draw(9);
  return result(rig, {
    kind: 'biped', height: 2.0, radius: 0.32, eyeY: 1.85,
    animate(st, dt) {
      st.stride = 1.4; st.lean = 0.05; st.armSwing = 0.4; st.grip = 0.5;
      animateBiped(rig, st, dt);
      const n = st.count ?? 9;
      if (n !== shown) { shown = n; draw(n); }
      head.rotation.z = st.chasing ? Math.sin(st.t * 20) * 0.05 : 0;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.counter = buildCounter;

// 34 --------------------------------------------------------------- THE COUNTER
D.counter = {
  name: 'The Counter', speed: 0, chase: 5.0, detect: 999, dmg: 36, reach: 1.45, cd: 1.1, memory: 999, xray: true, voice: 'beep', noLeash: true,
  num: 'Φ-34 · Arithmophobia', cls: 'Lethal', size: '2.0 m',
  desc: 'A worker in an orange jumpsuit with a flip-number display for a head. The number is counting down.',
  notes: 'Every time you look at it, the number goes down by one and it is somewhere else. At zero it comes for you. After a while the count resets — but never as high as before.',
  tips: ['Do not look at it. Seriously.', 'Look at the floor when you turn corners.', 'If it is at 1, keep your eyes on your feet.'],
  sketch: [['head', 'counting down'], ['chest', 'orange jumpsuit'], ['foot', 'somewhere else every time']],
  init(m, e) { e.count = 9; e.st.count = 9; e.mode = 'count'; e.modeT = 0; },
  frame(m, e, dt, d, looked) {
    e.modeT += dt;
    if (e.mode === 'count') {
      e.freeze = true;
      if (looked > 0 && d < 30) {
        e.seenT = (e.seenT || 0) + dt;
        if (e.seenT > 0.35 && !e.counted) {
          e.counted = true; e.count--; e.st.count = e.count; m.game.audio.entity(e.type, 'voice', e.pos, PL(m));
          if (e.count <= 0) { e.mode = 'hunt'; e.modeT = 0; e.freeze = false; m.alert(e); m.game.hud.flash('0', 1200); m.game.bus.emit('counterZero'); }
          else { m.game.hud.flash(String(e.count), 900); setTimeout(() => { const s = spotAround(m, 1, 10, 20, true, 1.2) || spotAround(m, -1, 10, 18); if (s && e.mode === 'count') place(m, e, s[0], s[1]); e.counted = false; e.seenT = 0; }, 700); }
        }
      } else if (!e.counted) e.seenT = 0;
      if (e.modeT > 30 && !visibleToPlayer(m, e.pos.x, e.pos.z)) { e.modeT = 0; const s = spotAround(m, 1, 12, 22, false, 1.2); if (s) place(m, e, s[0], s[1]); }
      e.yaw = faceYaw(m, e);
      e.threat = e.count <= 2 ? 0.5 : 0;
      return 'static';
    }
    e.threat = 1;
    if (e.modeT > 16) { e.mode = 'count'; e.modeT = 0; e.count = Math.max(3, 6 - Math.floor(m.time / 240)); e.st.count = e.count; e.counted = false; m.hide(e, 4); return 'skip'; }
    return null;
  },
  think(m, e) { if (e.mode === 'hunt') chaseTo(m, e); },
};

})();
