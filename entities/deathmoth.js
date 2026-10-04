// =============================================================================
//  Deathmoth   (entity id: 'deathmoth')
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
const { fleshMat, HUMAN, mothWing, organic, result } = __mod['src/entities/models.js'].HELPERS;
const { ellipsoid, glowMat, limbGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

function buildDeathmoth() {
  const rig = new Rig({ ...HUMAN, hipH: 0 });
  // Dark, menacing, dusty dark-brown/charred fur characteristic of the Backrooms Deathmoth
  const furT = organic('mothfur', { base: '#2b231d', dark: '#120e0a', light: '#4d3d31', veins: 0, pores: 0.7, poreF: 100, wrinkle: 0.7, wrinkleF: 180, mottle: 0.8 });
  const fur = fleshMat(furT, { rough: 0.95, bumpScale: 2.8 });
  
  const body = new THREE.Group(); 
  body.position.y = 1.9; 
  rig.body.add(body);
  
  const add = (g, m = fur, parent = body) => { 
    const me = new THREE.Mesh(g, m); 
    me.castShadow = true; 
    parent.add(me); 
    return me; 
  };

  // Thorax (bulky, heavily armored and bristling with spikes/coarse fur)
  add(ellipsoid(0.20, 0.18, 0.24));

  // Abdomen (longer, segmented, menacingly tapered tail)
  const abdomen = new THREE.Group(); 
  abdomen.position.z = -0.20; 
  body.add(abdomen);
  add(xf(ellipsoid(0.14, 0.14, 0.48), { z: -0.3 }), fur, abdomen);
  
  for (let i = 0; i < 6; i++) {
    add(xf(new THREE.TorusGeometry(0.13 - i * 0.015, 0.015, 6, 16), { z: -0.14 - i * 0.08 }), fur, abdomen);
  }

  // Head
  const head = new THREE.Group(); 
  head.position.z = 0.26; 
  body.add(head);
  add(ellipsoid(0.12, 0.11, 0.11), fur, head);

  // Intensely glowing, blood-red compound eyes (true to fandom Deathmoth design)
  const eyeMat = glowMat('#ff1100', { intensity: 4.0 });
  for (const x of [-0.085, 0.085]) {
    add(xf(ellipsoid(0.065, 0.065, 0.065), { x, z: 0.05, y: 0.025 }), eyeMat, head);
  }

  // Terrifying mandibular mouthparts / palps beneath the head
  const mandibleMat = skinMat('#110a08', { rough: 0.5 });
  for (const x of [-0.04, 0.04]) {
    add(xf(limbGeo(0.12, 0.025, 0.015), { x, y: -0.09, z: 0.08, rx: 0.6, rz: x > 0 ? 0.3 : -0.3 }), mandibleMat, head);
  }

  // Feathery, menacingly large bipectinate antennae
  const antennae = [];
  for (const s of [-1, 1]) {
    const a = new THREE.Group(); 
    a.position.set(s * 0.05, 0.07, 0.07); 
    head.add(a);
    add(xf(limbGeo(0.35, 0.01, 0.005), { rx: -0.9, rz: s * -0.4 }), fur, a);
    for (let k = 0; k < 12; k++) {
      add(xf(limbGeo(0.06, 0.004, 0.001), { y: -0.05 - k * 0.022, rx: -0.9, rz: s * -0.4 - s * 1.1 }), fur, a);
    }
    antennae.push(a);
  }

  // Spidery, razor-sharp multi-jointed legs
  const legs = [];
  const legMat = skinMat('#1a1410', { rough: 0.6 });
  for (let i = 0; i < 3; i++) {
    for (const s of [-1, 1]) {
      const hip = new THREE.Group(); 
      hip.position.set(s * 0.12, -0.1, 0.1 - i * 0.12); 
      body.add(hip);
      add(limbGeo(0.22, 0.016, 0.01), legMat, hip);
      const knee = new THREE.Group(); 
      knee.position.y = -0.22; 
      hip.add(knee);
      add(limbGeo(0.25, 0.012, 0.006), legMat, knee);
      hip.rotation.set(0.4, 0, s * 1.1);
      legs.push({ hip, knee, s, i });
    }
  }

  // Tattered, ominous wings with warning eyespots (fandom accurate Deathmoth wings)
  const wingMat = skinMat('#ffffff', { 
    map: mothWing().map, 
    bump: mothWing().bump, 
    bumpScale: 1.5, 
    transparent: true, 
    alphaTest: 0.4, 
    side: THREE.DoubleSide, 
    rough: 0.85 
  });
  
  const wings = [];
  for (const s of [-1, 1]) {
    for (const back of [0, 1]) {
      const pivot = new THREE.Group(); 
      pivot.position.set(s * 0.14, 0.1, back ? -0.14 : 0.08); 
      body.add(pivot);
      
      const g = new THREE.PlaneGeometry(back ? 1.0 : 1.45, back ? 0.7 : 0.9, 8, 4);
      g.rotateX(-Math.PI / 2);
      g.translate((back ? 0.5 : 0.7) * s, 0, back ? -0.22 : 0);
      if (s < 0) { 
        const uv = g.attributes.uv; 
        for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i)); 
      }
      
      const pa = g.attributes.position;
      for (let i = 0; i < pa.count; i++) {
        pa.setY(i, Math.sin(Math.abs(pa.getX(i)) * 2.5) * 0.07);
      }
      g.computeVertexNormals();
      
      const w = new THREE.Mesh(g, wingMat); 
      w.castShadow = true; 
      pivot.add(w);
      wings.push({ pivot, s, back });
    }
  }

  return result(rig, {
    kind: 'fly', height: 2.5, radius: 0.55, eyeY: 2.0, body,
    animate(st, dt) {
      st.t += dt;
      const f = 9 + st.speed * 2.0; // Faster, more menacing wing flutter
      st.phase += dt * f;
      for (const w of wings) w.pivot.rotation.z = w.s * (Math.sin(st.phase - w.back * 0.4) * 0.95 + 0.05);
      for (const w of wings) w.pivot.rotation.x = Math.cos(st.phase - w.back * 0.4) * 0.15;
      
      body.position.y = (st.alt || 1.9) + Math.sin(st.phase * 0.5) * 0.1 - (st.attack || 0) * 0.7;
      body.rotation.x = -0.2 + st.speed * 0.06 + (st.attack || 0) * 0.6;
      body.rotation.z = Math.sin(st.t * 1.5) * 0.15;
      
      abdomen.rotation.x = Math.sin(st.phase * 0.5) * 0.12 + (st.attack || 0) * 0.5;
      for (const a of antennae) a.rotation.x = Math.sin(st.t * 2.8 + a.position.x * 40) * 0.2;
      for (const L of legs) { 
        L.hip.rotation.x = 0.4 + Math.sin(st.t * 7 + L.i + L.s) * 0.15 - (st.attack || 0) * 0.9; 
        L.knee.rotation.x = 0.7 + Math.cos(st.t * 7 + L.i) * 0.18; 
      }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.deathmoth = buildDeathmoth;

ENTITY_DEFS.deathmoth = { name: 'Deathmoth', speed: 1.6, chase: 3.7, detect: 11, dmg: 25, reach: 1.8, cd: 1.2, memory: 5, fly: true,
  num: 'Entity 14', cls: 'Hostile', size: '2.8 m wingspan',
  desc: 'A horrific, dog-sized moth with glowing red compound eyes, feathery antennae, and tattered wings bearing unsettling warning eyespots.',
  notes: 'Extremely aggressive when provoked or exposed to light. Its deafening wingbeats and glowing red eyes make it one of the most terrifying entities in the Backrooms.',
  tips: ['Turn off your flashlight immediately if you hear its wings.', 'Hide in enclosed rooms or hallways where it cannot maneuver its huge wingspan.'] };
})();