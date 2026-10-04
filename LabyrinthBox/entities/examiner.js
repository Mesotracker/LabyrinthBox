// =============================================================================
//  The Examiner   (entity id: 'examiner')
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
const { humanSkin, suitMat } = __mod['src/phobia/models_b.js'];
const { animateBiped, canvasTex, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, face, headOn, HUMAN, noiseFill, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, hunt, PL } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 25  THE EXAMINER (atychiphobia)
const examFace = () => tex('examface', () => canvasTex(512, 512, (g, w, h) => {
  noiseFill(g, w, h, '#d0c8bc', ['#a89e90', '#e8e0d4']);
  g.strokeStyle = '#b01010'; g.lineCap = 'round';
  // red marks all over: crosses, circles, a grade
  for (let i = 0; i < 9; i++) { const x = w * (0.2 + Math.random() * 0.6), y = h * (0.2 + Math.random() * 0.6), s = 18 + Math.random() * 22; g.lineWidth = 5; g.beginPath(); g.moveTo(x - s, y - s); g.lineTo(x + s, y + s); g.moveTo(x + s, y - s); g.lineTo(x - s, y + s); g.stroke(); }
  g.lineWidth = 6; g.beginPath(); g.ellipse(w * 0.5, h * 0.5, w * 0.3, h * 0.35, 0.2, 0, Math.PI * 1.9); g.stroke();
  g.fillStyle = '#b01010'; g.font = 'bold 120px Georgia, serif'; g.textAlign = 'center'; g.fillText('F', w * 0.5, h * 0.62);
}));


function buildExaminer() {
  const p = { ...HUMAN, hipH: 1.0, chestW: 0.36, headR: 0.115, neck: 0.12 };
  const rig = new Rig(p);
  const skin = humanSkin('examskin', '#c8b4a4');
  const suit = suitMat('greysuit', '#4a4c52');
  buildBody(rig, p, { skin, top: suit, bottom: suit, arms: suit, shoes: skinMat('#0a0a0a', { rough: 0.25 }), hands: skin }, { sleeve: true, chestDepth: 0.6 });
  headOn(rig, p, skin);
  face(rig, p, null, skinMat('#ffffff', { map: examFace(), rough: 0.6 }));
  rig.attach(rig.chest, xf(new THREE.PlaneGeometry(0.11, 0.3), { y: p.chestH * 0.62, z: p.chestW * 0.31 }), skinMat('#e8e4d8', { rough: 0.8 }), { rigid: true, shadow: false });
  rig.attach(rig.chest, xf(new THREE.BoxGeometry(0.035, 0.28, 0.01), { y: p.chestH * 0.55, z: p.chestW * 0.315 }), skinMat('#1a1a40', { rough: 0.5 }), { rigid: true, shadow: false });
  // clipboard in one hand, red pen in the other
  const board = new THREE.Group(); board.position.set(0, -0.12, 0.05); rig.arms[0].wr.add(board);
  board.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.24, 0.32, 0.01), { rx: -1.1, y: 0.05, z: 0.08 }), skinMat('#8a6a42', { rough: 0.7 })));
  board.add(new THREE.Mesh(xf(new THREE.BoxGeometry(0.21, 0.27, 0.004), { rx: -1.1, y: 0.06, z: 0.088 }), skinMat('#f2efe6', { rough: 0.9 })));
  const pen = new THREE.Mesh(xf(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 6), { y: -0.1, rx: 0.4 }), skinMat('#b01010', { rough: 0.4 }));
  rig.arms[1].wr.add(pen);
  return result(rig, {
    kind: 'biped', height: 1.95, radius: 0.32, eyeY: 1.8,
    animate(st, dt) {
      st.stride = 1.5; st.lean = -0.02; st.hunch = 0; st.armSwing = 0.2; st.grip = 0.7;
      animateBiped(rig, st, dt);
      const A = rig.arms[0]; A.sh.rotation.x = -0.6; A.el.rotation.x = -1.2;
      const B = rig.arms[1]; B.sh.rotation.x = -0.4 + (st.writing ? Math.sin(st.t * 14) * 0.08 : 0); B.el.rotation.x = -1.3;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.examiner = buildExaminer;

// 25 --------------------------------------------------------------- THE EXAMINER
D.examiner = {
  name: 'The Examiner', speed: 0.9, chase: 2.8, detect: 9, dmg: 30, reach: 1.4, cd: 1.3, memory: 9, voice: 'scribble',
  num: 'Φ-25 · Atychiphobia', cls: 'Hostile', size: '1.95 m',
  desc: 'A proctor in a grey suit with a clipboard and a red pen. Its face is an exam paper, marked all over in red.',
  notes: 'It hears every mistake. Turn a valve out of order, punch in the wrong code, get hurt, and it knows exactly where you are — and every mistake makes it faster. It does not forget.',
  tips: ['Read every note before you touch anything.', 'Slow and right beats fast and wrong.', 'Each mistake adds speed. It never goes back down.'],
  sketch: [['head', 'marked in red'], ['hand', 'clipboard'], ['chest', 'grey suit']],
  init(m, e) {
    e.fails = 0;
    e.off = m.game.bus.on('mistake', () => { e.fails++; const P = PL(m).pos; e.lastSeen = [P.x, P.z]; e.state = 'search'; e.path = null; m.game.audio.entity(e.type, 'alert', e.pos, PL(m)); });
  },
  speedFn(m, e, want) { return want * (1 + Math.min(1.1, e.fails * 0.18)); },
  frame(m, e) { e.st.writing = e.state !== 'chase'; return null; },
  think(m, e, d, sees) { hunt(m, e, d, sees); },
};

})();
