// =============================================================================
//  Nine Lives   (entity id: 'ninelives')
//
//  One self-contained entity file:
//    - Oversized, terrifying predatory sphinx-beast model builder
//    - High-contrast necrotic skin, needle-like saber teeth, and glowing slit eyes
//    - Field guide stats and lethal stalker AI hooks
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateQuadKit, eyeTex, haloMat, quadKit, V } = __mod['src/phobia/models_a.js'];
const { ellipsoid, glowMat, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { D, faceYaw, lunge, PL, startLunge } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 5  NINE LIVES (ailurophobia)
function buildNineLives() {
  const rig = new Rig({ ...HUMAN });
  
  // Dark necrotic skin with prominent crimson veins, deep wrinkles, and mottled scarring
  const t = organic('monstrous_sphynx', { 
    base: '#382b27', 
    dark: '#1a110e', 
    light: '#5e4842', 
    veins: 0.95, 
    vein: '#800a12', 
    pores: 0.7, 
    wrinkle: 1.0, 
    wrinkleF: 120, 
    mottle: 0.85 
  });
  
  const skin = fleshMat(t, { rough: 0.45, bumpScale: 3.5, emissive: '#140505', emissiveIntensity: 0.2 });
  const clawMat = skinMat('#120a0a', { rough: 0.15, emissive: '#4a0000', emissiveIntensity: 0.3 }); // Blood-drenched razor claws

  // Massive predatory feline proportions (~1.35m shoulder height, 2.4m length)
  const o = { 
    hipY: 1.35, 
    chestR: 0.42, 
    hipR: 0.36, 
    len: 2.1, 
    neckLen: 0.45, 
    legA: 0.52, 
    legB: 0.55, 
    legC: 0.32, 
    legR: 0.095, 
    tailN: 16, 
    tailSeg: 0.12, 
    tailR: 0.05, 
    skin, 
    claws: 0.14, 
    clawMat, 
    spineBumps: true, 
    ribs: true, 
    tuck: 0.12 
  };
  
  const K = quadKit(rig, o);
  const add = K.add;

  // Broadened, monstrous skull structure
  add(xf(ellipsoid(0.24, 0.20, 0.25), { z: 0.08 }), skin, K.head);
  add(xf(ellipsoid(0.14, 0.11, 0.16), { z: 0.28, y: -0.06 }), skin, K.head); // Elongated predatory snout
  add(xf(ellipsoid(0.035, 0.025, 0.03), { z: 0.41, y: -0.04 }), skinMat('#1a0808', { rough: 0.2 }), K.head); // Blackened nostrils

  // Jagged, tattered ears
  const earM = fleshMat(t, { rough: 0.5, bumpScale: 2.2, side: THREE.DoubleSide });
  const ears = [];
  for (const s of [-1, 1]) {
    const ear = new THREE.Group(); 
    ear.position.set(s * 0.14, 0.18, 0.02); 
    K.head.add(ear);
    add(xf(new THREE.ConeGeometry(0.12, 0.42, 4, 1, true), { y: 0.2, rz: -s * 0.35, ry: s * 0.5, sz: 0.3 }), earM, ear);
    ears.push(ear);
  }

  // Piercing golden-red slit eyes with intense reflective halos
  const eyes = [];
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12), glowMat('#ffffff', { map: eyeTex('#ff2200', { slit: true }) }));
    e.position.set(s * 0.11, 0.07, 0.22); 
    e.rotation.y = s * 0.22; 
    K.head.add(e); 
    eyes.push(e);
    
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), haloMat('#ff4400', 0.65)); 
    hl.position.set(s * 0.11, 0.07, 0.29); 
    hl.userData.noSketch = true; 
    K.head.add(hl);
  }

  // Horrifying gaping jaw loaded with double saber fangs & needle teeth
  const jaw = new THREE.Group(); 
  jaw.position.set(0, -0.12, 0.14); 
  K.head.add(jaw);
  add(xf(ellipsoid(0.12, 0.05, 0.18), { z: 0.08 }), skin, jaw);

  const toothMat = skinMat('#e6dfcc', { rough: 0.15 });
  const tl = [];

  // Upper main saber canines
  for (const s of [-1, 1]) {
    tl.push(xf(new THREE.ConeGeometry(0.018, 0.12, 5), { x: s * 0.08, y: -0.09, z: 0.32, rx: Math.PI * 0.88, rz: s * 0.1 }));
    tl.push(xf(new THREE.ConeGeometry(0.014, 0.09, 5), { x: s * 0.05, y: -0.08, z: 0.34, rx: Math.PI * 0.9 }));
  }

  // Rows of interlocked serrated teeth (38 total)
  for (let i = 0; i < 34; i++) { 
    const a = (i / 33 - 0.5) * 2.8; 
    const isLower = i % 2 === 0;
    tl.push(xf(new THREE.ConeGeometry(0.008, 0.055, 4), { 
      x: Math.sin(a) * 0.095, 
      y: isLower ? -0.11 : -0.06, 
      z: 0.22 + Math.cos(a) * 0.11, 
      rx: isLower ? 0 : Math.PI 
    })); 
  }
  add(merge(tl), toothMat, K.head);

  rig.finalize();

  return result(rig, {
    kind: 'quad4', height: 1.45, radius: 0.65, eyeY: 1.3, body: K.body,
    animate(st, dt) {
      animateQuadKit(K, st, dt, { 
        ...o, 
        gait: 4.2, 
        tailWag: st.crouch ? 12 : 2.5, 
        tailSwing: st.crouch ? 0.28 : 0.35, 
        tailLift: st.chasing ? 0.15 : 0.65 
      });

      // Jaw snapping & unhinging movements
      jaw.rotation.x = (st.attack || 0) * 1.1 + (st.leap || 0) * 0.85 + (st.hiss || 0) * 0.7;
      for (const e of ears) e.rotation.x = -(st.crouch || 0) * 1.1 - (st.hiss || 0) * 0.8;
      
      // Intense violent pre-pounce body vibration
      if (st.crouch > 0.4) {
        K.body.rotation.z += Math.sin(st.t * 22) * 0.08 * st.crouch;
        K.head.position.y += Math.sin(st.t * 18) * 0.02 * st.crouch;
      }
    },
    anchors(key) { 
      const v = V(); 
      (key === 'head' ? K.head : key === 'foot' ? K.legs[0].paw : K.body).getWorldPosition(v); 
      return v; 
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.ninelives = buildNineLives;

// 5 ---------------------------------------------------------------- NINE LIVES
D.ninelives = {
  name: 'Nine Lives', speed: 1.6, chase: 3.8, detect: 24, dmg: 55, reach: 2.2, cd: 1.2, memory: 12, voice: 'yowl', noAttack: true,
  num: 'Φ-05 · Ailurophobia', cls: 'Lethal / Apex', size: '2.4 m long, 1.35 m shoulder height',
  desc: 'A colossal hairless apex beast resembling a mutated feline. Covered in scarred necrotic skin with massive saber fangs, bloodied claws, and crimson eyes that track prey in pitch darkness.',
  notes: 'Stalks silently behind you when unobserved. If caught in your spotlight, it arches its back and hisses before slinking into the shadows. The second your back is turned, it coils its spine and leaps.',
  tips: ['Never turn your back when you hear heavy claws scraping on the floor.', 'Keeping a flashlight locked on its eyes forces it to retreat.', 'It can leap across entire rooms in a single bound — maintain distance.'],
  sketch: [['head', 'saber fangs & red eye reflection'], ['chest', 'massive rib cage & veined skin'], ['foot', 'leaps ~9.5 m']],
  frame(m, e, dt, d, looked) {
    e.modeT = (e.modeT || 0) + dt;
    if (e.mode === 'crouch') {
      e.st.crouch = Math.min(1, (e.st.crouch || 0) + dt * 3.5); 
      e.speed = 0; 
      e.yaw = faceYaw(m, e); 
      e.threat = 0.95;
      
      if (looked > 0.25) { 
        e.mode = 'flee'; 
        e.modeT = 0; 
        e.st.hiss = 1; 
        m.game.audio.entity(e.type, 'voice', e.pos, PL(m)); 
        m.routeAway(e, 14); 
        return null; 
      }
      if (e.modeT > 0.9) { 
        e.mode = 'leap'; 
        e.modeT = 0; 
        startLunge(m, e, Math.min(9.5, d + 1.5), 0.5, 16); 
        m.game.audio.entity(e.type, 'attack', e.pos, PL(m)); 
      }
      return 'static';
    }
    if (e.mode === 'leap') {
      e.st.crouch = 0; 
      e.st.leap = Math.sin(Math.min(1, e.modeT / 0.5) * Math.PI);
      e.threat = 1;
      if (!lunge(m, e, dt)) { 
        e.st.leap = 0; 
        e.mode = 'flee'; 
        e.modeT = 0; 
        m.routeAway(e, 16); 
      }
      return 'static';
    }
    e.st.crouch = Math.max(0, (e.st.crouch || 0) - dt * 2.5); 
    e.st.hiss = Math.max(0, (e.st.hiss || 0) - dt);
    e.threat = e.mode === 'stalk' && d < 12 ? 0.4 : 0;
    return null;
  },
  think(m, e, d, sees) {
    const P = PL(m).pos;
    if (e.mode === 'flee') { 
      if (e.modeT > 4.5) e.mode = null; 
      else if (!e.path) m.routeAway(e, 14); 
      return; 
    }
    if (sees || e.mode === 'stalk') {
      e.mode = 'stalk'; 
      e.state = 'stalk';
      if (e.looked > 0.2 && d < 18) { 
        e.mode = 'flee'; 
        e.modeT = 0; 
        e.st.hiss = 1; 
        m.routeAway(e, 12); 
        return; 
      }
      if (d < 10.0 && e.looked <= 0 && m.nav.segmentClear(e.pos.x, e.pos.z, P.x, P.z, 0.3)) { 
        e.mode = 'crouch'; 
        e.modeT = 0; 
        e.path = null; 
        return; 
      }
      const pl = PL(m);
      const bx = P.x + Math.sin(pl.yaw) * 8, bz = P.z + Math.cos(pl.yaw) * 8;
      m.route(e, bx, bz);
      if (d > 45) e.mode = null;
      return;
    }
    if (!e.goal || e.idle > 0) m.wander(e);
  },
};

})();