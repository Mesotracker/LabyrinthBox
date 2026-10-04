// =============================================================================
//  The Worm   (entity id: 'worm')
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
const { clamp, limbGeo, merge, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * The Worm: a burrowing, ringed annelid some nine metres long, wide as a
 * person, with a lamprey mouth of rotating tooth rings. One continuous skinned
 * tube driven by 28 bones that follow the head's path.
 */
function buildWorm() {
  const rig = new Rig({ ...HUMAN });
  const SEG = 28, SL = 0.34, R = 0.42;
  const t = organic('wormskin', { base: '#8a6a62', dark: '#3a2622', light: '#c49a8c', veins: 0.6, vein: '#4a1822', pores: 0.5, wrinkle: 0.9, wrinkleF: 28, mottle: 0.8, repeat: [2, 6] });
  const skin = fleshMat(t, { rough: 0.32, bumpScale: 3 });
  const bones = [];
  for (let i = 0; i < SEG; i++) {
    const b = new THREE.Bone(); b.position.set(0, 0, -i * SL); rig.root.add(b); rig.bones.push(b); bones.push(b);
  }
  // body tube along -z, ringed (annuli every segment), thicker in the middle
  const rings = SEG * 4, radial = 20;
  const pos = [], nrm = [], uv = [], si = [], sw = [], idx = [];
  for (let j = 0; j <= rings; j++) {
    const s = j / rings;
    const z = -s * (SEG - 1) * SL;
    const prof = Math.sin(Math.min(1, s * 6) * Math.PI / 2) * (1 - Math.pow(s, 3) * 0.75);
    const annulus = 1 + 0.06 * Math.cos(j * Math.PI / 2);
    const r = R * prof * annulus + 0.04;
    const f = s * (SEG - 1);
    const b0 = Math.min(SEG - 1, Math.floor(f)), b1 = Math.min(SEG - 1, b0 + 1), w1 = f - b0;
    for (let i = 0; i <= radial; i++) {
      const a = (i / radial) * Math.PI * 2;
      const flat = Math.sin(a) < 0 ? 0.85 : 1; // flatter belly
      pos.push(Math.cos(a) * r, Math.sin(a) * r * flat, z);
      nrm.push(Math.cos(a), Math.sin(a), 0);
      uv.push(i / radial, s * 6);
      si.push(b0, b1, 0, 0); sw.push(1 - w1, w1, 0, 0);
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < radial; i++) {
    const a = j * (radial + 1) + i, b = a + radial + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  g.setIndex(idx);
  g.computeVertexNormals();
  rig.root.updateMatrixWorld(true);
  rig.skeleton = new THREE.Skeleton(bones); // skin indices are segment numbers
  const body = new THREE.SkinnedMesh(g, skin);
  body.frustumCulled = false; body.castShadow = true;
  rig.root.add(body); body.updateMatrixWorld(true);
  body.bind(rig.skeleton, new THREE.Matrix4());
  rig.done = true;
  // mouth: lips, three counter-rotating rings of hooked teeth, sensory barbels
  const head = bones[0];
  const lip = skinMat('#5a2a2a', { rough: 0.25 });
  const gullet = skinMat('#120405', { rough: 0.2 });
  const toothM = skinMat('#e6dcc0', { rough: 0.25 });
  head.add(new THREE.Mesh(xf(new THREE.TorusGeometry(0.33, 0.07, 10, 26), {}), lip));
  head.add(new THREE.Mesh(xf(new THREE.CircleGeometry(0.33, 24), { z: -0.12 }), gullet));
  const toothRings = [];
  for (let r = 0; r < 3; r++) {
    const ring = new THREE.Group(); ring.position.z = -0.02 - r * 0.07; head.add(ring);
    const n = 14 + r * 3, rr = 0.31 - r * 0.07;
    const list = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      list.push(xf(new THREE.ConeGeometry(0.018 - r * 0.003, 0.11 - r * 0.02, 5), { x: Math.cos(a) * rr, y: Math.sin(a) * rr, rz: a + Math.PI / 2, rx: -0.5 }));
    }
    ring.add(new THREE.Mesh(merge(list), toothM));
    toothRings.push(ring);
  }
  const barbels = [];
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const bb = new THREE.Group(); bb.position.set(Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0.02); bb.rotation.set(0, 0, a - Math.PI / 2); head.add(bb);
    bb.add(new THREE.Mesh(xf(limbGeo(0.3, 0.02, 0.006), { rx: 1.2 }), skin));
    barbels.push(bb);
  }
  const trail = []; // world-space head history: [x, y, z]
  const q = new THREE.Quaternion(), fwd = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1);
  return result(rig, {
    kind: 'worm', height: 1.0, radius: 0.7, eyeY: 0.6, worldSpace: true, bones, trail,
    animate(st, dt) {
      st.t += dt;
      // st.head: {x,y,z} world head position, written by the AI
      const H = st.head;
      if (!H) return;
      const last = trail[0];
      if (!last || Math.hypot(H.x - last[0], H.y - last[1], H.z - last[2]) > 0.06) trail.unshift([H.x, H.y, H.z]);
      if (trail.length > 400) trail.length = 400;
      // walk back along the trail placing a bone every SL metres
      let ti = 0, acc = 0;
      let px = H.x, py = H.y, pz = H.z;
      for (let i = 0; i < SEG; i++) {
        const want = i * SL;
        while (ti < trail.length - 1) {
          const [ax, ay, az] = trail[ti], [bx, by, bz] = trail[ti + 1];
          const d = Math.hypot(bx - ax, by - ay, bz - az);
          if (acc + d >= want) { const k = (want - acc) / (d || 1); px = ax + (bx - ax) * k; py = ay + (by - ay) * k; pz = az + (bz - az) * k; break; }
          acc += d; ti++;
          px = bx; py = by; pz = bz;
        }
        if (i === 0) { px = H.x; py = H.y; pz = H.z; }
        const b = bones[i];
        // peristalsis: a contraction wave travels down the body
        const wave = Math.sin(st.t * 6 - i * 0.7) * 0.04 * (st.speed > 0.2 ? 1 : 0.3);
        b.position.set(px, py + wave, pz);
      }
      for (let i = 0; i < SEG; i++) {
        const a = bones[i].position, b = bones[Math.min(SEG - 1, i + 1)].position;
        fwd.set(a.x - b.x, a.y - b.y, a.z - b.z);
        if (i === SEG - 1) { const c = bones[i - 1].position; fwd.set(c.x - a.x, c.y - a.y, c.z - a.z); }
        if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, 1);
        fwd.normalize();
        q.setFromUnitVectors(Z, fwd);
        bones[i].quaternion.copy(q);
        bones[i].rotateZ(Math.sin(st.t * 0.8 + i * 0.3) * 0.2);
        const sc = 1 + Math.sin(st.t * 6 - i * 0.7) * 0.06;
        bones[i].scale.set(sc, sc, 1);
      }
      const open = clamp((st.attack || 0) * 1.5 + (st.breach || 0) * 0.5, 0, 1);
      toothRings.forEach((r, k) => { r.rotation.z += dt * (k % 2 ? -1 : 1) * (0.6 + open * 4); r.scale.setScalar(0.75 + open * 0.35); });
      for (const bb of barbels) bb.rotation.x = Math.sin(st.t * 4 + bb.rotation.z * 3) * 0.3 - open * 0.6;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.worm = buildWorm;

ENTITY_DEFS.worm = { name: 'The Worm', speed: 1.7, chase: 4.6, detect: 16, dmg: 45, reach: 1.8, cd: 4, memory: 8, burrow: true, rare: true,
  num: 'Rare · burrower', cls: 'Lethal', size: '~9 m long, 0.9 m thick',
  desc: 'A ringed, burrowing worm nine metres long with a lamprey mouth of rotating teeth. It hunts by vibration.',
  notes: 'It travels under the floor; you feel it before you see it — a rumble, then dust. When it is under you it bursts up in an arc, strikes and dives again.',
  tips: ['Footsteps draw it. Crouch-walk or stand still when the floor rumbles.', 'When the dust jumps, sprint sideways — never straight ahead.'] };
})();
