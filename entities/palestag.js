// =============================================================================
//   The Pale Stag   (entity id: 'palestag')
//
//   One self-contained entity file:
//     - the three.js model builder (withered, emaciated horror deer with 
//       permanent neck dislocation, smooth wobbly motion, torn hide & exposed ribs)
//     - its stats / field-guide entry and AI hooks
//   Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//   Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateBiped, clamp, ellipsoid, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, inBeam, PL, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 13  THE PALE STAG (hylophobia)
function buildPaleStag() {
  // Skeletal, gaunt frame with natural ground-level pivot heights
  const p = { 
    ...HUMAN, 
    hipH: 1.25, thigh: 0.62, shin: 0.62, spine: 0.30, chestH: 0.40, neck: 0.28, 
    shoulderW: 0.34, upperArm: 0.58, foreArm: 0.62, chestW: 0.22, armR: 0.42, legR: 0.38, headR: 0.09 
  };
  const rig = new Rig(p);

  // Stretched, necrotic stag hide with exposed muscle tissue
  const stagTex = organic('stagskin', { 
    base: '#7e786e', dark: '#3a342c', light: '#b8b2a6', 
    veins: 0.7, vein: '#3e1e1e', pores: 0.6, wrinkle: 0.9, wrinkleF: 110, mottle: 0.8, tears: 0.5, extra: '#4a1210' 
  });
  const skin = fleshMat(stagTex, { rough: 0.85, bumpScale: 2.5 });
  const darkMeat = skinMat('#2a100e', { rough: 0.95 });
  const bone = skinMat('#cfc8b6', { rough: 0.5 });
  const yellowedBone = skinMat('#9e9478', { rough: 0.7 });
  const voidDark = skinMat('#020202', { rough: 1.0 });

  // Skeletal build with exposed rib cage, razor claws, and grounded feet
  buildBody(rig, p, 
    { skin, top: skin, bottom: skin, shoes: skin }, 
    { fingerLen: 0.22, fingerR: 0.45, claws: 0.08, clawMat: skinMat('#0d0a08', { rough: 0.2 }), chestDepth: 0.36, neckR: 0.45, ribs: true, footLen: 0.32, fingerVar: true }
  );

  // --- WITHERED TORSO & EXPOSED RIB DETAILS ---
  const torsoDetails = new THREE.Group();
  rig.chest.add(torsoDetails);

  const ribGeoms = [];
  for (let r = 0; r < 6; r++) {
    const side = (r % 2 === 0) ? 1 : -1;
    const yOff = 0.10 - r * 0.045;
    ribGeoms.push(xf(new THREE.TorusGeometry(0.085, 0.006, 6, 8, Math.PI * 0.75), { x: side * 0.02, y: yOff, z: 0.07, rx: 0.3, ry: side * 0.4 }));
  }
  torsoDetails.add(new THREE.Mesh(merge(ribGeoms), bone));

  // Hanging skin shreds dripping from ribcage
  const shredGeoms = [];
  for (let s = 0; s < 8; s++) {
    const angle = (s / 8) * Math.PI * 2;
    shredGeoms.push(xf(new THREE.BoxGeometry(0.018, 0.12 + (s % 3) * 0.04, 0.004), {
      x: Math.cos(angle) * 0.10,
      y: -0.12 - (s % 2) * 0.03,
      z: Math.sin(angle) * 0.10,
      rz: (s % 2 === 0 ? 0.15 : -0.15)
    }));
  }
  torsoDetails.add(new THREE.Mesh(merge(shredGeoms), darkMeat));

  // --- BROKEN, DISLOCATED NECK & DEER SKULL ---
  const hl = headLift(p);

  // Permanently broken neck bone fragment
  rig.attach(rig.neck, xf(new THREE.CylinderGeometry(0.015, 0.017, 0.07, 6), { y: 0.08, rz: 0.25 }), yellowedBone, { rigid: true });

  // BROKEN DEER SKULL
  const skullGroup = new THREE.Group();
  // Fixed initial off-axis offset for permanent neck break
  skullGroup.position.set(0.03, hl - 0.01, 0.02);
  skullGroup.rotation.set(0.15, -0.08, 0.55); // Permanent sideways tilt
  rig.head.add(skullGroup);

  // Main cranium & snout
  skullGroup.add(new THREE.Mesh(xf(ellipsoid(0.08, 0.07, 0.11), { y: 0.02 }), bone));
  skullGroup.add(new THREE.Mesh(xf(ellipsoid(0.042, 0.038, 0.16), { y: -0.03, z: 0.15, rx: 0.08 }), bone));

  // Side-facing eye sockets with milky sunken eyes
  for (const s of [-1, 1]) {
    skullGroup.add(new THREE.Mesh(xf(ellipsoid(0.026, 0.024, 0.02), { x: s * 0.058, y: 0.028, z: 0.065 }), voidDark));
    skullGroup.add(new THREE.Mesh(xf(ellipsoid(0.008, 0.008, 0.008), { x: s * 0.056, y: 0.028, z: 0.070 }), skinMat('#dedace', { rough: 0.1 })));
  }

  // Hollow nasal cavity
  skullGroup.add(new THREE.Mesh(xf(ellipsoid(0.02, 0.016, 0.025), { y: -0.01, z: 0.29 }), voidDark));

  // CROOKED LOWER JAW
  const jawGroup = new THREE.Group();
  jawGroup.position.set(0.01, -0.05, 0.11);
  jawGroup.rotation.set(0.2, 0.08, -0.12);
  skullGroup.add(jawGroup);

  jawGroup.add(new THREE.Mesh(xf(ellipsoid(0.032, 0.018, 0.13), { z: 0.05 }), yellowedBone));

  // Exposed needle teeth
  const teethUpper = [], teethLower = [];
  for (let i = 0; i < 7; i++) {
    const tz = 0.07 + i * 0.02;
    teethUpper.push(xf(new THREE.ConeGeometry(0.0035, 0.016, 4), { x: (i % 2 === 0 ? 0.026 : -0.026), y: -0.032, z: tz, rx: 3.14 }));
    teethLower.push(xf(new THREE.ConeGeometry(0.0035, 0.016, 4), { x: (i % 2 === 0 ? 0.016 : -0.016), y: 0.010, z: tz - 0.05 }));
  }
  skullGroup.add(new THREE.Mesh(merge(teethUpper), yellowedBone));
  jawGroup.add(new THREE.Mesh(merge(teethLower), yellowedBone));

  // ASYMMETRICAL ANTLERS
  const antlerParts = [];
  const velvetParts = [];

  const branchAntler = (x, y, z, dx, dy, dz, len, r, depth) => {
    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    const geo = new THREE.CylinderGeometry(r * 0.5, r, len, 5); 
    geo.translate(0, len / 2, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    geo.applyQuaternion(q); 
    geo.translate(x, y, z); 
    antlerParts.push(geo);

    if (depth <= 0) return;
    const ex = x + dir.x * len, ey = y + dir.y * len, ez = z + dir.z * len;
    branchAntler(ex, ey, ez, dir.x * 1.1, dir.y + 0.2, dir.z + 0.5, len * 0.68, r * 0.65, depth - 1);
    branchAntler(ex, ey, ez, dir.x * 0.5, dir.y + 0.55, dir.z - 0.4, len * 0.72, r * 0.65, depth - 1);
  };

  branchAntler(0.04, 0.08, 0.0, 0.85, 0.95, -0.15, 0.24, 0.022, 3);
  branchAntler(-0.04, 0.08, 0.0, -0.65, 0.75, 0.2, 0.15, 0.020, 1);

  skullGroup.add(new THREE.Mesh(merge(antlerParts), bone));

  return result(rig, {
    kind: 'biped', height: 2.7, radius: 0.32, eyeY: 2.35,
    animate(st, dt) {
      const t = st.t;

      // Base pose configuration
      st.lean = 0.22; 
      st.hunch = 0.35; 
      st.stride = 2.0; 
      st.armSwing = 0.35; 
      st.grip = 0.75; 

      // Continuous, smooth head wobble without instantaneous trigonometric jumps
      const wobbleZ = Math.sin(t * 2.2) * 0.12 + Math.sin(t * 4.1) * 0.04;
      const wobbleX = Math.cos(t * 1.8) * 0.08;

      st.tilt = wobbleZ;
      st.sway = Math.sin(t * 1.2) * 0.08;

      animateBiped(rig, st, dt);

      // Apply smooth additional wobble to skull and slack jaw relative to local broken base angle
      skullGroup.rotation.z = 0.55 + wobbleZ + (st.mimic ? Math.sin(t * 6.0) * 0.15 : 0);
      skullGroup.rotation.x = 0.15 + wobbleX;
      jawGroup.rotation.x = 0.20 + Math.abs(Math.sin(t * 3.5)) * 0.12 + (st.mimic ? Math.abs(Math.sin(t * 10.0)) * 0.22 : 0);
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.palestag = buildPaleStag;

// 13 --------------------------------------------------------------- THE PALE STAG
D.palestag = {
  name: 'The Pale Stag', speed: 1.3, chase: 5.8, detect: 40, dmg: 36, reach: 1.7, cd: 1.4, memory: 30, xray: true, voice: 'mimic',
  num: 'Φ-13 · Hylophobia', cls: 'Lethal', size: '2.7 m to the antler tips',
  desc: 'A tall, emaciated abomination clad in decayed hide and exposed ribs. Its head is a broken deer skull with asymmetrical antlers, snapped permanently sideways at the neck and swaying with an eerie wobble.',
  notes: 'It stalks along the periphery of light sources, calling out in mimicked voices. Direct flashlight beams cause it to retreat, but a dead flashlight battery prompts an immediate high-speed assault.',
  tips: ['Keep your flashlight charged and conserve battery power.', 'Do not follow voices calling out from the darkness.', 'If your flashlight fails, seek illuminated lanterns immediately.'],
  sketch: [['head', 'broken deer skull tilted sideways'], ['neck', 'snapped joint with wobbly motion'], ['body', 'withered ribs & torn hide']],
  
  frame(m, e, dt, d, looked) {
    const pl = PL(m);
    const lightOk = pl.flashlightOn && pl.battery > pl.stats.batteryMax * 0.15;
    const inLight = m.lum(pl.pos.x, pl.pos.z) > 0.18;
    e.charge = !(lightOk || inLight);
    
    if (inBeam(m, e, looked, d, 0.88)) { 
      e.recoil = 1.5; 
    }
    if (e.recoil > 0) { 
      e.recoil -= dt; 
      e.st.mimic = 0; 
    }
    
    e.mimicT = (e.mimicT || 8) - dt;
    if (e.mimicT <= 0 && d < 35 && !e.charge) { 
      e.mimicT = 9 + m.rng.next() * 9; 
      if (m.game && m.game.audio) {
        m.game.audio.mimic(e.pos, pl); 
      }
      e.st.mimic = 1; 
    }
    
    e.threat = e.charge ? clamp(1 - d / 25, 0, 1) : 0.15;
    return null;
  },

  think(m, e, d) {
    const P = PL(m).pos;
    if (e.charge && !(e.recoil > 0)) { 
      chaseTo(m, e); 
      return; 
    }
    e.state = 'stalk';
    e.orbit = (e.orbit ?? m.rng.next() * TAU) + 0.06;
    const r = e.recoil > 0 ? 22 : 15;
    m.route(e, P.x + Math.sin(e.orbit) * r, P.z + Math.cos(e.orbit) * r);
  },

  speedFn(m, e, want) { 
    return e.charge && !(e.recoil > 0) ? e.def.chase * m.diff.speed : 2.4 * m.diff.speed; 
  },
};

})();