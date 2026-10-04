// =============================================================================
//   The Sandman   (entity id: 'sandman')
//
//   One self-contained entity file:
//     - the three.js model builder (highly detailed emaciated nightmare form)
//     - its stats / field-guide entry and AI hooks
//   Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//   Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateBiped, clamp, ellipsoid, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, cloth, fleshMat, headLift, headOn, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { chain, haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { chaseTo, D, faceYaw, ph, place, spotAround, strike } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 28  THE SANDMAN (somniphobia)
function buildSandman() {
  // Unnaturally elongated, gaunt frame
  const p = { 
    ...HUMAN, 
    hipH: 1.35, thigh: 0.68, shin: 0.66, spine: 0.30, chestH: 0.42, neck: 0.22, 
    shoulderW: 0.38, upperArm: 0.56, foreArm: 0.58, chestW: 0.28, armR: 0.50, legR: 0.45, headR: 0.11 
  };
  const rig = new Rig(p);

  // --- MATERIALS ---
  // Dry, cracked sand-encrusted skin
  const skinTex = organic('sandskin', { 
    base: '#c2b296', dark: '#7a6a50', light: '#e4d6be', 
    veins: 0.2, pores: 0.8, wrinkle: 0.95, wrinkleF: 120, mottle: 0.7 
  });
  const skin = fleshMat(skinTex, { rough: 0.92, bumpScale: 2.2 });

  // Stained, decaying nightgown cloth
  const nT = cloth('nightgown', { 
    base: '#7a8298', dark: '#2e323e', stain: '#3a2e1e', 
    weave: 120, stains: 0.7, wear: 0.8 
  });
  const gown = skinMat('#989898', { map: nT.map, bump: nT.bump, bumpScale: 1.4, rough: 0.95, side: THREE.DoubleSide });
  const patchGown = skinMat('#4a443b', { rough: 0.98, side: THREE.DoubleSide });

  // Coarse surgical thread, burlap sack, rope & bone materials
  const threadMat = skinMat('#1a100a', { rough: 0.9 });
  const knotMat = skinMat('#2a1a10', { rough: 0.85 });
  const crustMat = skinMat('#b09e7a', { rough: 1.0, bumpScale: 2.0 });
  const sackMat = skinMat('#685638', { rough: 0.98, bumpScale: 1.5 });
  const ropeMat = skinMat('#4a3c28', { rough: 0.95 });
  const boneMat = skinMat('#d0c4a4', { rough: 0.4 });
  const voidMat = skinMat('#050403', { rough: 1.0 });

  // Base skeletal body structure with extended fingers and narrow neck
  buildBody(rig, p, 
    { skin, top: gown, bottom: gown, shoes: skin }, 
    { sleeve: true, fingerLen: 0.22, fingerR: 0.55, chestDepth: 0.45, neckR: 0.65 }
  );

  // --- CLAWED NEEDLE FINGERS ---
  for (let side = 0; side < 2; side++) {
    const handGroup = rig.arms[side].wr;
    for (let f = 0; f < 5; f++) {
      const nail = new THREE.Mesh(
        xf(new THREE.ConeGeometry(0.006, 0.04, 5), { y: -0.19 - (f % 2) * 0.01, z: (f - 2) * 0.012, rx: 1.57 }), 
        boneMat
      );
      handGroup.add(nail);
    }
  }

  // --- TATTERED GOWN DETAILS (Hem fringes, shoulder mantle, chest buttons) ---
  const gownDetails = new THREE.Group();
  rig.spine.add(gownDetails);

  // Shredded mantle around shoulders
  const mantle = new THREE.Mesh(xf(ellipsoid(0.24, 0.12, 0.20), { y: 0.22, z: 0.01 }), gown);
  gownDetails.add(mantle);

  // Cracked bone buttons down the chest seam
  const buttonGeoms = [];
  for (let b = 0; b < 5; b++) {
    buttonGeoms.push(xf(new THREE.CylinderGeometry(0.012, 0.012, 0.006, 8), { y: 0.15 - b * 0.08, z: 0.14, rx: 0.2 }));
  }
  gownDetails.add(new THREE.Mesh(merge(buttonGeoms), boneMat));

  // Fabric patches on gown
  const patch1 = new THREE.Mesh(xf(new THREE.BoxGeometry(0.08, 0.09, 0.01), { x: -0.10, y: -0.05, z: 0.13, ry: -0.2 }), patchGown);
  const patch2 = new THREE.Mesh(xf(new THREE.BoxGeometry(0.07, 0.11, 0.01), { x: 0.09, y: -0.22, z: -0.12, ry: 0.1 }), patchGown);
  gownDetails.add(patch1, patch2);

  // Tattered hanging hem strips around knees
  const hemStrips = [];
  const stripCount = 14;
  for (let i = 0; i < stripCount; i++) {
    const angle = (i / stripCount) * Math.PI * 2;
    hemStrips.push(xf(new THREE.BoxGeometry(0.035, 0.18 + (i % 3) * 0.04, 0.005), {
      x: Math.cos(angle) * 0.16,
      y: -0.55 - (i % 2) * 0.03,
      z: Math.sin(angle) * 0.16,
      ry: angle,
      rz: (Math.random() - 0.5) * 0.2
    }));
  }
  gownDetails.add(new THREE.Mesh(merge(hemStrips), patchGown));

  // --- HEAD, SUNKEN FACIAL GEOMETRY & SEWN SUTURES ---
  headOn(rig, p, skin, 0.95, 1.3, 1.05);
  const hl = headLift(p);

  // Skeletal head features: sunken cheeks, sharp jaw, hollow nasal cavity
  const skull = new THREE.Group();
  skull.position.set(0, hl + 0.05, 0);
  rig.head.add(skull);

  // Cheekbone ridges
  for (const s of [-1, 1]) {
    skull.add(new THREE.Mesh(xf(ellipsoid(0.035, 0.02, 0.04), { x: s * 0.05, y: -0.01, z: 0.08 }), skin));
    // Sand crust caked in eye sockets
    skull.add(new THREE.Mesh(xf(ellipsoid(0.028, 0.018, 0.015), { x: s * 0.04, y: 0.025, z: 0.095 }), crustMat));
  }
  // Hollow nasal slit
  skull.add(new THREE.Mesh(xf(ellipsoid(0.012, 0.022, 0.015), { y: -0.015, z: 0.10 }), voidMat));

  // EYES: Cross-stitched shut with coarse cord & thread knot anchors
  for (const s of [-1, 1]) {
    // Dark socket cavity backing
    skull.add(new THREE.Mesh(xf(ellipsoid(0.024, 0.01, 0.008), { x: s * 0.04, y: 0.025, z: 0.102 }), voidMat));
    
    // Cross stitches (X pattern)
    const sts = [];
    const knots = [];
    for (let k = 0; k < 4; k++) {
      const cx = s * 0.04 + (k - 1.5) * 0.011;
      // Slanted stitch bars forming X sutures
      sts.push(xf(new THREE.BoxGeometry(0.003, 0.022, 0.003), { x: cx, y: 0.025, z: 0.106, rz: 0.35 }));
      sts.push(xf(new THREE.BoxGeometry(0.003, 0.022, 0.003), { x: cx, y: 0.025, z: 0.106, rz: -0.35 }));
      // Stitch anchor knots top and bottom
      knots.push(xf(new THREE.SphereGeometry(0.0035, 4, 4), { x: cx, y: 0.035, z: 0.105 }));
      knots.push(xf(new THREE.SphereGeometry(0.0035, 4, 4), { x: cx, y: 0.015, z: 0.105 }));
    }
    skull.add(new THREE.Mesh(merge(sts), threadMat));
    skull.add(new THREE.Mesh(merge(knots), knotMat));
  }

  // MOUTH: Partially open gaunt gap bound shut with coarse vertical stitches, revealing bone teeth
  const mouthGroup = new THREE.Group();
  mouthGroup.position.set(0, -0.05, 0.088);
  skull.add(mouthGroup);

  // Interior void cavity
  mouthGroup.add(new THREE.Mesh(xf(ellipsoid(0.04, 0.018, 0.02), { z: 0.005 }), voidMat));

  // Exposed needle teeth in gap
  const teethGeoms = [];
  for (let t = 0; t < 8; t++) {
    const tx = -0.03 + t * 0.0085;
    teethGeoms.push(xf(new THREE.BoxGeometry(0.004, 0.014, 0.004), { x: tx, y: 0.002, z: 0.008 }));
  }
  mouthGroup.add(new THREE.Mesh(merge(teethGeoms), boneMat));

  // Lip sutures binding mouth shut
  const mouthStitches = [];
  for (let ms = 0; ms < 7; ms++) {
    const mx = -0.032 + ms * 0.0105;
    mouthStitches.push(xf(new THREE.BoxGeometry(0.0035, 0.028, 0.004), { x: mx, y: 0.0, z: 0.012, rz: (ms % 2 === 0 ? 0.1 : -0.1) }));
  }
  mouthGroup.add(new THREE.Mesh(merge(mouthStitches), threadMat));

  // --- NIGHTCAP WITH SEAM & INTRICATE TASSEL CHAIN ---
  const cap = new THREE.Group(); 
  cap.position.set(0, hl + 0.06, -0.01); 
  rig.head.add(cap);

  // Cap rim band & brim
  cap.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.108, 0.118, 0.05, 16), {}), patchGown));
  // Main cone base
  cap.add(new THREE.Mesh(xf(new THREE.ConeGeometry(0.11, 0.22, 16), { y: 0.10, rx: -0.2 }), gown));

  // Dangling chain tail
  const capSegs = chain(cap, 7, 0.075, 0.09, 0.018, gown, [0, 1, 0]);

  // Terminal tassel bulb and dangling thread fringe
  const tasselBase = capSegs[capSegs.length - 1];
  const tasselBulb = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), crustMat);
  tasselBulb.position.y = 0.08;
  tasselBase.add(tasselBulb);

  const tasselStrands = [];
  for (let ts = 0; ts < 8; ts++) {
    const tang = (ts / 8) * Math.PI * 2;
    tasselStrands.push(xf(new THREE.CylinderGeometry(0.002, 0.001, 0.06, 4), {
      x: Math.cos(tang) * 0.012,
      y: 0.11,
      z: Math.sin(tang) * 0.012,
      rx: 0.2
    }));
  }
  tasselBase.add(new THREE.Mesh(merge(tasselStrands), threadMat));

  // --- THE SAND SACK, ROPE TIES & BONE CHARMS ---
  const sackGroup = new THREE.Group();
  sackGroup.position.set(-0.16, 0.36, -0.20); 
  rig.chest.add(sackGroup);

  // Lumpy main burlap sack body
  const sackMain = new THREE.Mesh(xf(ellipsoid(0.24, 0.32, 0.22), { y: -0.18, rz: 0.15 }), sackMat);
  const sackBulge = new THREE.Mesh(xf(ellipsoid(0.18, 0.20, 0.16), { x: 0.08, y: -0.26, z: 0.06 }), sackMat);
  sackGroup.add(sackMain, sackBulge);

  // Gathered neck of sack tied with jute rope
  const sackNeck = new THREE.Mesh(xf(new THREE.CylinderGeometry(0.08, 0.14, 0.12, 12), { y: 0.06 }), sackMat);
  const ropeKnot = new THREE.Mesh(xf(new THREE.TorusGeometry(0.085, 0.018, 8, 12), { y: 0.02, rx: 1.57 }), ropeMat);
  sackGroup.add(sackNeck, ropeKnot);

  // Hanging bone/tooth charms on sack string
  const charmGroup = new THREE.Group();
  charmGroup.position.set(0.06, -0.02, 0.10);
  sackGroup.add(charmGroup);

  for (let c = 0; c < 3; c++) {
    const toothCharm = new THREE.Mesh(xf(new THREE.ConeGeometry(0.008, 0.035, 5), { x: (c - 1) * 0.025, y: -c * 0.015, rx: 3.14 }), boneMat);
    charmGroup.add(toothCharm);
  }

  // Crusted sand leaking patch on sack tear
  const sackTear = new THREE.Mesh(xf(ellipsoid(0.06, 0.08, 0.02), { x: -0.14, y: -0.28, z: 0.12, ry: -0.5 }), crustMat);
  sackGroup.add(sackTear);

  // --- MULTI-POINT TRICKLING SAND GRAIN PARTICLES ---
  const grains = [];
  const gmap = haloMat('#ffffff').map;
  const grainCount = 60;

  for (let i = 0; i < grainCount; i++) {
    const s = sprite(gmap, i % 3 === 0 ? 0xc2b296 : 0xe4d6be, 0.022 + (i % 2) * 0.012, 0.85);
    rig.root.add(s);
    // Source: 0 = left wrist, 1 = right wrist, 2 = sack tear
    grains.push({ s, t: Math.random(), source: i % 3 });
  }

  const tmp = new THREE.Vector3();

  return result(rig, {
    kind: 'biped', height: 2.65, radius: 0.32, eyeY: 2.40,
    animate(st, dt) {
      st.lean = 0.16; 
      st.hunch = 0.32; 
      st.stride = 2.2; 
      st.armSwing = 0.18; 
      st.grip = 0.35; 
      st.tilt = Math.sin(st.t * 0.4) * 0.4 + 0.2;

      animateBiped(rig, st, dt);

      // Nightcap fluid chain physics motion
      capSegs.forEach((g, i) => { 
        g.rotation.x = 0.38 + Math.sin(st.t * 1.4 + i * 0.4) * 0.08; 
        g.rotation.z = -0.12 * i * 0.25 + Math.cos(st.t * 0.8) * 0.05; 
      });

      // Sack heavy sway dynamics
      sackGroup.rotation.z = Math.sin(st.t * 1.2) * 0.06;
      sackGroup.rotation.x = Math.cos(st.t * 1.2) * 0.04;
      charmGroup.rotation.z = Math.sin(st.t * 2.5) * 0.2;

      // Multi-point trickling sand particle animation logic
      rig.root.updateMatrixWorld(true);
      for (const g of grains) {
        g.t += dt * 0.75;
        if (g.t > 1) { 
          g.t = 0; 
          if (g.source === 0) {
            rig.arms[0].wr.getWorldPosition(tmp);
          } else if (g.source === 1) {
            rig.arms[1].wr.getWorldPosition(tmp);
          } else {
            sackTear.getWorldPosition(tmp);
          }
          rig.root.worldToLocal(tmp); 
          g.ox = tmp.x; 
          g.oy = tmp.y; 
          g.oz = tmp.z; 
        }
        if (g.ox !== undefined) {
          const drift = Math.sin(g.t * 8.0 + g.source) * 0.025;
          g.s.position.set(
            g.ox + drift, 
            g.oy - g.t * g.t * 1.8, 
            g.oz + Math.cos(g.t * 6.0) * 0.015
          );
        }
        g.s.material.opacity = 0.85 * (1.0 - g.t);
      }
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.sandman = buildSandman;

// 28 --------------------------------------------------------------- THE SANDMAN
D.sandman = {
  name: 'The Sandman', speed: 0, chase: 3.2, detect: 999, dmg: 40, reach: 1.5, cd: 2, memory: 999, xray: true, voice: 'lullaby', noLeash: true, noAttack: true,
  num: 'Φ-28 · Somniphobia', cls: 'Lethal', size: '2.65 m tall',
  desc: 'An emaciated, towering figure clad in a stained nightgown and a drooping seam-stitched cap. Its facial features are gaunt and hollow, with eyelids and mouth coarse-stitched shut with dark cord. Heavy streams of coarse sand continuously pour from its sleeve cuffs and torn shoulder sack.',
  notes: 'It moves exclusively when your eyelids grow heavy with drowsiness. The closer you are to falling asleep, the faster it glides across the floor. Should you pass out, it stands directly above you when you wake.',
  tips: ['Keep moving — resting or lingering in total darkness accelerates drowsiness.', 'Vending machines stock caffeinated beverages that clear fatigue.', 'Almond water and sprinting instantly reset your drowsiness meter.'],
  sketch: [['head', 'eyes & mouth stitched shut'], ['hands', 'clawed needles & trickling sand'], ['shoulder', 'slung sack leaking grit']],
  
  spawnFn(m, type) { 
    const s = spotAround(m, 1, 18, 26, false, 1.4); 
    return s ? m.make(type, s[0], s[1]) : null; 
  },

  frame(m, e, dt, d) {
    const p = ph(m); 
    const dz = p ? p.meterValue('drowsy') : 0;
    e.freeze = dz < 0.35;
    e.threat = dz > 0.35 ? clamp(1 - d / 20, 0, 1) * dz : 0;
    
    if (p && p.asleep && !e.struck) { 
      e.struck = true; 
      const s = spotAround(m, 1, 1.6, 2.4, false, 0.3); 
      if (s) place(m, e, s[0], s[1]); 
      e.yaw = faceYaw(m, e); 
      setTimeout(() => { 
        if (m.game && m.game.state === 'play') strike(m, e, e.def.dmg, 2); 
      }, 1200); 
    }
    
    if (p && !p.asleep) e.struck = false;
    if (d > 45 && dz < 0.3) { 
      const s = spotAround(m, 1, 20, 30, false, 1.4); 
      if (s) place(m, e, s[0], s[1]); 
    }
    return null;
  },

  speedFn(m, e) { 
    const p = ph(m); 
    const dz = p ? p.meterValue('drowsy') : 0; 
    return (0.6 + dz * 4.2) * m.diff.speed; 
  },

  think(m, e) { 
    if (!e.freeze) chaseTo(m, e); 
  },
};

})();