// =============================================================================
//  CORRUPTION PACK creatures   (ids: mut_chorus, mut_splice, mut_thicket,
//                                    mut_sprawl, mut_fractured, mut_drowned)
//
//  The original levels were left to rot for a thousand years, and so was everything in
//  them. Each creature here is an existing one that has gone wrong: same senses and the
//  same habits (they inherit the base creature's behaviour flags), but more limbs, more
//  heads, and a body that no longer holds still. Models are built by core/mutate.js.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const { ENTITY_DEFS, BUILDERS } = __mod['src/entities/registry.js'];
const { mutated } = __mod['src/entities/mutate.js'];
const VOICES = __mod['src/phobia/entities.js'].VOICES;

const variant = (id, base, build, def, voice) => {
  BUILDERS[id] = mutated(base, build);
  ENTITY_DEFS[id] = { ...ENTITY_DEFS[base], rare: false, pack: 'corruption', voice, ...def };
  VOICES[id] = voice;
};

variant('mut_chorus', 'smiler', { heads: 2, arms: 2, tint: ['#9aa89a'], stretch: { arms: 1.3 }, jitter: 0.02, hs: 1.06 }, {
  name: 'The Chorus', speed: 0.9, chase: 2.3, detect: 8, dmg: 40, reach: 1.55, cd: 1.4, memory: 8,
  num: 'Δ · mutation of Entity 3', cls: 'Hostile', size: '~2.1 m, three heads',
  desc: 'A Smiler that was left in the dark too long. The grin split and grew back three times; every mouth is a little out of step with the others.',
  notes: 'Still only exists where the light fails, and still vanishes under working lights, but it is no longer quiet: the three mouths hum different notes, and you can hear it a long way before you can see it. Two of the arms are new.',
  tips: ['Treat the humming as a warning. It means the dark is close.', 'Stay under working lights, and do not trust a flickering one.', 'It is slower than the original. It has three heads to keep track of you with.'],
}, 'wail');

variant('mut_splice', 'skinstealer', { heads: 1, arms: 2, tint: ['#b8b4a0', '#8a8f78'], stretch: { arms: 1.15 }, jitter: 0.03 }, {
  name: 'The Splice', speed: 1.1, chase: 3.0, detect: 12, dmg: 34, reach: 1.7, cd: 1.3, memory: 7,
  num: 'Δ · mutation of Skin Stealer', cls: 'Hostile', size: '~2.2 m',
  desc: 'A Skin Stealer wearing two faces and reaching with four arms. The second head does not seem to belong to it, and does not seem to be asleep.',
  notes: 'Behaves like the creature it grew from, but a thousand years of wearing other things has left it with too many of them. It reaches farther than it should, and it keeps reaching after you are past.',
  tips: ['Keep the whole body of a wall between you and it.', 'It can reach round a corner. Give corners a wide berth.'],
}, 'groan');

variant('mut_thicket', 'stature', { arms: 4, tint: ['#7f9a78', '#a8b49a'], stretch: { arms: 1.2 }, jitter: 0.02 }, {
  name: 'The Thicket', speed: 0.9, chase: 3.6, detect: 28, dmg: 45, reach: 2.6, cd: 1.8, memory: 10,
  num: 'Δ · mutation of The Stature', cls: 'Lethal', size: '3.4 m standing, six arms',
  desc: 'The Stature, overgrown. Moss has taken its shoulders and four extra arms have pushed out of its back, each as long as the first two.',
  notes: 'Frozen while watched and swift when not, exactly like the original. The extra arms never freeze: they keep moving, slowly, even while the rest of it stands perfectly still, which is the only way to tell it is there.',
  tips: ['If something in the corner of your eye is moving and nothing else is, it is that.', 'Glance at it, do not stare.', 'Low ceilings slow it.'],
}, 'creak');

variant('mut_sprawl', 'crawler', { arms: 4, legs: 2, tint: ['#a8a090'], stretch: { arms: 1.35 }, jitter: 0.03 }, {
  name: 'The Sprawl', speed: 1.4, chase: 6.2, detect: 14, dmg: 26, reach: 1.5, cd: 1.0, memory: 4,
  num: 'Δ · mutation of Crawler', cls: 'Lethal', size: '~2 m across, eight limbs',
  desc: 'A Crawler that never stopped growing. Too many arms, too many knees, and a way of arriving at a corner a moment before the sound does.',
  notes: 'Peeks, flees when seen, and then bursts, like the Crawler. It gets more reach out of that burst than anything that size should, and the extra limbs make its approach almost silent on a dry floor.',
  tips: ['Do not let it count your glances.', 'It retreats when you look. It comes back when you stop.', 'Do not run into an open space with it behind you.'],
}, 'chitter');

variant('mut_fractured', 'mannequin', { heads: 1, arms: 2, tint: ['#cfc8b8'], stretch: { arms: 1.25 }, jitter: 0.04 }, {
  name: 'The Fractured', speed: 0, chase: 5.6, detect: 24, dmg: 32, reach: 1.6, cd: 1.1, memory: 45,
  num: 'Δ · mutation of Mannequin', cls: 'Hostile', size: '~1.9 m, two heads',
  desc: 'A cracked mannequin with a second head glued on crooked and two spare arms fixed at the ribs. Hairline fractures run through all of it.',
  notes: 'Moves only when unobserved, like any Mannequin. Where the original keeps its stillness, this one cannot: it shivers whenever it is watched, as if something inside is trying to get out of the shell.',
  tips: ['Shivering means it is watched and holding. Keep looking.', 'Never turn your back on a room with one in it.', 'Two heads means two chances to catch it moving.'],
}, 'creak');

variant('mut_drowned', 'howler', { heads: 2, tint: ['#7f9aa8', '#9fb0b4'], stretch: { arms: 1.25 }, jitter: 0.02 }, {
  name: 'The Drowned Howler', speed: 1.3, chase: 4.6, detect: 9, dmg: 32, reach: 1.6, cd: 1.2, memory: 4,
  num: 'Δ · mutation of Howler', cls: 'Hostile', size: '~2.1 m, three heads',
  desc: 'A Howler that has spent a thousand years standing in water. It is grey, swollen and dripping, and it has three heads, all of which can howl.',
  notes: 'Hunts by sound like the original and shrieks like it when it finds you, but three heads means three times the noise, and it hears you over running water as easily as in a quiet room.',
  tips: ['Move quietly even where the water is loud.', 'The current helps it as much as it helps you.', 'Do not splash.'],
}, 'wail');

__mod['src/pack/corruption-entities.js'] = {};
})();
