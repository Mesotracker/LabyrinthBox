// The original single-file game (everything before the levels were split into
// files) is the source the Corruption and Playground packs are regenerated from.
// It is not kept in the tree twice: it is read out of git, or from $LB_BEFORE.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT } from './bundle.mjs';

const COMMIT = process.env.LB_BEFORE_COMMIT || 'f3ca628';   // the commit the split started from

export function beforeFile(explicit) {
  const given = explicit || process.env.LB_BEFORE;
  if (given && fs.existsSync(given)) return given;
  const cache = path.join(ROOT, 'tools/levelcheck/data/original-index.html');
  if (fs.existsSync(cache)) return cache;
  let src;
  try {
    src = execFileSync('git', ['show', COMMIT + ':index.html'], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    throw new Error('could not read index.html at ' + COMMIT + ' from git (' + e.message + ').\n'
      + 'Pass the file instead:  node tools/levelcheck/snapshot.mjs /path/to/original-index.html');
  }
  fs.mkdirSync(path.dirname(cache), { recursive: true });
  fs.writeFileSync(cache, src);
  console.log('(read the original index.html from git commit ' + COMMIT + ')');
  return cache;
}
