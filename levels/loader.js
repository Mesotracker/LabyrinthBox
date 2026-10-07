// ============================================================================
// LEVEL LOADER  -  loads levels/core.js, levels/packs.js and then every level
// file listed by the packs, with plain <script> tags so the game also runs when
// index.html is opened straight from disk (file://).
//
// Why it is written in three steps: a <script> tag written with document.write
// does NOT run while the script that wrote it is still running - the parser
// runs it afterwards, in document order. So this file writes core.js and
// packs.js first, then a tiny inline script that calls back into step 2 (which
// by then can read the pack list), and step 2 writes one tag per level file
// plus a final inline script for the sanity check in step 3.
//
// Normally you never edit this file. To add a pack or a level, edit
// levels/packs.js - see levels/README.md.
// ============================================================================
(function () {
  'use strict';

  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*$/, '') : 'levels/';

  function write(html) { document.write(html); }

  /** <script src="levels/..."> - `watch` reports a file that is listed but missing. */
  function load(rel, watch) {
    var err = watch ? ' onerror="window.LabLevels&&LabLevels.missingFile(\'' + rel + '\')"' : '';
    write('<script src="' + base + rel + '"' + err + '><\/script>');
  }

  /** <script>LabLevelLoader.step(n)<\/script> - runs once the tags above it have run. */
  function callback(step) {
    write('<script>window.LabLevelLoader&&window.LabLevelLoader.step(' + step + ');<\/script>');
  }

  function fail(msg) {
    if (window.console && console.error) console.error('[levels] ' + msg);
    if (window.LabLevels && LabLevels.showError) LabLevels.showError(msg);
  }

  // --- step 2: the pack list exists now, so write a tag per level file -------
  function loadLevelFiles() {
    var LL = window.LabLevels;
    if (!LL) {
      fail('levels/core.js did not load - the game needs the levels/ folder next to index.html');
      return;
    }
    if (!LL.packs.length) {
      fail('levels/packs.js loaded no packs - every pack is one LabLevels.pack({...}) call in that file');
      return;
    }
    LL.packs.forEach(function (p) {
      var dir = p.folder || p.id;
      (p.files || []).forEach(function (f) { load(dir + '/' + f, true); });
    });
    callback(3);
  }

  // --- step 3: every level file has run, so the counts must match -----------
  function checkCounts() {
    var LL = window.LabLevels;
    if (!LL) return;
    LL.packs.forEach(function (p) {
      var dir = p.folder || p.id;
      var files = (p.files || []);
      var want = files.length - (files.indexOf('_pack.js') >= 0 ? 1 : 0);
      var got = (LL.levels[dir] || []).length;
      if (want !== got && window.console && console.warn) {
        console.warn('[levels] pack "' + p.id + '" lists ' + want + ' level file(s) but ' + got +
          ' level(s) registered - check levels/' + dir + '/ against the file list in levels/packs.js');
      }
    });
    LL.loaded = true;
  }

  window.LabLevelLoader = {
    base: base,
    step: function (n) { if (n === 2) loadLevelFiles(); else if (n === 3) checkCounts(); },
  };

  // --- step 1 ---------------------------------------------------------------
  load('core.js');
  load('packs.js');
  callback(2);
})();
