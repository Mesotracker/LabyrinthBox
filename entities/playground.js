// =============================================================================
//  PLAYGROUND PACK creatures   (ids: pg_lifeguard, pg_mascot, pg_attendant,
//                                    pg_bouncer, pg_ringmaster)
//
//  The Playground keeps the original lineup, and dresses it for the party: same senses and
//  habits as the creatures they come from (they inherit the base creature's behaviour
//  flags), painted in flat park colours. Models are built by core/mutate.js.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const { ENTITY_DEFS, BUILDERS } = __mod['src/entities/registry.js'];
const { mutated } = __mod['src/entities/mutate.js'];
const VOICES = __mod['src/phobia/entities.js'].VOICES;

const variant = (id, base, build, def, voice) => {
  BUILDERS[id] = mutated(base, { flat: true, ...build });
  ENTITY_DEFS[id] = { ...ENTITY_DEFS[base], rare: false, pack: 'playground', voice, ...def };
  VOICES[id] = voice;
};

variant('pg_lifeguard', 'skinstealer', { tint: ['#f2c230', '#e0392b', '#f4efe2', '#e0392b'] }, {
  name: 'The Lifeguard', speed: 1.1, chase: 3.1, detect: 13, dmg: 30, reach: 1.55, cd: 1.3, memory: 7,
  num: 'Ω · Skin Stealer, in uniform', cls: 'Hostile', size: '~2.0 m',
  desc: 'A tall figure in a red and yellow lifeguard kit, a whistle round its neck. It is always watching the water. It has started watching you.',
  notes: 'Patrols the pools and slides and notices anyone who is out of the water when they should not be. Its whistle carries a long way, and what answers it is never another lifeguard.',
  tips: ['Do not stand still where it can see you.', 'The whistle means it has found you. Run.', 'It does not swim well. Deep water is safer than the deck.'],
}, 'shush');

variant('pg_mascot', 'stature', { tint: ['#ff8fc0', '#ffd23a', '#6ad0ff'] }, {
  name: 'The Mascot', speed: 0.9, chase: 3.5, detect: 28, dmg: 45, reach: 2.4, cd: 1.8, memory: 10,
  num: 'Ω · The Stature, in costume', cls: 'Lethal', size: '3.4 m standing',
  desc: 'A towering pink and yellow figure in a smooth, smiling suit. There is no head under it. Nobody knows what it is mascot of.',
  notes: 'Frozen while watched and fast when not, like the Stature it is wearing. It waves. It is never, at any distance, waving at someone else.',
  tips: ['Wave back, and keep your eyes on it.', 'Back away without turning.', 'Low ceilings slow it.'],
}, 'chime');

variant('pg_attendant', 'mannequin', { tint: ['#4aa8ff', '#f4efe2'] }, {
  name: 'The Attendant', speed: 0, chase: 5.6, detect: 24, dmg: 30, reach: 1.4, cd: 1.1, memory: 45,
  num: 'Ω · Mannequin, on duty', cls: 'Hostile', size: '~1.8 m',
  desc: 'A ticket booth attendant in a blue cap and a pressed shirt, standing at the head of a queue that is not there. Its smile has been painted on.',
  notes: 'Moves only when unobserved, as every Mannequin does. It is found at ride entrances and always facing the way you are about to go.',
  tips: ['Keep it in view. Walk backwards if you have to.', 'Never turn your back on an empty ride entrance.'],
}, 'musicbox');

variant('pg_bouncer', 'crawler', { arms: 2, tint: ['#ff7a3a', '#7a4aff'] }, {
  name: 'The Bouncer', speed: 1.4, chase: 6.3, detect: 14, dmg: 25, reach: 1.4, cd: 1.0, memory: 4,
  num: 'Ω · Crawler, in the ball pit', cls: 'Lethal', size: '~2 m across, six limbs',
  desc: 'A bright orange and purple thing that lives in ball pits and under trampolines. It bounces on four of its arms and reaches with the rest.',
  notes: 'Peeks, retreats when watched and then bursts in a single run, the way a Crawler does. Where it bounces the floor rings like a drum.',
  tips: ['Do not let it settle in your blind spot.', 'It cannot be outrun in the open. Be near a door.'],
}, 'giggle');

variant('pg_ringmaster', 'howler', { heads: 1, tint: ['#d83a3a', '#f4efe2', '#2a2a8a'] }, {
  name: 'The Ringmaster', speed: 1.3, chase: 4.7, detect: 9, dmg: 30, reach: 1.55, cd: 1.2, memory: 4,
  num: 'Ω · Howler, ringside', cls: 'Hostile', size: '~2.1 m, two heads',
  desc: 'A Howler in a red coat and a top hat, with a second head wearing a smaller one. It announces everything it does.',
  notes: 'Hunts by sound like the original Howler. Both heads shout at once when it finds you, and every creature in earshot comes to see the show.',
  tips: ['Make no noise near a big top.', 'Once it has called, leave the area. Everything else heard it too.'],
}, 'call');

__mod['src/pack/playground-entities.js'] = {};
})();
