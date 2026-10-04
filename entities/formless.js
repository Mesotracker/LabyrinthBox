// =============================================================================
//  The Formless   (entity id: 'formless')
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
const { V } = __mod['src/phobia/models_b.js'];
const { Rig } = __mod['src/entities/rig.js'];
const { HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, hunt, PL } = __mod['src/phobia/ai.js'];
const { BUILDERS } = __mod['src/entities/registry.js'];

// ------------------------------------------------------------------ 30  THE FORMLESS (panophobia)
function buildFormless(rng) {
  const rig = new Rig({ ...HUMAN });
  const forms = ['weaver', 'jester', 'revenant', 'goodboy', 'porcelain', 'umbra'].map((t) => BUILDERS[t](rng));
  for (const f of forms) { rig.root.add(f.root); f.root.visible = false; }
  let cur = 0, glitch = 0;
  forms[0].root.visible = true;
  rig.finalize();
  const out = result(rig, {
    kind: 'shift', height: 2.0, radius: 0.45, eyeY: 1.8, forms,
    setForm(i) { forms[cur].root.visible = false; cur = (i + forms.length) % forms.length; forms[cur].root.visible = true; glitch = 0.35; this.radius = forms[cur].radius; this.eyeY = forms[cur].eyeY; },
    curForm() { return cur; },
    animate(st, dt) {
      forms[cur].animate(st, dt);
      if (glitch > 0) {
        glitch -= dt;
        const r = forms[cur].root;
        r.scale.set(1 + (Math.random() - 0.5) * 0.4, 1 + (Math.random() - 0.5) * 0.3, 1 + (Math.random() - 0.5) * 0.4);
        r.position.x = (Math.random() - 0.5) * 0.15;
        if (glitch <= 0) { r.scale.set(1, 1, 1); r.position.x = 0; }
      }
    },
  });
  // materials of every form, so lighting reaches all of them
  out.mats = []; out.glows = [];
  rig.root.traverse((o) => {
    if (!o.isMesh && !o.isSprite) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) { if (m.isMeshBasicMaterial || m.isSpriteMaterial) { if (!out.glows.includes(m)) out.glows.push(m); } else if (!out.mats.includes(m)) out.mats.push(m); }
  });
  out.anchors = (key) => { const v = V(); const f = forms[cur]; if (f.anchors) return f.anchors(key); const b = key === 'head' ? f.rig.head : key === 'chest' ? f.rig.chest : key === 'hand' ? f.rig.arms[0].wr : f.rig.legs[0].an; return b.getWorldPosition(v); };
  return out;
}


// 30 --------------------------------------------------------------- THE FORMLESS
const FORM_STATS = [
  { speed: 4.6, voice: 'chitter' }, { speed: 5.0, voice: 'giggle' }, { speed: 1.6, voice: 'wail', ghost: true },
  { speed: 5.2, voice: 'bark' }, { speed: 5.0, voice: 'musicbox', statue: true }, { speed: 3.8, voice: 'hush' },
];

__mod['src/entities/registry.js'].BUILDERS.formless = buildFormless;

D.formless = {
  name: 'The Formless', speed: 1.2, chase: 4.0, detect: 16, dmg: 30, reach: 1.5, cd: 1.1, memory: 10, voice: 'shift',
  num: 'Φ-30 · Panophobia', cls: 'Lethal', size: 'whatever you fear',
  desc: 'It is a spider. It is a clown. It is a woman in a nightgown, a dog, a doll, a shadow. It keeps changing its mind.',
  notes: 'Every few seconds it takes a new shape and the rules change with it: the doll freezes when watched, the ghost walks through walls, the dog runs. It always keeps the worst parts.',
  tips: ['Watch for the glitch when it changes, and re-read it.', 'Doll form: keep it in view. Ghost form: keep moving.', 'Everything else: run.'],
  sketch: [['head', 'changes'], ['chest', 'changes'], ['foot', 'changes']],
  init(m, e) { e.formT = 4; },
  observe(m, e, looked) { return FORM_STATS[e.model.curForm()].statue && looked > 0; },
  frame(m, e, dt, d) {
    e.formT -= dt;
    if (e.formT <= 0) { e.formT = 6 + m.rng.next() * 6; let n; do { n = Math.floor(m.rng.next() * FORM_STATS.length); } while (n === e.model.curForm()); e.model.setForm(n); m.game.audio.entity('formless', 'voice', e.pos, PL(m)); m.game.player.addTrauma(0.15); }
    if (e.model.mats) for (const mm of e.model.mats) mm.transparent = mm.transparent || false;
    return null;
  },
  speedFn(m, e, want) { return e.state === 'chase' ? FORM_STATS[e.model.curForm()].speed * m.diff.speed : want; },
  think(m, e, d, sees) {
    const f = FORM_STATS[e.model.curForm()];
    if (f.ghost) { chaseTo(m, e); e.path = [[PL(m).pos.x, PL(m).pos.z]]; return; }
    hunt(m, e, d, sees);
  },
};

})();
