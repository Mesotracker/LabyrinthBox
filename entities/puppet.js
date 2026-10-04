// =============================================================================
//   Stop-Motion Puppet   (entity id: 'puppet')
//
//   One self-contained entity file:
//     - the three.js model builder
//     - its stats / field-guide entry
//   Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//   Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { buildBody, cloth, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, ellipsoid, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * Stop-motion puppet (Level 94): Distressed felt, cracked clay, and exposed wire armature.
 * Features mismatched button eyes, caved-in fabric tears, exposed stuffing, and a 
 * gaping stitched maw. Animated with jerky 12 FPS stop-motion timing.
 */
function buildPuppet(rng) {
  const bear = rng && rng.chance(0.35);
  
  // Asymmetrical, slightly elongated biped parameters for uncanny proportions
  const p = bear
    ? { ...HUMAN, hipH: 0.52, thigh: 0.24, shin: 0.22, spine: 0.18, chestH: 0.28, neck: 0.05, shoulderW: 0.44, upperArm: 0.25, foreArm: 0.22, chestW: 0.48, armR: 1.7, legR: 1.8, headR: 0.22 }
    : { ...HUMAN, hipH: 0.85, thigh: 0.42, shin: 0.40, spine: 0.18, chestH: 0.32, neck: 0.07, shoulderW: 0.36, upperArm: 0.32, foreArm: 0.30, chestW: 0.34, armR: 1.15, legR: 1.1, headR: 0.25 };

  const rig = new Rig(p);

  // Weathered, grimy fabric & cracked porcelain clay materials
  const baseColour = bear ? '#5c3a1e' : rng ? rng.pick(['#8a2b22', '#224a7a', '#a67c1e', '#2c683b']) : '#8a2b22';
  const feltT = cloth('felt_distressed_' + baseColour + bear, { 
    base: baseColour, dark: '#120d0a', stain: '#180503', weave: bear ? 40 : 160, stains: 0.65, wear: 0.8 
  });
  const felt = skinMat('#a0a0a0', { map: feltT.map, bump: feltT.bump, bumpScale: bear ? 3.5 : 2.0, rough: 0.98 });
  const patchFelt = skinMat('#2a221b', { rough: 0.95, bumpScale: 1.8 });

  const clayT = organic('clay_cracked', { 
    base: '#c2a88f', dark: '#503828', light: '#d8c4b0', veins: 0.1, pores: 0.5, poreF: 40, mottle: 0.6, wrinkle: 0.5, wrinkleF: 25 
  });
  const clay = fleshMat(clayT, { rough: 0.85, bumpScale: 2.8, tint: '#b0a090' });
  const headMat = bear ? felt : clay;

  // Metal/Wood Armature & Thread Materials
  const metalWire = skinMat('#3a3a38', { rough: 0.4, metal: 0.8 });
  const stuffingCotton = skinMat('#e6dfd3', { rough: 1.0 });
  const buttonMat = skinMat('#0a0a08', { rough: 0.3 });
  const rustyNeedle = skinMat('#4a3525', { rough: 0.6, metal: 0.5 });
  const twineThread = skinMat('#1a120b', { rough: 0.95 });
  const voidDark = skinMat('#050202', { rough: 1.0 });

  // Base body construction
  buildBody(rig, p, 
    { skin: bear ? felt : clay, top: felt, bottom: felt, shoes: skinMat('#1a100a', { rough: 0.85 }), hands: bear ? felt : clay }, 
    { sleeve: true, fingerLen: 0.045, fingerR: 1.3, handScale: 1.3, footLen: 0.22 }
  );

  headOn(rig, p, headMat, 1, bear ? 0.95 : 1.08, 1);
  const hl = headLift(p);

  // --- SEAMS, PATCHES & EXPOSED ARMATURE ON BODY ---
  // Torso fabric patch & exposed stuffing tear (attached to rig.root)
  const chestPatch = xf(new THREE.PlaneGeometry(0.12, 0.16), { x: -0.06, y: p.hipH + p.spine + 0.12, z: p.chestW * 0.48, ry: 0.1 });
  rig.attach(rig.root, chestPatch, patchFelt, { rigid: true });

  const gutTear = xf(ellipsoid(0.05, 0.08, 0.04), { x: 0.07, y: p.hipH + p.spine - 0.05, z: p.chestW * 0.42 });
  rig.attach(rig.root, gutTear, stuffingCotton, { rigid: true });

  // Exposed armature wire poking through elbow tear
  const wireSpit = xf(new THREE.CylinderGeometry(0.004, 0.004, 0.12, 6), { x: p.shoulderW * 0.55, y: p.hipH + p.spine, z: 0, rz: 0.3 });
  rig.attach(rig.root, wireSpit, metalWire, { rigid: true });

  // --- HEAD HORROR FEATURES ---
  if (!bear) {
    // Scalp distortion / hair remnant
    rig.attach(rig.head, xf(ellipsoid(p.headR * 1.02, p.headR * 0.45, p.headR * 1.05), { y: hl + 0.12, z: -0.02 }), skinMat('#22140a', { rough: 0.95 }), { rigid: true });
  } else {
    // Stuffed bear ears with one torn and drooping
    for (const s of [-1, 1]) {
      const earAngle = s * 0.3 + (s === 1 ? 0.4 : 0);
      rig.attach(rig.head, xf(ellipsoid(0.07, 0.07, 0.03), { x: s * 0.15, y: hl + 0.16, rz: earAngle }), felt, { rigid: true });
    }
  }

  // Eye Sockets: Right Eye = Suspended hanging button; Left Eye = Hollowed Void
  // Right Eye (Button on loose thread)
  rig.attach(rig.head, xf(new THREE.CylinderGeometry(0.032, 0.032, 0.012, 12), { x: -0.075, y: hl + 0.03, z: p.headR * 0.96, rx: Math.PI / 2 + 0.2 }), buttonMat, { rigid: true, shadow: false });
  // Loose thread loop hanging down
  const threadHang = xf(new THREE.CylinderGeometry(0.002, 0.002, 0.08, 4), { x: -0.075, y: hl - 0.02, z: p.headR * 0.97, rz: 0.1 });
  rig.attach(rig.head, threadHang, twineThread, { rigid: true });

  // Left Eye (Caved-in hollow cavity with deep darkness and cotton)
  const leftCavity = xf(ellipsoid(0.045, 0.045, 0.03), { x: 0.075, y: hl + 0.04, z: p.headR * 0.90 });
  rig.attach(rig.head, leftCavity, voidDark, { rigid: true });
  const cavityCotton = xf(ellipsoid(0.025, 0.025, 0.02), { x: 0.072, y: hl + 0.035, z: p.headR * 0.89 });
  rig.attach(rig.head, cavityCotton, stuffingCotton, { rigid: true });

  // --- GAPING STITCHED MAW / MOUTH CAVITY ---
  // Dark caved-in mouth cavity
  const mouthVoid = xf(ellipsoid(0.11, 0.04, 0.05), { x: 0, y: hl - 0.06, z: p.headR * 0.88 });
  rig.attach(rig.head, mouthVoid, voidDark, { rigid: true });

  // Jagged, uneven iron pins / needle stitches crossing the open mouth
  const stitches = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 10 - 0.5) * 1.8;
    const skew = (Math.sin(i * 3.5) * 0.3);
    const stitchMesh = xf(new THREE.BoxGeometry(0.006, 0.045 + Math.abs(skew) * 0.02, 0.006), { 
      x: Math.sin(a) * 0.11, 
      y: hl - 0.06 - Math.cos(a) * 0.015 + (i % 2 === 0 ? 0.008 : -0.008), 
      z: p.headR * 0.92 + Math.cos(a) * 0.02,
      rz: skew
    });
    stitches.push(stitchMesh);
  }
  rig.attach(rig.head, merge(stitches), rustyNeedle, { rigid: true, shadow: false });

  // Cross-twine stitches along cheek boundary
  const twineStitches = [];
  for (const s of [-1, 1]) {
    twineStitches.push(xf(new THREE.BoxGeometry(0.004, 0.03, 0.004), { x: s * 0.13, y: hl - 0.05, z: p.headR * 0.88, rz: s * 0.6 }));
  }
  rig.attach(rig.head, merge(twineStitches), twineThread, { rigid: true });

  let acc = 0;
  let twitchTimer = 0;

  return result(rig, {
    kind: 'biped', height: bear ? 1.25 : 1.75, radius: 0.34, eyeY: bear ? 1.0 : 1.5, puppet: true,
    animate(st, dt) {
      // Stop-motion logic: hold each pose for 1/12th of a second
      acc += dt;
      twitchTimer += dt;

      if (acc < 1 / 12 && !st.force) return;
      const step = acc; 
      acc = 0;

      st.stride = bear ? 0.85 : 1.15; 
      st.lean = 0.12; 
      st.armsOut = st.chasing ? 0.75 : 0.15; 
      st.grip = 0.6; 
      st.rate = 220;

      // Uncanny snapped head tilt & twitch
      const microTwitch = (Math.sin(twitchTimer * 14.0) > 0.85) ? 0.25 : 0;
      st.tilt = Math.sin(st.t * 1.5) * 0.3 + microTwitch;

      animateBiped(rig, st, step);
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.puppet = buildPuppet;

ENTITY_DEFS.puppet = { 
  name: 'Stop-Motion Puppet', speed: 0.7, chase: 3.3, detect: 14, dmg: 24, reach: 1.4, cd: 1.2, memory: 6, puppet: true,
  num: 'Level 94 resident', cls: 'Hostile at night', size: '1.2 - 1.8 m',
  desc: 'Distressed felt and clay puppets with exposed wire armatures, caved-in eye sockets, and a gaping needle-stitched maw. They move in jerky 12 FPS stop-motion.',
  notes: 'By day they stand frozen like ruined decorations. At night they come alive and attack wanderers - but they only notice motion. Standing perfectly still conceals you.',
  tips: ['Be indoors before night falls.', 'If they come for you at night: stop moving completely.'] 
};
})();