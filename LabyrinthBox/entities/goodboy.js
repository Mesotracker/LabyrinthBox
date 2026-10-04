// =============================================================================
//  The Good Boy   (entity id: 'goodboy')
//
//  One self-contained entity file:
//    - Massive, fierce wolf-like predator model builder
//    - Ash-dark fur, glowing amber eye halos, giant canine fangs & spiked collar
//    - Field guide stats and aggressive pack-hunting AI hooks
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { animateQuadKit, eyeTex, haloMat, quadKit, V } = __mod['src/phobia/models_a.js'];
const { ellipsoid, glowMat, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { fleshMat, HUMAN, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, hunt, PL, TAU } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 3  THE GOOD BOY (cynophobia)
const wolfFur = () => organic('wolffur', { 
  base: '#1a1715', 
  dark: '#0c0a09', 
  light: '#423d38', 
  veins: 0.15, 
  vein: '#4a1212', 
  pores: 0.8, 
  poreF: 160, 
  wrinkle: 0.9, 
  wrinkleF: 220, 
  mottle: 0.9, 
  tears: 0.5, 
  tearF: 9, 
  extra: '#73685e' 
});

function buildGoodBoy() {
  const rig = new Rig({ ...HUMAN });
  const t = wolfFur();
  const fur = fleshMat(t, { rough: 0.92, bumpScale: 3.4, emissive: '#0a0505', emissiveIntensity: 0.15 });

  // Fierce, oversized wolf proportions (1.35m shoulder, heavy chest, muscular limbs)
  const o = { 
    hipY: 1.35, 
    chestR: 0.44, 
    hipR: 0.32, 
    len: 1.8, 
    neckLen: 0.48, 
    legA: 0.52, 
    legB: 0.48, 
    legC: 0.32, 
    legR: 0.088, 
    tailN: 10, 
    tailSeg: 0.11, 
    tailR: 0.06, 
    skin: fur, 
    claws: 0.12, 
    clawMat: skinMat('#0d0b0a', { rough: 0.15, emissive: '#330000', emissiveIntensity: 0.2 }), 
    spineBumps: true, 
    ribs: true, 
    tuck: 0.1 
  };
  
  const K = quadKit(rig, o);
  const add = K.add;

  // Broad wolf skull & extended predatory muzzle
  add(xf(ellipsoid(0.22, 0.19, 0.24), { z: 0.08 }), fur, K.head);
  add(xf(ellipsoid(0.12, 0.11, 0.28), { z: 0.34, y: -0.04 }), fur, K.head); // Long tapering snout
  add(xf(ellipsoid(0.05, 0.04, 0.045), { z: 0.60, y: -0.01 }), skinMat('#0a0807', { rough: 0.2 }), K.head); // Black nose pad

  // Neck ruff / mane volume
  add(xf(ellipsoid(0.38, 0.36, 0.3), { z: -0.15, y: -0.05 }), fur, K.neck);

  // High-set, alert wolf ears
  const ears = [];
  for (const s of [-1, 1]) {
    const ear = add(xf(new THREE.ConeGeometry(0.08, 0.28, 5), { x: s * 0.13, y: 0.22, z: -0.02, rz: -s * 0.22, rx: 0.15, ry: s * 0.1 }), fur, K.head);
    ears.push(ear);

    // Glowing amber eyes with slit pupils & reflective halos
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 12), glowMat('#ffffff', { map: eyeTex('#ffaa00', { slit: true }) }));
    eye.position.set(s * 0.11, 0.07, 0.24);
    eye.rotation.y = s * 0.25;
    K.head.add(eye);

    const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), haloMat('#ff8800', 0.55));
    hl.position.set(s * 0.11, 0.07, 0.28);
    hl.userData.noSketch = true;
    K.head.add(hl);
  }

  // Deep gaping jaw with gums & monstrous canine fangs
  const jaw = new THREE.Group(); 
  jaw.position.set(0, -0.09, 0.08); 
  K.head.add(jaw);

  add(xf(ellipsoid(0.11, 0.05, 0.26), { z: 0.22 }), fur, jaw);

  const gum = skinMat('#4a0d13', { rough: 0.3, emissive: '#1a0003', emissiveIntensity: 0.2 });
  add(xf(ellipsoid(0.1, 0.018, 0.25), { y: -0.11, z: 0.28 }), gum, K.head);
  add(xf(ellipsoid(0.09, 0.018, 0.23), { y: 0.03, z: 0.24 }), gum, jaw);

  const toothMat = skinMat('#ded7c5', { rough: 0.15 });
  const tu = [], tl = [];

  // Large upper & lower main wolf canine fangs
  for (const s of [-1, 1]) {
    tu.push(xf(new THREE.ConeGeometry(0.022, 0.13, 5), { x: s * 0.08, y: -0.13, z: 0.48, rx: Math.PI * 0.88, rz: s * 0.08 }));
    tl.push(xf(new THREE.ConeGeometry(0.02, 0.11, 5), { x: s * 0.07, y: 0.07, z: 0.43, rx: Math.PI * 0.12, rz: -s * 0.08 }));
  }

  // Rows of sharp interlocking teeth (24 total)
  for (let i = 0; i < 20; i++) {
    const a = (i / 19 - 0.5) * 2.5;
    tu.push(xf(new THREE.ConeGeometry(0.01, 0.05, 4), { x: Math.sin(a) * 0.085, y: -0.12, z: 0.24 + Math.cos(a) * 0.22, rx: Math.PI * 0.9 }));
    tl.push(xf(new THREE.ConeGeometry(0.009, 0.045, 4), { x: Math.sin(a) * 0.078, y: 0.05, z: 0.22 + Math.cos(a) * 0.2, rx: Math.PI * 0.1 }));
  }
  add(merge(tu), toothMat, K.head); 
  add(merge(tl), toothMat, jaw);

  // Spiked iron collar with tarnished metal tag
  const collar = skinMat('#2a1a18', { rough: 0.7, emissive: '#0d0505' });
  const iron = skinMat('#55504a', { metal: 0.9, rough: 0.25 });
  
  add(xf(new THREE.TorusGeometry(0.28, 0.035, 8, 22), { y: 0.08, rx: Math.PI / 2 + 0.8 }), collar, K.neck);
  
  // Iron spikes around collar
  const spikes = [];
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * TAU;
    spikes.push(xf(new THREE.ConeGeometry(0.015, 0.07, 5), { 
      x: Math.sin(ang) * 0.3, 
      y: 0.08, 
      z: Math.cos(ang) * 0.3, 
      rx: Math.PI / 2, 
      ry: ang 
    }));
  }
  add(merge(spikes), iron, K.neck);
  add(xf(new THREE.CylinderGeometry(0.045, 0.045, 0.006, 14), { y: -0.12, z: 0.22, rx: 0.4 }), skinMat('#8a7038', { metal: 0.8, rough: 0.4 }), K.neck);

  rig.finalize();

  return result(rig, {
    kind: 'quad4', height: 1.45, radius: 0.65, eyeY: 1.25, body: K.body,
    animate(st, dt) {
      animateQuadKit(K, st, dt, { 
        ...o, 
        gait: 3.8, 
        tailWag: st.chasing ? 11 : 2.5, 
        tailSwing: st.chasing ? 0.35 : 0.45, 
        tailLift: st.chasing ? -0.1 : 0.5 
      });

      // Snarling jaw movement & lunging animation
      jaw.rotation.x = 0.12 + (st.chasing ? 0.45 + Math.sin(st.t * 14) * 0.16 : Math.max(0, Math.sin(st.t * 1.5)) * 0.2) + (st.attack || 0) * 0.75;
      
      // Fierce neck/head shuddering during chase
      if (st.chasing) {
        K.head.rotation.z = Math.sin(st.t * 20) * 0.05;
      }
    },
    anchors(key) { 
      const v = V(); 
      (key === 'head' ? K.head : key === 'foot' ? K.legs[0].paw : K.body).getWorldPosition(v); 
      if (key === 'hand') v.z -= 0.45; 
      return v; 
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.goodboy = buildGoodBoy;

// 3 ---------------------------------------------------------------- THE GOOD BOY
D.goodboy = {
  name: 'The Good Boy', speed: 1.8, chase: 6.2, detect: 18, dmg: 42, reach: 2.0, cd: 0.8, memory: 10, voice: 'bark',
  num: 'Φ-03 · Cynophobia', cls: 'Apex Hostile', size: '1.35 m shoulder height, 2.3 m long',
  desc: 'A ferocious, towering wolf-beast with charred dark fur, a wide jaw bristling with canine fangs, and glowing amber eyes. A spiked iron collar hangs loose around its neck.',
  notes: 'Hunts in packs. They stalk silently before forming a perimeter. Running triggers their predatory chase instinct immediately.',
  tips: ['Do not run when encircled — back away slowly.', 'Keep direct eye contact with the lead wolf to stall their rush.', 'Back into narrow corridors to choke off pack flanks.'],
  sketch: [['head', 'massive canine fangs & amber eyes'], ['chest', 'spiked collar & heavy mane'], ['foot', 'relentless pack stalker']],
  think(m, e, d, sees) {
    const pl = PL(m), P = pl.pos;
    e.modeT = (e.modeT || 0) + 0.2;
    if (sees && !e.mode) {
      for (const o of m.list) {
        if (o.type === 'goodboy' && !o.mode && Math.hypot(o.pos.x - e.pos.x, o.pos.z - e.pos.z) < 55) { 
          o.mode = 'circle'; 
          o.modeT = 0; 
          o.orbit = m.rng.next() * TAU; 
          o.rushAt = 3.5 + m.rng.next() * 4.5; 
        }
      }
      m.game.audio.entity(e.type, 'alert', e.pos, pl);
    }
    if (e.mode === 'circle') {
      e.state = 'stalk'; 
      e.threat = 0.65;
      e.orbit += 0.14;
      const r = 8.5;
      m.route(e, P.x + Math.sin(e.orbit) * r, P.z + Math.cos(e.orbit) * r);
      if (pl.sprinting || e.modeT > e.rushAt) { 
        e.mode = 'rush'; 
        e.modeT = 0; 
        m.alert(e); 
      }
      if (d > 35) { 
        e.mode = null; 
        e.state = 'wander'; 
      }
      return;
    }
    if (e.mode === 'rush') {
      chaseTo(m, e);
      if (e.looked > 0.9 && d < 8.5 && !pl.sprinting && (e.stared = (e.stared || 0) + 0.2) > 0.5) { 
        e.stared = -2; 
        e.pauseT = 1.1; 
        m.game.audio.entity(e.type, 'voice', e.pos, pl); 
        m.game.bus.emit('stare'); 
      }
      if (e.modeT > 8) { 
        e.mode = 'circle'; 
        e.modeT = 0; 
        e.rushAt = 2.5 + m.rng.next() * 4; 
      }
      return;
    }
    hunt(m, e, d, false);
  },
  onHit(m, e) { 
    e.mode = 'circle'; 
    e.modeT = 0; 
    e.rushAt = 2.5 + m.rng.next() * 3.5; 
  },
};

})();