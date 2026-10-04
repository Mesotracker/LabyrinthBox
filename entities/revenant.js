// =============================================================================
//  The Revenant   (entity id: 'revenant')
//
//  One self-contained entity file:
//    - Tactile, textured ghostly entity built to respond realistically to scene lights
//    - Balanced translucency & subtle emissive core without washed-out glow
//    - Procedural bump/normal maps for fabric wear and decaying skin texture
//    - Dynamic dripping blood particle emitter & light-distorting AI hooks
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { hairCurtain, haloMat, sprite } = __mod['src/phobia/models_a.js'];
const { animateBiped, canvasTex, clamp, latheGeo, lerp, poseHand, Rig, skinMat } = __mod['src/entities/rig.js'];
const { buildBody, cloth, face, fleshMat, headLift, headOn, HUMAN, noiseFill, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, inBeam, PL, place, spotAround } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ PROCEDURAL BUMP & TEXTURE MAPS
// Cloth weave & tear bump texture generator
const gownBumpTex = () => tex('gown_bump', () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#808080';
  g.fillRect(0, 0, w, h);
  
  // Micro weave noise
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    const val = Math.floor(Math.random() * 80 + 110);
    g.fillStyle = `rgb(${val},${val},${val})`;
    g.fillRect(x, y, 1.5, 1.5);
  }

  // Wrinkles and torn fabric seams
  g.strokeStyle = '#202020';
  g.lineWidth = 2.5;
  for (let i = 0; i < 24; i++) {
    g.beginPath();
    const x0 = Math.random() * w, y0 = Math.random() * h;
    g.moveTo(x0, y0);
    g.bezierCurveTo(x0 + (Math.random() - 0.5) * 80, y0 + 40, x0 + (Math.random() - 0.5) * 80, y0 + 120, x0 + (Math.random() - 0.5) * 100, y0 + 200);
    g.stroke();
  }
}));

const texturedGownTex = () => cloth('gown_textured', { 
  base: '#d8e2e6', 
  dark: '#8a99a0', 
  stain: '#5c0006', 
  weave: 240, 
  stains: 0.55, 
  wear: 0.65 
});

const brightHorrorFace = () => tex('ghostface_bright_textured', () => canvasTex(512, 512, (g, w, h) => {
  // Pale mottled skin base with detailed micro-pores & decaying tone variation
  noiseFill(g, w, h, '#dbe5e8', ['#b0c2c7', '#eaf2f5', '#889ba2', '#521418']);
  
  // Hollow eye sockets with subtle crimson inflammation
  for (const x of [0.34, 0.66]) {
    const r = g.createRadialGradient(w * x, h * 0.38, 2, w * x, h * 0.38, w * 0.12);
    r.addColorStop(0, 'rgba(90, 0, 8, 0.95)');
    r.addColorStop(0.5, 'rgba(140, 20, 28, 0.5)');
    r.addColorStop(1, 'rgba(219, 229, 232, 0)');
    g.fillStyle = r;
    g.beginPath();
    g.ellipse(w * x, h * 0.38, w * 0.1, h * 0.09, 0, 0, Math.PI * 2);
    g.fill();

    // Pale luminescent eyes
    const pr = g.createRadialGradient(w * x, h * 0.38, 0, w * x, h * 0.38, w * 0.04);
    pr.addColorStop(0, '#ffffff');
    pr.addColorStop(0.7, '#c2f0f5');
    pr.addColorStop(1, '#50a0a8');
    g.fillStyle = pr;
    g.beginPath();
    g.arc(w * x, h * 0.38, w * 0.04, 0, Math.PI * 2);
    g.fill();

    // Deep crimson blood trails down face
    g.strokeStyle = '#7a0008';
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(w * x, h * 0.44);
    g.bezierCurveTo(w * (x + 0.02), h * 0.6, w * (x - 0.03), h * 0.75, w * (x + 0.01), h * 0.98);
    g.stroke();

    // Blood droplets
    g.fillStyle = '#5c0005';
    g.beginPath(); g.arc(w * x + 3, h * 0.68, 3, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(w * x - 4, h * 0.82, 2, 0, Math.PI * 2); g.fill();
  }

  // Open mouth with realistic dark cavity
  const mr = g.createRadialGradient(w * 0.5, h * 0.74, 2, w * 0.5, h * 0.74, w * 0.14);
  mr.addColorStop(0, '#2b0003');
  mr.addColorStop(0.6, '#660009');
  mr.addColorStop(1, 'rgba(219, 229, 232, 0)');
  g.fillStyle = mr;
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.74, w * 0.07, h * 0.13, 0, 0, Math.PI * 2);
  g.fill();

  // Blood trail running from jaw
  g.strokeStyle = '#8c000a';
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(w * 0.48, h * 0.82);
  g.bezierCurveTo(w * 0.49, h * 0.9, w * 0.47, h * 0.95, w * 0.48, h * 1.0);
  g.stroke();
}));

