// ============================================================================
// The browser globals the game expects (audio, images, storage) and a clock it
// can be stepped by: no real time passes, every frame is 16.7 ms, so a test
// runs as fast as the machine can generate the world.
// ============================================================================
const noop = () => {};

export function installGlobals() {
  const g = globalThis;
  if (g.__globalsInstalled) return g.__clock;
  g.__globalsInstalled = true;

  g.Audio = function () {
    return { play: () => Promise.resolve(), pause: noop, addEventListener: noop, load: noop, cloneNode() { return g.Audio(); }, volume: 1, currentTime: 0, loop: false, paused: true };
  };
  g.Image = function () { return { addEventListener: noop, set src(v) { /* never loads */ }, width: 1, height: 1 }; };

  const param = () => ({ value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop, setTargetAtTime: noop, cancelScheduledValues: noop });
  const node = (extra = {}) => Object.assign({ connect: () => node(), disconnect: noop, start: noop, stop: noop, addEventListener: noop }, extra);
  g.AudioContext = function () {
    return {
      destination: node(), currentTime: 0, state: 'running', sampleRate: 48000,
      listener: { positionX: param(), positionY: param(), positionZ: param(), forwardX: param(), forwardY: param(), forwardZ: param(), upX: param(), upY: param(), upZ: param(), setPosition: noop, setOrientation: noop },
      resume: () => Promise.resolve(), suspend: () => Promise.resolve(), close: () => Promise.resolve(),
      createGain: () => node({ gain: param() }),
      createOscillator: () => node({ frequency: param(), detune: param(), type: 'sine' }),
      createBufferSource: () => node({ buffer: null, playbackRate: param(), loop: false, loopStart: 0, loopEnd: 0 }),
      createBuffer: (ch, len) => ({ getChannelData: () => new Float32Array(len || 8), length: len || 8, duration: 1, sampleRate: 48000, numberOfChannels: ch || 1 }),
      createBiquadFilter: () => node({ frequency: param(), Q: param(), gain: param(), type: 'lowpass' }),
      createDynamicsCompressor: () => node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }),
      createStereoPanner: () => node({ pan: param() }),
      createPanner: () => node({ positionX: param(), positionY: param(), positionZ: param(), setPosition: noop, setOrientation: noop, refDistance: 1, maxDistance: 1, rolloffFactor: 1, panningModel: '', distanceModel: '' }),
      createConvolver: () => node({ buffer: null }),
      createDelay: () => node({ delayTime: param() }),
      createWaveShaper: () => node({ curve: null, oversample: 'none' }),
      createAnalyser: () => node({ fftSize: 2048, frequencyBinCount: 1024, getByteFrequencyData: noop, getFloatTimeDomainData: noop }),
      createChannelMerger: () => node(), createChannelSplitter: () => node(),
      decodeAudioData: () => Promise.resolve({ getChannelData: () => new Float32Array(8) }),
    };
  };
  g.webkitAudioContext = g.AudioContext;
  g.matchMedia = () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop });
  g.screen = { width: 1920, height: 1080, orientation: { lock: () => Promise.resolve(), addEventListener: noop } };
  g.innerWidth = 1920; g.innerHeight = 1080; g.devicePixelRatio = 1;
  g.CustomEvent = function (t, o) { return { type: t, detail: o && o.detail }; };
  g.Event = function (t) { return { type: t }; };
  g.Blob = function (parts) { this.parts = parts; };
  g.URL = { createObjectURL: () => 'blob:playtest', revokeObjectURL: noop };
  g.fetch = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}), text: () => Promise.resolve('') });

  const store = new Map();
  g.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i],
    get length() { return store.size; },
  };

  // ---- the clock: frames and timers only move when pump() says so ----------
  let now = 0;
  let rafQ = [];
  let timers = [];
  let intervals = [];
  let nextId = 1;
  g.performance = { now: () => now };
  g.requestAnimationFrame = (fn) => { rafQ.push(fn); return rafQ.length; };
  g.cancelAnimationFrame = noop;
  g.setTimeout = (fn, ms = 0) => { const id = nextId++; timers.push({ id, fn, at: now + (ms || 0) }); return id; };
  g.clearTimeout = (id) => { timers = timers.filter((t) => t.id !== id); };
  g.setInterval = (fn, ms = 16) => { const id = nextId++; intervals.push({ id, fn, every: ms || 16, next: now + (ms || 16) }); return id; };
  g.clearInterval = (id) => { intervals = intervals.filter((h) => h.id !== id); };
  global.setTimeout = g.setTimeout;        // the game calls the bare functions
  global.setInterval = g.setInterval;
  global.clearTimeout = g.clearTimeout;
  global.clearInterval = g.clearInterval;

  const onError = [];
  const clock = {
    get now() { return now; },
    onError(fn) { onError.push(fn); },
    /** Run n frames: requestAnimationFrame callbacks, then any timer that is due. */
    pump(n = 1) {
      for (let i = 0; i < n; i++) {
        now += 16.7;
        const q = rafQ; rafQ = [];
        for (const fn of q) { try { fn(now); } catch (e) { onError.forEach((f) => f('frame', e)); } }
        const due = timers.filter((t) => t.at <= now);
        timers = timers.filter((t) => t.at > now);
        for (const t of due) { try { t.fn(); } catch (e) { onError.forEach((f) => f('timer', e)); } }
        for (const h of intervals.slice()) while (h.next <= now) { h.next += h.every; try { h.fn(); } catch (e) { onError.forEach((f) => f('interval', e)); } }
      }
    },
    /** Like pump(), but lets the game's awaited promises run between frames. */
    async settle(n = 1) {
      for (let i = 0; i < n; i++) { clock.pump(1); await new Promise((r) => process.nextTick(r)); }
    },
  };
  g.__clock = clock;
  return clock;
}
