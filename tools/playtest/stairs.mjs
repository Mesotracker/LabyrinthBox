// ============================================================================
// STAIR SHAFT TEST. Every Playground stair level is one narrow stairwell: the
// whole level is the climb, so if a flight is missing or a landing does not line
// up the level cannot be finished. This walks each shaft from the bottom landing
// to the door at the top, one short step at a time, and lets the game's own
// collision decide how high the player ends up.
//
//   node tools/playtest/stairs.mjs            every level with a stairshaft goal
//   node tools/playtest/stairs.mjs pg27       one level
// ============================================================================
import { bootGame } from './boot.mjs';

const b = bootGame();
if (!b.game) { console.log('BOOT FAILED'); process.exit(1); }
const { game, clock, LEVELS, input, problems } = b;

const asked = process.argv.slice(2);
const list = (asked.length ? LEVELS.filter((l) => asked.includes(l.id))
  : LEVELS.filter((l) => (l.stages || []).some((s) => s.goal === 'stairshaft')));
if (!list.length) { console.log('no level with a stair shaft'); process.exit(1); }

console.log(`stair shafts: ${list.length} level(s)\n`);
let bad = 0;

for (const lv of list) {
  game.state = 'menu';
  game.enter(lv.id).catch((e) => problems.push({ kind: 'enter', msg: String(e) }));
  let n = 0;
  while (game.state === 'loading' && n++ < 6000) await clock.settle(1);
  game.state = 'play';
  input.locked = true;

  const goal = game.objectives.goals.find((g) => g.type === 'stairshaft');
  if (!goal) { console.log(`FAIL ${lv.id}: no stair shaft was built`); bad++; continue; }
  const flights = Math.max(2, 2 * Math.round((goal.opts.flights || 6) / 2));
  const rise = Math.max(2.2, goal.opts.rise || 2.8);
  const c = Math.cos(goal.rot), s = Math.sin(goal.rot);
  const world = (a, bl) => [goal.x + a * c + bl * s, goal.z - a * s + bl * c];   // the shaft's own axes

  const pl = game.player;
  const [sx, sz] = world(-0.55, 3.2);
  pl.pos.set(sx, game.world.groundAt(sx, sz), sz);
  pl.vel.set(0, 0, 0);
  await clock.settle(4);

  let fell = 0;
  for (let k = 0; k < flights; k++) {
    const lane = k % 2 === 0 ? -0.55 : 0.55;          // flights alternate sides of the spine wall
    const from = k % 2 === 0 ? 2.9 : -2.9;
    for (let i = 0; i <= 40; i++) {
      const lz = from - (from * 2) * (i / 40);
      const [wx, wz] = world(lane, lz);
      const was = pl.pos.y;
      pl.pos.set(wx, pl.pos.y, wz);
      pl.vel.set(0, 0, 0);
      await clock.settle(2);
      if (pl.pos.y < was - 0.4) fell++;
    }
  }

  const want = flights * rise;
  const ok = pl.pos.y > want - 0.35 && !fell;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${lv.id.padEnd(6)} ${String(flights).padStart(2)} flight(s) x ${rise} m: ` +
    `climbed to ${pl.pos.y.toFixed(2)} m of ${want.toFixed(2)} m${fell ? `, fell off ${fell} time(s)` : ''}`);
}

console.log(`\n${list.length - bad}/${list.length} shaft(s) can be climbed`);
for (const p of problems.slice(0, 6)) console.log('  ! ' + p.kind + ': ' + String(p.msg).slice(0, 240));
process.exit(bad ? 1 : 0);