// ------------------------------------------------------------------ DRIPPING BLOOD SYSTEM
function createBloodDripSystem(THREE, count = 28) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const velocities = new Float32Array(count);
  const initialY = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = (Math.random() - 0.5) * 0.42;
    const y = 0.4 + Math.random() * 1.2;
    pos[i * 3 + 1] = y;
    initialY[i] = y;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.42;
    velocities[i] = 0.7 + Math.random() * 1.2;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  
  const mat = new THREE.PointsMaterial({
    color: 0x8b0000,
    size: 0.038,
    transparent: true,
    opacity: 0.9,
    blending: THREE.NormalBlending
  });

  const pSystem = new THREE.Points(geo, mat);

  pSystem.update = function (dt) {
    const pArr = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pArr[i * 3 + 1] -= velocities[i] * dt;
      if (pArr[i * 3 + 1] < 0) {
        pArr[i * 3 + 1] = initialY[i];
      }
    }
    geo.attributes.position.needsUpdate = true;
  };

  return pSystem;
}

// ------------------------------------------------------------------ BUILDER
function buildRevenant() {
  const p = { 
    ...HUMAN, 
    hipH: 1.02, 
    chestW: 0.24, 
    armR: 0.95, 
    legR: 0.58, 
    upperArm: 0.42, 
    foreArm: 0.44, 
    headR: 0.115, 
    neck: 0.16 
  };
  
  const rig = new Rig(p);

  // Mottled pale skin with rough surface details and subtle subsurface depth
  const st0 = organic('paleghostskin', { 
    base: '#bdcad0', 
    dark: '#73838a', 
    light: '#e1eaed', 
    veins: 0.85, 
    vein: '#730008', 
    pores: 0.5, 
    mottle: 0.55 
  });

  const skin = fleshMat(st0, { 
    rough: 0.45, 
    bumpScale: 0.9, 
    transparent: true, 
    opacity: 0.88, 
    emissive: '#102228', 
    emissiveIntensity: 0.15 
  });
  
  const gt = texturedGownTex();
  const bumpMap = gownBumpTex();

  // Textured fabric gown responding to environment lighting rather than self-illuminating
  const gown = skinMat('#c4d0d6', { 
    map: gt.map, 
    bumpMap: bumpMap, 
    bumpScale: 1.8, 
    rough: 0.75, 
    side: THREE.DoubleSide, 
    transparent: true, 
    opacity: 0.82, 
    emissive: '#122026', 
    emissiveIntensity: 0.12 
  });

  buildBody(rig, p, { skin, top: gown, bottom: skin, shoes: skin }, { sleeve: true, fingerLen: 0.22, fingerVar: true, chestDepth: 0.42 });

  headOn(rig, p, skin, 0.9, 1.25, 1.0);
  face(rig, p, null, skinMat('#ffffff', { 
    map: brightHorrorFace(), 
    transparent: true, 
    opacity: 0.92, 
    rough: 0.5, 
    emissive: '#102026', 
    emissiveIntensity: 0.15 
  }));

  const hl = headLift(p);
  
  // Fine silver-grey strands
  const hair = hairCurtain(0.85, 140, 0.14, '#abb8bf', 0.75);
  hair.position.y = hl + 0.06;
  rig.head.add(hair);

  // Shredded trailing dress lathe
  const gG = latheGeo([[-p.hipH - 0.22, 0.42], [-p.hipH * 0.7, 0.3], [-p.hipH * 0.35, 0.22], [0.0, 0.19], [0.2, 0.18]], 0.85, 28);
  const pa = gG.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
    const a = Math.atan2(z, x);
    const tear = Math.sin(a * 15) * 0.08 * clamp(-y, 0, 1.2);
    pa.setXYZ(i, x * (1 + tear), y + (y < -0.8 ? tear : 0), z * (1 + tear));
  }
  gG.computeVertexNormals();
  const dress = rig.attach(rig.hips, gG, gown, { rigid: true });

  // Dripping blood particle system
  const bloodDrips = createBloodDripSystem(THREE, 32);
  rig.root.add(bloodDrips);

  // Subtle spectral aura mist
  const aura = sprite(haloMat('#4a7885').map, 0x3d6672, 2.6, 0.22);
  aura.material.blending = THREE.AdditiveBlending;
  aura.position.y = 1.1;
  rig.root.add(aura);

  return result(rig, {
    kind: 'biped', height: 2.05, radius: 0.35, eyeY: 1.8, float: 0.25, aura,
    animate(st, dt) {
      bloodDrips.update(dt);

      st.lean = 0.12; 
      st.hunch = 0.25; 
      st.armSwing = 0.04; 
      st.stride = 3.8; 
      
      const twitch = Math.random() < 0.06 ? (Math.random() - 0.5) * 0.4 : 0;
      st.tilt = Math.sin(st.t * 1.0) * 0.2 + twitch;
      
      const sp = st.speed; 
      st.speed = sp * 0.1;
      animateBiped(rig, st, dt);
      st.speed = sp;

      rig.hips.position.y += 0.25 + Math.sin(st.t * 1.8) * 0.07;
      rig.head.rotation.z = twitch;

      for (const L of rig.legs) { 
        L.hip.rotation.x = -0.1; 
        L.kn.rotation.x = 0.25; 
        L.an.rotation.x = 0.5; 
      }

      const att = st.attack || 0, reach = Math.max(att, st.reach || 0);
      for (const A of rig.arms) {
        A.sh.rotation.x = lerp(-0.1, -1.6, reach) + Math.sin(st.t * 1.1 + A.side) * 0.06;
        A.el.rotation.x = lerp(-0.2, -0.4, reach);
        poseHand(A, 0.6, 0.8, st.t);
      }

      dress.rotation.x = Math.sin(st.t * 1.0) * 0.06 + sp * 0.1;
      dress.rotation.z = Math.sin(st.t * 0.7) * 0.05;
    },
  });
}

