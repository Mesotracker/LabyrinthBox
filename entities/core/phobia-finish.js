(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/phobia/entities.js'] = (function () {
  const __e = {};
const { ENTITY_DEFS: ENTITY_DEFS } = __mod['src/entities/registry.js'];
const { D: D } = __mod['src/phobia/ai.js'];
// ------------------------------------------------------------------ register
for (const [k, v] of Object.entries(D)) { v.phobia = true; ENTITY_DEFS[k] = v; }

/** Voice preset table read by the audio system. */
const VOICES = {};
for (const [k, v] of Object.entries(D)) VOICES[k] = v.voice;

__e['PHOBIA_DEFS'] = D;
__e['VOICES'] = VOICES;
  return __e;
})();
})();
