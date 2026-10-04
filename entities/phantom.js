// =============================================================================
//  Phantom   (entity id: 'phantom')
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
const { D } = __mod['src/phobia/ai.js'];
const { BUILDERS } = __mod['src/entities/registry.js'];

BUILDERS.phantom = (rng) => { const opts = ['weaver', 'jester', 'revenant', 'goodboy', 'porcelain', 'onlooker', 'palestag', 'hive']; return BUILDERS[opts[Math.floor(Math.random() * opts.length)]](rng); };


D.phantom = {
  name: 'Phantom', speed: 0.5, chase: 0, detect: 0, dmg: 0, reach: 0, cd: 1, memory: 0, passive: true, peripheral: true, voice: 'hush', hideGuide: true,
  num: 'Φ-31 hallucination', cls: 'Passive', size: 'not real', desc: 'Not real.', notes: '', tips: [],
  frame(m, e, dt) { e.ttl -= dt; if (e.ttl <= 0) { m.dispose(e); const i = m.list.indexOf(e); if (i >= 0) m.list.splice(i, 1); return 'skip'; } return null; },
};
})();
