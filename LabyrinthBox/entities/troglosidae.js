// =============================================================================
//  Troglosidae   (entity id: 'troglosidae')
//
//  One self-contained entity file:
//    - the three.js model builder
//    - its stats / field-guide entry
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { clamp, ellipsoid, glowMat, Rig, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * Creates a jointed bone cylinder whose origin/pivot sits exactly at (0,0,0)
 * pointing along the local +Z axis.
 */
function createSegment(radiusTop, radiusBottom, length, material) {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, 8);
  // Shift pivot to joint base and orient along +Z
  geo.rotateX(Math.PI / 2);
  geo.translate(0, 0, length / 2);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  return mesh;
}

/**
 * Troglosidae (Level 8): a mutated troglobitic arachnid on eight long, jointed,
 * chitinous legs. Features articulated chelicerae fangs, whiplike sensory pedipalps,
 * an asymmetric eye cluster, and abdominal spinnerets.
 */
function buildTroglosidae() {
  const rig = new Rig({ ...HUMAN });
  const t = organic('troglo', { base: '#3a332a', dark: '#14110e', light: '#685a49', veins: 0.35, pores: 0.7, poreF: 60, wrinkle: 0.6, wrinkleF: 35, mottle: 0.85 });
  const chit = fleshMat(t, { rough: 0.3, bumpScale: 2.8 });
  const darkChit = fleshMat(t, { rough: 0.5, bumpScale: 1.5 });
  
  const body = new THREE.Group(); 
  body.position.y = 0.65; 
  rig.root.add(body);

  const add = (g, m = chit, parent = body) => { 
    const me = new THREE.Mesh(g, m); 
    me.castShadow = true; 
    parent.add(me); 
    return me; 
  };

  // --- CEPHALOTHORAX (PROSOMA) & OCULAR TUBERCLE ---
  const prosoma = new THREE.Group();
  body.add(prosoma);
  add(ellipsoid(0.28, 0.17, 0.32), chit, prosoma);
  add(xf(ellipsoid(0.14, 0.08, 0.16), { y: 0.1, z: 0.12 }), chit, prosoma);

  // Asymmetric eye cluster
  const ocular = new THREE.Group();
  ocular.position.set(0, 0.14, 0.22);
  prosoma.add(ocular);
  add(ellipsoid(0.08, 0.04, 0.06), darkChit, ocular);

  const eyeGlow = glowMat('#d8e698');
  const eyeDim = glowMat('#8a965d');
  
  const eyePositions = [
    { x: -0.04, y: 0.02, z: 0.03, r: 0.028, mat: eyeGlow },
    { x:  0.035, y: 0.025, z: 0.035, r: 0.024, mat: eyeGlow },
    { x: -0.06, y: -0.01, z: 0.02, r: 0.018, mat: eyeDim },
    { x:  0.065, y: -0.005, z: 0.02, r: 0.019, mat: eyeDim },
    { x: -0.02, y: 0.045, z: 0.015, r: 0.015, mat: eyeGlow },
    { x:  0.02, y: 0.04, z: 0.02, r: 0.016, mat: eyeGlow },
    { x: -0.05, y: 0.035, z: -0.01, r: 0.014, mat: eyeDim },
    { x:  0.05, y: 0.03, z: -0.01, r: 0.013, mat: eyeDim },
  ];
  for (const e of eyePositions) {
    add(xf(ellipsoid(e.r, e.r, e.r * 0.7), { x: e.x, y: e.y, z: e.z }), e.mat, ocular);
  }

  // --- PEDICEL (WAIST) ---
  const peticel = new THREE.Group();
  peticel.position.set(0, 0, -0.26);
  body.add(peticel);
  add(ellipsoid(0.09, 0.08, 0.12), darkChit, peticel);

  // --- ABDOMEN (OPISTHOSOMA) & SPINNERETS ---
  const abd = new THREE.Group();
  abd.position.z = -0.34;
  body.add(abd);

  add(xf(ellipsoid(0.34, 0.28, 0.48), { z: -0.38, y: 0.06 }), chit, abd);

  for (let i = 0; i < 7; i++) {
    add(xf(new THREE.TorusGeometry(0.28 - Math.abs(i - 2.5) * 0.03, 0.014, 6, 20, Math.PI * 1.1), {
      z: -0.12 - i * 0.11,
      y: 0.1 + (i < 3 ? i * 0.02 : (6 - i) * 0.02),
      rx: Math.PI / 2 + 0.1
    }), chit, abd);
  }

  // Ventral book lung slits
  for (const s of [-1, 1]) {
    add(xf(ellipsoid(0.08, 0.015, 0.04), { x: s * 0.12, y: -0.16, z: -0.28 }), darkChit, abd);
    add(xf(ellipsoid(0.07, 0.012, 0.035), { x: s * 0.11, y: -0.15, z: -0.4 }), darkChit, abd);
  }

  // Posterior spinnerets
  const spinnerets = [];
  for (const s of [-1, 1]) {
    const spin1 = new THREE.Group();
    spin1.position.set(s * 0.06, -0.08, -0.82);
    abd.add(spin1);
    spin1.add(createSegment(0.018, 0.012, 0.12, chit));

    const spin2 = new THREE.Group();
    spin2.position.set(s * 0.03, -0.12, -0.84);
    abd.add(spin2);
    spin2.add(createSegment(0.014, 0.008, 0.08, chit));

    spinnerets.push(spin1, spin2);
  }

  // --- CHELICERAE & VENOMOUS FANGS ---
  const chelicerae = [];
  for (const s of [-1, 1]) {
    const base = new THREE.Group();
    base.position.set(s * 0.09, -0.08, 0.28);
    prosoma.add(base);
    add(xf(ellipsoid(0.06, 0.11, 0.09), { y: -0.04, z: 0.04 }), chit, base);

    const fang = new THREE.Group();
    fang.position.set(0, -0.12, 0.08);
    base.add(fang);
    add(xf(new THREE.ConeGeometry(0.022, 0.16, 6), { rx: Math.PI / 2 + 0.3, ry: -s * 0.25, z: 0.06 }), darkChit, fang);

    chelicerae.push({ base, fang, s });
  }

  // --- WHIPLIKE SENSORY PEDIPALPS ---
  const whips = [];
  for (const s of [-1, 1]) {
    let parent = prosoma, segs = [];
    for (let k = 0; k < 11; k++) {
      const g = new THREE.Group();
      g.position.set(k === 0 ? s * 0.14 : 0, k === 0 ? -0.06 : 0, k === 0 ? 0.31 : 0.11);
      parent.add(g);

      const radTop = Math.max(0.003, 0.022 - k * 0.0017);
      const radBot = Math.max(0.004, 0.025 - k * 0.0017);
      g.add(createSegment(radTop, radBot, 0.11, chit));

      segs.push(g); 
      parent = g;
    }
    whips.push({ segs, s });
  }

  // --- 8 ARACHNID LEGS ---
  const legs = [];
  const legSpreadAngles = [1.1, 0.4, -0.4, -1.1]; // Spread out along sides
  const legScales = [1.2, 1.1, 1.0, 1.25];

  for (let i = 0; i < 4; i++) {
    for (const s of [-1, 1]) {
      const root = new THREE.Group();
      // Mount cleanly on sides of carapace
      root.position.set(s * 0.24, -0.04, 0.12 - i * 0.09);
      prosoma.add(root);

      const scale = legScales[i];
      const coxaLen = 0.18 * scale;
      const femLen = 0.65 * scale;
      const tibLen = 0.75 * scale;
      const tarsLen = 0.45 * scale;

      // Coxa (extends outward)
      const coxa = new THREE.Group();
      root.add(coxa);
      coxa.add(createSegment(0.035, 0.03, coxaLen, chit));

      // Femur (arcs up and outward)
      const femur = new THREE.Group();
      femur.position.z = coxaLen;
      coxa.add(femur);
      femur.add(createSegment(0.03, 0.022, femLen, chit));

      // Tibia (bends downward toward floor)
      const tibia = new THREE.Group();
      tibia.position.z = femLen;
      femur.add(tibia);
      tibia.add(createSegment(0.022, 0.015, tibLen, chit));

      // Tarsus (foot extending to ground)
      const tars = new THREE.Group();
      tars.position.z = tibLen;
      tibia.add(tars);
      tars.add(createSegment(0.015, 0.006, tarsLen, chit));

      legs.push({ 
        root, coxa, femur, tibia, tars, s, i, 
        baseAngle: legSpreadAngles[i],
        ph: (i % 2 === 0 ? 0 : Math.PI) + (s > 0 ? 0 : Math.PI / 2) 
      });
    }
  }

  rig.finalize();

  return result(rig, {
    kind: 'arthropod', height: 1.4, radius: 0.65, eyeY: 0.95, body,
    animate(st, dt) {
      st.t += dt;
      const t = st.t;
      const v = st.speed;
      st.phase += v * dt * 4.5;
      const ph = st.phase;
      const moveK = clamp(v / 0.5, 0, 1);
      const atk = st.attack || 0;

      // Stance & body motion
      body.position.y = 0.58 + Math.abs(Math.sin(ph * 2)) * 0.03 * moveK - atk * 0.15;
      body.rotation.x = -atk * 0.3 + Math.sin(t * 1.2) * 0.02;
      body.rotation.z = Math.sin(ph) * 0.02 * moveK;

      // Respiration & abdomen motion
      abd.scale.set(
        1.0 + Math.sin(t * 2.5) * 0.025,
        1.0 + Math.cos(t * 2.5) * 0.03,
        1.0 + Math.sin(t * 2.5 + 0.5) * 0.02
      );
      abd.rotation.x = Math.sin(t * 1.4) * 0.04 + atk * 0.15;

      // Chelicerae & Fangs
      for (const C of chelicerae) {
        C.base.rotation.y = C.s * (0.05 + Math.sin(t * 2.0 + C.s) * 0.04) + C.s * atk * 0.25;
        C.fang.rotation.z = Math.sin(t * 3.0 + C.s) * 0.08 - atk * 0.4;
      }

      // Leg Kinematics
      for (const L of legs) {
        const p = ph + L.ph;
        const lift = Math.max(0, Math.sin(p)) * moveK;
        const stride = Math.cos(p) * 0.2 * moveK;

        // Yaw angle pointing outwards
        L.root.rotation.y = L.s * (L.baseAngle + stride * 0.2);

        // Coxa points slightly outward and down
        L.coxa.rotation.x = 0.1;
        L.coxa.rotation.y = L.s * 0.2;

        // Femur aims up at ~65 degrees
        L.femur.rotation.x = -1.1 - lift * 0.2;

        // Tibia hinges down towards ground
        L.tibia.rotation.x = 2.1 - lift * 0.1;

        // Tarsus flattens onto floor
        L.tars.rotation.x = -0.8;
      }

      // Whip pedipalps
      for (const W of whips) {
        W.segs.forEach((g, k) => {
          const wave1 = Math.sin(t * 3.2 + k * 0.45 + W.s) * 0.14;
          const wave2 = Math.cos(t * 2.1 + k * 0.35) * 0.1;
          g.rotation.y = wave1 * (1 + atk * 2.5) + W.s * 0.04;
          g.rotation.x = 0.1 + wave2 - atk * 0.2;
        });
      }
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.troglosidae = buildTroglosidae;

// ------------------------------------------------------------ wiki additions
ENTITY_DEFS.troglosidae = { 
  name: 'Troglosidae', speed: 0.8, chase: 5.0, detect: 9, dmg: 26, reach: 1.9, cd: 1.3, memory: 3, ambush: true,
  num: 'Level 8 fauna', cls: 'Hostile', size: '~3 m leg span',
  desc: 'A large cave arthropod - not a true spider - with disproportionately long legs and whip-like mandibles.',
  notes: 'Waits motionless in the dark of the cave system until something comes close, then rushes it. The mandibles inject a powerful coagulant. It loses interest quickly once you are out of reach.',
  tips: ['Keep your light moving across the ceilings and corners.', 'If one rushes you, sprint back the way you came - it will not follow far.'] 
};
})();