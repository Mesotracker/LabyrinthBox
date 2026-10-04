(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/phobia/ai.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
const { clamp: clamp, lerp: lerp } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS: ENTITY_DEFS, BUILDERS: BUILDERS } = __mod['src/entities/registry.js'];
// The Phobia Wing bestiary: one creature per fear. Each entry is a field-guide
// definition plus behaviour hooks the EntityManager calls:
//   init(m, e)                 once, after the model is built
//   think(m, e, d, sees)       a few times a second, replaces the generic AI
//   frame(m, e, dt, d, looked) every frame; 'skip' ends the entity's frame,
//                              'static' keeps it from walking its path
//   observe(m, e, looked, d)   true = frozen in place (and pose, with freezePose)
//   speedFn(m, e, want, d)     adjusts the walking speed
//   onHit(m, e)                after a successful hit
//   spawnFn(m, type, near, dmin, dmax, extra)  custom placement
// `voice` names a synth preset in audio.js; `sketch` labels the field-guide drawing.

const DARK = 0.12;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ helpers
const PL = (m) => m.game.player;
const ph = (m) => m.game.phobia;

function hunt(m, e, d, sees) {
  const P = PL(m).pos, def = e.def;
  if (sees) { if (e.state !== 'chase') m.alert(e); e.lost = 0; e.lastSeen = [P.x, P.z]; }
  else if (e.state === 'chase') { e.lost += 0.2; if (e.lost > def.memory) { e.state = 'search'; e.path = null; } }
  if (e.state === 'chase') m.route(e, P.x, P.z);
  else if (e.state === 'search' && e.lastSeen) {
    if (Math.hypot(e.lastSeen[0] - e.pos.x, e.lastSeen[1] - e.pos.z) < 1.2) { e.state = 'wander'; e.goal = null; e.idle = 1.5; }
    else if (!e.path) m.route(e, e.lastSeen[0], e.lastSeen[1]);
  } else if (!e.goal || e.idle > 0) m.wander(e);
}

function chaseTo(m, e) { const P = PL(m).pos; e.state = 'chase'; e.lastSeen = [P.x, P.z]; e.lost = 0; m.route(e, P.x, P.z); }

function visibleToPlayer(m, x, z, y = 1.4) { const pl = PL(m); return m.world.visible(pl.pos.x, pl.eyeY, pl.pos.z, x, y, z); }

function place(m, e, x, z) { e.pos.x = x; e.pos.z = z; e.path = null; e.goal = null; m.sampleLight(e, true); }

/** A walkable spot in a cone ahead of (dir 1) or behind (dir -1) the player. */
function spotAround(m, dir, dmin, dmax, hidden = true, spread = 0.9) {
  const pl = PL(m), P = pl.pos;
  const fx = -Math.sin(pl.yaw) * dir, fz = -Math.cos(pl.yaw) * dir;
  for (let k = 0; k < 6; k++) {
    const a = Math.atan2(fx, fz) + (m.rng.next() - 0.5) * spread * 2;
    const dd = dmin + m.rng.next() * (dmax - dmin);
    const s = m.nav.randomSpot(P.x + Math.sin(a) * dd, P.z + Math.cos(a) * dd, 0, 2.5, m.rng, (x, z) => {
      const r = Math.hypot(x - P.x, z - P.z);
      if (r < dmin * 0.7) return false;
      return hidden ? !visibleToPlayer(m, x, z) : true;
    });
    if (s) return s;
  }
  return null;
}

/** Flashlight squarely on the entity? */
function inBeam(m, e, looked, d, k = 0.86) {
  const pl = PL(m);
  return pl.flashlightOn && looked > k && d < pl.stats.flashDistance * 0.85;
}

function faceYaw(m, e) { const P = PL(m).pos; return Math.atan2(P.x - e.pos.x, P.z - e.pos.z); }

function strike(m, e, dmg, push = 3) {
  const pl = PL(m);
  pl.damage(dmg * (e.dmgMul || 1), e);
  m.game.audio.entity(e.type, 'hit', e.pos, pl);
  if (push) { const dx = pl.pos.x - e.pos.x, dz = pl.pos.z - e.pos.z, l = Math.hypot(dx, dz) || 1; pl.vel.x += dx / l * push; pl.vel.z += dz / l * push; }
  if (e.def.onHit) e.def.onHit(m, e);
}

/** Generic "lunge along a line" used by pounces and strikes. Returns true while lunging. */
function lunge(m, e, dt) {
  const L = e.lungeS;
  if (!L) return false;
  L.t += dt;
  const u = Math.min(1, L.t / L.dur);
  const nx = lerp(L.x0, L.x1, u), nz = lerp(L.z0, L.z1, u);
  if (m.nav.segmentClear(e.pos.x, e.pos.z, nx, nz, 0.2)) { e.pos.x = nx; e.pos.z = nz; }
  else L.t = L.dur;
  e.speed = L.speed;
  const pl = PL(m);
  if (!L.hit && Math.hypot(pl.pos.x - e.pos.x, pl.pos.z - e.pos.z) < e.def.reach + 0.3) { L.hit = true; strike(m, e, e.def.dmg, 4); }
  if (L.t >= L.dur) { e.lungeS = null; return false; }
  return true;
}

function startLunge(m, e, dist, dur, speed) {
  const P = PL(m).pos;
  const a = Math.atan2(P.x - e.pos.x, P.z - e.pos.z);
  e.yaw = a;
  e.lungeS = { x0: e.pos.x, z0: e.pos.z, x1: e.pos.x + Math.sin(a) * dist, z1: e.pos.z + Math.cos(a) * dist, t: 0, dur, speed, hit: false };
  e.path = null;
}

// ------------------------------------------------------------------ definitions
const D = {};

__e['DARK'] = DARK;
__e['TAU'] = TAU;
__e['PL'] = PL;
__e['ph'] = ph;
__e['hunt'] = hunt;
__e['chaseTo'] = chaseTo;
__e['visibleToPlayer'] = visibleToPlayer;
__e['place'] = place;
__e['spotAround'] = spotAround;
__e['inBeam'] = inBeam;
__e['faceYaw'] = faceYaw;
__e['strike'] = strike;
__e['lunge'] = lunge;
__e['startLunge'] = startLunge;
__e['D'] = D;
  return __e;
})();
})();
