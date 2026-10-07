// ============================================================================
// MENU TEST. Boots the game, opens the pack dock, installs every bonus pack,
// builds the level grid of each pack and starts a level the way the menu does.
// Catches the kind of break that only shows on the start screen: a pack with no
// levels, a missing blurb, a level card that cannot be drawn.
//
//   node tools/playtest/menu.mjs
// ============================================================================
import { bootGame } from './boot.mjs';

const b = bootGame();
if (!b.game) {
  console.log('BOOT FAILED');
  for (const p of b.problems) console.log('  ' + p.kind + ': ' + p.msg.slice(0, 400));
  process.exit(1);
}
const { game, clock, LEVELS, PACKS, save, dom, problems } = b;
const byId = dom.byId;

console.log('booted with ' + LEVELS.length + ' level(s) in ' + PACKS.length + ' pack(s): ' + PACKS.map((p) => p.id).join(', '));

game.ui.showStart();
clock.pump(3);

// the pack dock
game.ui.dockOpen = true;
game.ui.buildDock();
clock.pump(3);
const dockBody = byId.get('dock-body');
const rows = dockBody ? dockBody.children.filter((c) => c.classList.contains('pack-row')) : [];
console.log('pack dock: ' + rows.length + ' installable pack(s) (' + rows.map((r) => r.dataset.pack).join(', ') + ')');
for (const r of rows) {
  const button = r.children.find((c) => c.tagName === 'BUTTON');
  if (button && !button.disabled && button.onclick) button.onclick();
}
clock.pump(400);                       // the install animation takes four seconds
const installed = PACKS.filter((p) => save.isInstalled(p.id)).map((p) => p.id);
console.log('installed: ' + installed.join(', '));
if (installed.length !== PACKS.length) problems.push({ kind: 'dock', msg: 'not every pack installed: ' + installed.join(', ') });

// the level grid of every pack
const list = byId.get('level-list');
for (const p of PACKS) {
  game.ui.pack = p.id;
  game.ui.selected = '';
  try { game.ui.buildLevels(); } catch (e) {
    problems.push({ kind: 'buildLevels ' + p.id, msg: (e && e.stack || String(e)).split('\n').slice(0, 3).join(' | ') });
    continue;
  }
  clock.pump(2);
  const cards = (list ? list.children : []).filter((c) => c.classList.contains('level-card'));
  const want = LEVELS.filter((l) => (l.track || 'main') === p.id).length;
  console.log(`  ${p.id.padEnd(11)} ${String(want).padStart(3)} level(s), ${cards.length} card(s)`);
  if (cards.length !== want) problems.push({ kind: 'grid ' + p.id, msg: `${want} levels but ${cards.length} cards` });
}

// starting and leaving a level through the menu
game.ui.pack = 'main';
game.ui.selected = LEVELS[0].id;
game.ui.buildLevels();
clock.pump(2);
game.onStart(LEVELS[0].id);
let n = 0;
while (game.state === 'loading' && n++ < 6000) await clock.settle(1);
console.log('entered ' + LEVELS[0].id + ' from the menu: state=' + game.state);
if (game.state === 'loading') problems.push({ kind: 'menu start', msg: 'the level never finished loading' });
game.quit();
clock.pump(5);
console.log('quit back to the menu: state=' + game.state);

console.log('\nproblems: ' + problems.length);
for (const p of problems.slice(0, 15)) console.log('  ! ' + p.kind + ': ' + p.msg.slice(0, 300));
console.log('warnings: ' + b.warnings.length);
[...new Set(b.warnings)].slice(0, 10).forEach((w) => console.log('  ? ' + w.slice(0, 200)));
process.exit(problems.length ? 1 : 0);