__mod['src/entities/registry.js'].BUILDERS.revenant = buildRevenant;

// ------------------------------------------------------------------ FIELD DATA & AI HOOKS
D.revenant = {
  name: 'The Revenant', speed: 0.7, chase: 2.4, detect: 35, dmg: 38, reach: 1.6, cd: 2.2, memory: 35, noclip: true, xray: true, fade: true, voice: 'wail', silent: false,
  num: 'Φ-06 · Phasmophobia', cls: 'Hostile / Ethereal', size: '2.05 m, pale apparition',
  desc: 'A pale apparition weeping dark blood from her eyes and mouth. Her tattered gown catches low light as she drifts above the floor.',
  notes: 'Her subtle glow allows her to blend into dim ambient lighting, making her difficult to spot until she is close.',
  tips: ['Sweep flashlight beams across corridors to catch her silhouette.', 'Dodge behind solid obstacles when she blinks forward.', 'Banish her by locking your flashlight beam on her.'],
  sketch: [['aura', 'faint pale aura'], ['face', 'porcelain weeping blood'], ['gown', 'tattered textured linen']],
  init(m, e) { e.alpha = 0; e.alphaWant = 0.12; e.blinkT = 5; e.lightT = 0; },
  frame(m, e, dt, d, looked) {
    const pl = PL(m);
    const beam = inBeam(m, e, looked, d, 0.82);
    
    e.alphaWant = beam ? 0.95 : d < 6 ? 0.75 : 0.2;
    e.st.reach = d < 3.2 ? 1 : 0;
    
    e.lightT -= dt;
    if (e.lightT <= 0 && d < 25) {
      e.lightT = 0.25;
      for (const fx of m.game.lights.fixtures.values()) {
        if (Math.abs(fx.x - e.pos.x) > 8 || Math.abs(fx.z - e.pos.z) > 8) continue;
        m.game.lights.setOverride(fx, Math.random() < 0.7 ? 0.8 : 0.2, 0.2 + Math.random() * 0.3);
      }
    }

    if (beam) { 
      e.banish = (e.banish || 0) + dt; 
      if (e.banish > 1.6) { 
        e.banish = 0; 
        m.game.audio.entity(e.type, 'wail', e.pos, pl); 
        m.game.bus.emit('banish', e.type); 
        m.hide(e, 12 + m.rng.next() * 6); 
        return 'skip'; 
      } 
    } else {
      e.banish = Math.max(0, (e.banish || 0) - dt);
    }
    
    e.blinkT -= dt;
    if (e.blinkT <= 0 && looked <= 0 && d > 6) {
      e.blinkT = 4 + m.rng.next() * 4;
      const s = spotAround(m, -1, Math.max(3, d * 0.45), Math.max(5, d * 0.65), true, 1.7);
      if (s) place(m, e, s[0], s[1]);
    }
    
    e.threat = d < 10 ? 0.85 : 0;
    return null;
  },
  think(m, e) { chaseTo(m, e); e.path = [[PL(m).pos.x, PL(m).pos.z]]; },
};

})();