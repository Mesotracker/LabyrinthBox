// ============================================================================
// PLAYTHROUGH TEST. Boots the game, enters levels for real (world generation,
// goals, loot, entities, lighting) and then walks the objective chain: stand at
// each goal, use it, wait for the stage to finish. Every exception the game
// throws - in a frame, in a timer, in an await - is reported.
//
//   node tools/playtest/play.mjs                 a few levels from every pack
//   node tools/playtest/play.mjs playground      one pack
//   node tools/playtest/play.mjs pg02            one level
//   node tools/playtest/play.mjs all             all 135 (slow: ~20 s each)
//
// Puzzle stages that need a code, a colour order or a lucky guess (keypads,
// ordered valves, "pick the safe slide", "pick the right window") cannot be
// solved by a script: they are reported as "did not finish", which is expected.
// ============================================================================
import { bootGame } from './boot.mjs';

const PUZZLE = /code|in order|Pick a slide|Pick the|window that leads/i;

const b = bootGame();
if (!b.game) {
  console.log('BOOT FAILED');
  for (const p of b.problems) console.log('  ' + p.kind + ': ' + p.msg.slice(0, 400));
  process.exit(1);
}
const { game, clock, LEVELS, problems } = b;

const arg = process.argv[2] || 'sample';
let list;
if (arg === 'all') list = LEVELS;
else if (LEVELS.some((l) => (l.track || 'main') === arg)) list = LEVELS.filter((l) => (l.track || 'main') === arg);
else if (arg === 'sample') list = ['main', 'phobia', 'corruption', 'playground'].flatMap((t) => LEVELS.filter((l) => (l.track || 'main') === t).slice(0, 2));
else list = LEVELS.filter((l) => l.id === arg);
if (!list.length) { console.log('no level or pack called "' + arg + '"'); process.exit(1); }

console.log(`playthrough: ${list.length} level(s)\n`);
let bad = 0;

for (const lv of list) {
  const before = problems.length;
  const t0 = Date.now();
  const notes = [];
  try {
    game.state = 'menu';
    game.enter(lv.id).catch((e) => problems.push({ kind: 'enter', msg: (e && e.stack || String(e)).split('\n').slice(0, 5).join(' | ') }));
    let n = 0;
    while (game.state === 'loading' && n++ < 6000) await clock.settle(1);
    if (game.state === 'loading') { problems.push({ kind: 'enter', msg: 'still loading after 6000 frames' }); continue; }

    const obj = game.objectives;
    const pl = game.player;
    game.state = 'play';
    b.input.locked = true;

    let guard = 0;
    while (!obj.finished && game.state !== 'complete' && guard++ < 40) {
      const st = obj.stage;
      if (!st) break;
      const idx = obj.index;
      const targets = st.targets.filter((t) => !t.done && t.goal);
      if (targets.length) {
        for (const t of targets) {
          pl.pos.set(t.x + 1.0, game.world.groundAt(t.x + 1.0, t.z), t.z);
          pl.vel.set(0, 0, 0);
          await clock.settle(6);
          let tries = 0, used = false;
          while (!t.done && obj.index === idx && tries++ < 8) {
            const cands = [];
            obj.candidates(pl.pos.x, pl.pos.z, cands);
            const hit = cands.find((c) => !/Locked|Read the note/.test(c.text));
            if (hit) { hit.use(); used = true; }
            let w = 0;
            while (!t.done && w++ < 200 && obj.index === idx) await clock.settle(1);
          }
          if (!used) { notes.push(`stage ${idx} "${st.def.text}": nothing left to use`); break; }
        }
      } else {
        obj.finishStage();          // fetch-the-item and survive stages: skipped
      }
      let w = 0;
      while (obj.index === idx && !obj.finished && w++ < 400) await clock.settle(1);
      if (obj.index === idx && !obj.finished) { notes.push(`stage ${idx} "${st.def.text}" did not finish`); break; }
    }
    await clock.settle(60);
  } catch (e) {
    problems.push({ kind: 'throw', msg: (e && e.stack || String(e)).split('\n').slice(0, 5).join(' | ') });
  }

  const mine = problems.slice(before);
  const puzzle = notes.length && notes.every((n) => PUZZLE.test(n));
  const fail = mine.length > 0 || (notes.length && !puzzle);
  if (fail) bad++;
  const obj = game.objectives;
  const tag = fail ? 'FAIL' : (puzzle ? 'puzz' : 'ok  ');
  console.log(`${tag} ${(lv.track || 'main')}/${lv.id.padEnd(10)} ${String(Date.now() - t0).padStart(6)}ms  ` +
    `stages ${obj.index + (obj.finished ? 1 : 0)}/${obj.stages.length}${obj.finished ? ' finished' : ''}`);
  for (const m of mine.slice(0, 6)) console.log('      ' + m.kind + ': ' + m.msg.slice(0, 300));
  for (const n of notes) console.log('      note: ' + n + (puzzle ? ' (puzzle input - a script cannot solve it)' : ''));
}

console.log(`\n${list.length - bad}/${list.length} level(s) ran without an error`);
if (b.warnings.length) {
  console.log('warnings: ' + b.warnings.length);
  [...new Set(b.warnings)].slice(0, 12).forEach((w) => console.log('  ? ' + w.slice(0, 200)));
}
process.exit(bad ? 1 : 0);
