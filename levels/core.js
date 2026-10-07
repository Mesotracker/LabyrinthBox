// ============================================================================
// LEVEL REGISTRY  -  the small glue that turns levels/<pack>/<level>.js files
// into the level list the game runs.
//
// A level pack is a folder under levels/. Each folder has:
//   _pack.js          (optional) things the pack's levels need: item names,
//                     furniture sets, ...   LabLevels.packExtra(...)
//   <level>.js        one file per level.   LabLevels.add('folder', {...})
//
// levels/packs.js lists the packs and the load order of their level files, and
// levels/loader.js loads them all with plain <script> tags, so everything works
// when index.html is opened straight from disk (file://).
//
// Nothing in this file needs editing to add levels: see levels/README.md, or
// open other/level-studio.html to build a level in a form.
// ============================================================================
(function () {
  'use strict';

  var packs = [];          // pack metadata, in load order
  var byFolder = {};       // folder -> pack metadata
  var levels = {};         // folder -> [level definition, in file order]
  var extras = {};         // folder -> pack extras
  var missing = [];        // files the browser could not load

  function folderOf(p) { return p.folder || p.id; }

  /** Register a pack (levels/packs.js). `files` is the load order of levels/<folder>/. */
  function pack(o) {
    if (!o || !o.id) { warn('a pack entry in levels/packs.js has no id'); return; }
    var folder = folderOf(o);
    var entry = { folder: folder };
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) entry[k] = o[k];
    packs.push(entry);
    byFolder[folder] = entry;
    if (!levels[folder]) levels[folder] = [];
    return entry;
  }

  /** Register a level (called by every count in levels/<pack>/*.js). */
  function add(folder, def) {
    if (typeof folder !== 'string' || !def) { warn('LabLevels.add needs a pack folder and a level object'); return null; }
    if (!levels[folder]) levels[folder] = [];
    var id = def.id || '(no id)';
    if (!def.id) warn('a level in levels/' + folder + '/ has no id - it cannot be saved or selected');
    else if (find(id)) warn('two levels share the id "' + id + '" - rename one of them');
    if (!def.stages || !def.stages.length) warn('level "' + id + '" has no stages: there is nothing to do in it');
    if (!def.gen) warn('level "' + id + '" has no gen: the game does not know how to build its world');
    levels[folder].push(def);
    return def;
  }

  /** Register pack-wide extras (item names, furniture sets, ...). */
  function packExtra(folder, extra) {
    if (!extras[folder]) extras[folder] = {};
    var e = extras[folder];
    if (extra.items) { e.items = e.items || {}; for (var k in extra.items) e.items[k] = extra.items[k]; }
    if (extra.props) { e.props = e.props || {}; for (var k in extra.props) e.props[k] = extra.props[k]; }
    if (extra.mats) { e.mats = e.mats || {}; for (var k in extra.mats) e.mats[k] = extra.mats[k]; }
    return e;
  }

  function find(id) {
    for (var f in levels) for (var i = 0; i < levels[f].length; i++) if (levels[f][i].id === id) return levels[f][i];
    return null;
  }

  function warn(msg) {
    if (window.console && console.warn) console.warn('[levels] ' + msg);
  }

  /** A red note in the corner of the page, so a missing file is visible without the console. */
  function showError(text) {
    function put() {
      var box = document.getElementById('level-load-error');
      if (!box) {
        box = document.createElement('div');
        box.id = 'level-load-error';
        box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:520px;padding:10px 12px;' +
          'font:12px/1.5 monospace;color:#ffd7d7;background:rgba(30,6,6,.94);border:1px solid #7a2a2a;border-radius:6px;' +
          'box-shadow:0 6px 20px rgba(0,0,0,.5)';
        (document.body || document.documentElement).appendChild(box);
      }
      box.textContent = text;
    }
    if (document.body) put();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', put);
  }

  /** A <script> tag the loader wrote could not be found on disk. */
  function missingFile(path) {
    missing.push(path);
    warn('could not load ' + path + ' - is the file name listed in levels/packs.js spelled exactly right?');
    showError('Level file missing: ' + (missing.length > 1 ? missing.length + ' files, first is ' + missing[0] : path) +
      ' (see the browser console for the full list)');
  }

  /** Every pack, its folder and the levels that registered into it. */
  function stats() {
    var out = [];
    packs.forEach(function (p) {
      out.push({ id: p.id, folder: folderOf(p), name: p.name || p.id, count: (levels[folderOf(p)] || []).length, files: (p.files || []).length });
    });
    return out;
  }

  window.LabLevels = {
    packs: packs,
    levels: levels,
    extras: extras,
    missing: missing,
    pack: pack,
    add: add,
    packExtra: packExtra,
    find: find,
    stats: stats,
    missingFile: missingFile,
    showError: showError,
    loaded: false,
    version: 1,
  };
})();
