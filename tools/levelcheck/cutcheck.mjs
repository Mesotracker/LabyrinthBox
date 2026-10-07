// Draw every cut in a pack's levels on a small map and flag the shapes that tend to
// go wrong: a cut on top of the spawn, too much of the play area gone, or a hole so
// far away it is never found.
//
//   node tools/levelcheck/cutcheck.mjs            (the Corruption pack)
//   node tools/levelcheck/cutcheck.mjs playground
//   node tools/levelcheck/cutcheck.mjs base level0
import fs from 'node:fs';
import path from 'node:path';
import { readLevel, listLevels } from './levelio.mjs';
import { cutSurvey } from './cuts.mjs';
import { ROOT } from './bundle.mjs';

const pack = process.argv[2] || 'corrupt';
const only = process.argv[3];
const dir = path.join(ROOT, 'levels', pack);
if (!fs.existsSync(dir)) {
  console.error('no such pack folder: levels/' + pack);
  process.exit(2);
}

let files = listLevels(dir);
if (only) files = files.filter((f) => f.includes(only));
const files_ = files;
let bad = 0, withCuts = 0;
for (const f of files_) {
  const { def } = readLevel(path.join(dir, f));
  const s = cutSurvey(def);
  if (!s) {
    console.log('\n' + def.id.padEnd(6), f.padEnd(42), '(no cuts: ' + def.gen.type + (def.gen.mode ? '/' + def.gen.mode : '') + ')',
      'corrupt=' + (def.corrupt ?? '-'));
    continue;
  }
  withCuts++;
  let flag = '';
  if (s.spawnCut) flag += '  <<<< SPAWN AREA CUT';
  if (s.voidPct > 35) flag += '  <<<< too much void';
  if (s.nearest !== null && s.nearest > 24) flag += '  <<<< too far away to see (' + s.nearest.toFixed(1) + ' cells)';
  if (s.cuts.length && !s.fall) flag += '  <<<< cuts but fall is not set (falling off is survivable)';
  if (flag) bad++;
  console.log('\n' + def.id.padEnd(6), f.padEnd(42), 'cuts:', s.kinds,
    ' void=' + s.voidPct.toFixed(1) + '%',
    'nearest=' + (s.nearest === null ? '-' : s.nearest.toFixed(1) + ' cells'),
    'fall=' + s.fall, flag);
  console.log(s.rows.join('\n'));
}
console.log('\n' + withCuts + ' level(s) with cuts in levels/' + pack + ', ' + bad + ' with a problem');
process.exitCode = bad ? 1 : 0;
