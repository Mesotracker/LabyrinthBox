(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
// Shared registries: every entity file adds its model builder to BUILDERS and
// its stats/behaviour entry to ENTITY_DEFS.
__mod['src/entities/registry.js'] = (function () {
  return { ENTITY_DEFS: {}, BUILDERS: {} };
})();
})();
