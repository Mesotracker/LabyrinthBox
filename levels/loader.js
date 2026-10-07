// ============================================================================
// LEVEL LOADER  -  loads levels/core.js, levels/packs.js and then every level
// file listed by the packs, with plain <script> tags so the game also runs when
// index.html is opened straight from disk (file://).
//
// Normally you never edit this file. To add a pack or a level, edit
// levels/packs.js - see levels/README.md.
// ============================================================================
(function () {
  'use strict';
  var base = document.currentScript.src.replace(/[^\/]*$/, '');

  function load(rel, watch) {
    var err = watch ? ' onerror="window.LabLevels&&LabLevels.missingFile(\'' + rel + '\')"' : '';
    document.write('<script src="' + base + rel + '"' + err + '><\/script>');
  }

  load('core.js');
  load('packs.js');

  var LL = window.LabLevels;
  if (!LL) {
    document.write('<script src="levels/core.js"><\/script>');   // try once more, then give up loudly
    if (!window.LabLevels) {
      console.error('[levels] levels/core.js did not load - the game needs the levels/ folder next to index.html');
      return;
    }
    LL = window.LabLevels;
  }

  LL.packs.forEach(function (p) {
    var dir = p.folder || p.id;
    (p.files || []).forEach(function (f) { load(dir + '/' + f, true); });
  });

  // Every level file has run by now (document.write during parsing is
  // synchronous), so a mismatch means a file that is listed but does not exist,
  // or a level whose script threw.
  LL.packs.forEach(function (p) {
    var dir = p.folder || p.id;
    var want = (p.files || []).length, got = (LL.levels[dir] || []).length;
    if (want !== got) console.warn('[levels] pack "' + p.id + '" lists ' + want + ' level file(s) but ' + got + ' level(s) registered');
  });
})();
