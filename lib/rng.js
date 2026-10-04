(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/core/rng.js'] = (function () {
  const __e = {};

// Deterministic hashing / random number utilities.
// Every procedural decision in the game flows through these so that a world
// is exactly reproducible from its seed.

function hashStr(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return mix32(h);
}

function mix32(h) {
  h = h >>> 0;
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15; h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return h >>> 0;
}

// Hash any number of integers into a uint32.
function hash32(a, b = 0, c = 0, d = 0) {
  let h = mix32((a | 0) ^ 0x9e3779b9);
  h = mix32(h ^ Math.imul((b | 0) + 0x632be5ab, 0x85ebca6b));
  h = mix32(h ^ Math.imul((c | 0) + 0x1b873593, 0xc2b2ae35));
  h = mix32(h ^ Math.imul((d | 0) + 0x27d4eb2f, 0x165667b1));
  return h;
}

// Hash to float in [0,1)
function hashf(a, b = 0, c = 0, d = 0) {
  return hash32(a, b, c, d) / 4294967296;
}

class RNG {
  constructor(seed) { this.s = (seed >>> 0) || 0x12345678; }
  next() {
    // mulberry32
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a, b) { return a + (b - a) * this.next(); }
  int(a, b) { return a + Math.floor(this.next() * (b - a + 1)); } // inclusive
  chance(p) { return this.next() < p; }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  sign() { return this.next() < 0.5 ? -1 : 1; }
  gauss() {
    let u = 0, v = 0;
    while (u === 0) u = this.next();
    v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  weighted(items, weightFn) {
    let total = 0;
    for (const it of items) total += weightFn(it);
    let r = this.next() * total;
    for (const it of items) { r -= weightFn(it); if (r <= 0) return it; }
    return items[items.length - 1];
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  fork(tag) { return new RNG(hash32(this.s, typeof tag === 'string' ? hashStr(tag) : tag)); }
}

// 2D value noise (continuous, deterministic) for CPU-side generation.
function smooth(t) { return t * t * (3 - 2 * t); }
function valueNoise2(seed, x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const fx = smooth(x - xi), fz = smooth(z - zi);
  const a = hashf(seed, xi, zi), b = hashf(seed, xi + 1, zi);
  const c = hashf(seed, xi, zi + 1), d = hashf(seed, xi + 1, zi + 1);
  return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fz;
}
function fbm2(seed, x, z, oct = 4) {
  let s = 0, amp = 0.5, n = 0, f = 1;
  for (let i = 0; i < oct; i++) {
    s += amp * valueNoise2(seed + i * 1013, x * f, z * f);
    n += amp; amp *= 0.5; f *= 2.03;
  }
  return s / n;
}

function randomSeed() {
  return (Math.floor(Math.random() * 0xffffffff) ^ Date.now()) >>> 0;
}

function seedFromInput(str) {
  str = String(str).trim();
  if (/^\d+$/.test(str)) return (Number(str) >>> 0);
  return hashStr(str);
}

__e['hashStr'] = hashStr;
__e['mix32'] = mix32;
__e['hash32'] = hash32;
__e['hashf'] = hashf;
__e['valueNoise2'] = valueNoise2;
__e['fbm2'] = fbm2;
__e['randomSeed'] = randomSeed;
__e['seedFromInput'] = seedFromInput;
__e['RNG'] = RNG;
  return __e;
})();

})();
