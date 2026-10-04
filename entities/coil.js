// =============================================================================
//  The Coil   (entity id: 'coil')
//
//  One self-contained entity file:
//    - the three.js model builder and its private textures/helpers
//    - its stats / field-guide entry and AI hooks
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { eyeball, V } = __mod['src/phobia/models_a.js'];
const { clamp, ellipsoid, paintTex, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { HUMAN, mix3, result, sm, tex } = __mod['src/entities/models.js'].HELPERS;
const { D, faceYaw, hunt, lunge, PL, startLunge, strike } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 2  THE COIL (ophidiophobia)
const scaleTex = () => tex('coilScales', () => paintTex(256, 512, (u, v, N, out) => {
  // diamond scales and dark python saddles down the back (u ~ 0.25 is the spine)
  const su = u * 28, sv = v * 120;
  const du = Math.abs((su % 1) - 0.5), dv = Math.abs(((sv + Math.floor(su) * 0.5) % 1) - 0.5);
  const sc = sm(0.42, 0.5, du + dv);
  const back = Math.cos((u - 0.25) * Math.PI * 2) * 0.5 + 0.5;
  const blot = sm(0.55, 0.62, N.fbm(u * 3, v * 9, 4, 3) + back * 0.25);
  const ring = sm(0.05, 0.0, Math.abs(blot - 0.5) - 0.05);
  let c = mix3([0.55, 0.47, 0.3], [0.78, 0.72, 0.55], 1 - back);      // pale belly
  c = mix3(c, [0.16, 0.12, 0.07], blot * back);
  c = mix3(c, [0.08, 0.06, 0.04], ring * 0.6);
  c = c.map((k) => k * (0.85 + sc * 0.15));
  out.h = 0.5 - sc * 0.3;
  return c;
}, { bump: true, repeat: [1, 2] }));


function buildCoil() {
  const rig = new Rig({ ...HUMAN });
  const SEG = 30, SL = 0.25, R = 0.17;
  const t = scaleTex();
  const skin = skinMat('#c8c8c8', { map: t.map, bump: t.bump, bumpScale: 1.6, rough: 0.35 });
  const bones = [];
  for (let i = 0; i < SEG; i++) { const b = new THREE.Bone(); b.position.set(0, 0, -i * SL); rig.root.add(b); rig.bones.push(b); bones.push(b); }
  const rings = SEG * 3, radial = 16;
  const pos = [], uv = [], si = [], sw = [], idx = [], nrm = [];
  for (let j = 0; j <= rings; j++) {
    const s = j / rings, z = -s * (SEG - 1) * SL;
    const prof = Math.sin(Math.min(1, s * 9) * Math.PI / 2) * (1 - Math.pow(s, 2.2) * 0.92);
    const r = R * prof + 0.012;
    const f = s * (SEG - 1), b0 = Math.min(SEG - 1, Math.floor(f)), b1 = Math.min(SEG - 1, b0 + 1), w1 = f - b0;
    for (let i = 0; i <= radial; i++) {
      const a = (i / radial) * Math.PI * 2;
      const flat = Math.sin(a) < 0 ? 0.7 : 1;
      pos.push(Math.cos(a) * r * 1.15, Math.sin(a) * r * flat, z);
      nrm.push(Math.cos(a), Math.sin(a), 0);
      uv.push(i / radial, s * 4);
      si.push(b0, b1, 0, 0); sw.push(1 - w1, w1, 0, 0);
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < radial; i++) { const a = j * (radial + 1) + i, b = a + radial + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  g.setIndex(idx); g.computeVertexNormals();
  rig.root.updateMatrixWorld(true);
  rig.skeleton = new THREE.Skeleton(bones);
  const mesh = new THREE.SkinnedMesh(g, skin); mesh.frustumCulled = false; mesh.castShadow = true;
  rig.root.add(mesh); mesh.updateMatrixWorld(true); mesh.bind(rig.skeleton, new THREE.Matrix4());
  rig.done = true;
  // the head: a broad wedge skull, heat pits, slit eyes, a forked tongue
  const head = new THREE.Group(); bones[0].add(head);
  const hm = (geo, m) => { const me = new THREE.Mesh(geo, m); me.castShadow = true; head.add(me); return me; };
  hm(xf(ellipsoid(0.15, 0.09, 0.2), { z: 0.08 }), skin);
  hm(xf(ellipsoid(0.11, 0.06, 0.12), { z: 0.2, y: -0.01 }), skin);
  const jaw = new THREE.Group(); jaw.position.set(0, -0.04, 0.02); head.add(jaw);
  const jm = new THREE.Mesh(xf(ellipsoid(0.12, 0.035, 0.2), { z: 0.1 }), skin); jaw.add(jm);
  const mouthM = skinMat('#5a1a22', { rough: 0.3 });
  hm(xf(ellipsoid(0.1, 0.01, 0.17), { y: -0.045, z: 0.11 }), mouthM);
  const fangM = skinMat('#eee6d0', { rough: 0.2 });
  for (const s of [-1, 1]) hm(xf(new THREE.ConeGeometry(0.008, 0.05, 5), { x: s * 0.05, y: -0.07, z: 0.22, rx: Math.PI }), fangM);
  for (const s of [-1, 1]) {
    const e = eyeball(0.026, '#b08a20', { slit: true }); e.position.set(s * 0.1, 0.035, 0.15); e.rotation.y = s * 0.9; head.add(e);
  }
  const tongue = new THREE.Group(); tongue.position.set(0, -0.03, 0.27); head.add(tongue);
  const tm = skinMat('#2a0a12', { rough: 0.3 });
  tongue.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 5), { rx: Math.PI / 2, z: 0.06 }), tm));
  for (const s of [-1, 1]) tongue.add(new THREE.Mesh(xf(new THREE.CylinderGeometry(0.003, 0.004, 0.06, 4), { rx: Math.PI / 2, z: 0.14, x: s * 0.012, ry: s * 0.4 }), tm));
  const trail = [];
  const q = new THREE.Quaternion(), fwd = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1), side = new THREE.Vector3();
  return result(rig, {
    kind: 'worm', height: 0.5, radius: 0.45, eyeY: 0.4, worldSpace: true, bones, trail, snake: true,
    animate(st, dt) {
      st.t += dt;
      const H = st.head;
      if (!H) return;
      const rear = st.rear || 0;
      const last = trail[0];
      if (!last || Math.hypot(H.x - last[0], H.z - last[2]) > 0.05) trail.unshift([H.x, H.y, H.z]);
      if (trail.length > 420) trail.length = 420;
      let ti = 0, acc = 0, px = H.x, py = H.y, pz = H.z;
      const moving = clamp(st.speed / 0.6, 0, 1);
      for (let i = 0; i < SEG; i++) {
        const want = i * SL;
        while (ti < trail.length - 1) {
          const [ax, ay, az] = trail[ti], [bx, by, bz] = trail[ti + 1];
          const d = Math.hypot(bx - ax, bz - az);
          if (acc + d >= want) { const k = (want - acc) / (d || 1); px = ax + (bx - ax) * k; py = ay + (by - ay) * k; pz = az + (bz - az) * k; break; }
          acc += d; ti++; px = bx; py = by; pz = bz;
        }
        if (i === 0) { px = H.x; py = H.y; pz = H.z; }
        // the front of the body rears up in an S when it is about to strike
        const lift = rear * Math.max(0, 1 - i / 9) * 1.1 + (st.attack || 0) * Math.max(0, 1 - i / 6) * 0.3;
        bones[i].position.set(px, R * 0.75 + lift, pz);
      }
      // lateral undulation travels down the body; stronger while moving
      for (let i = 0; i < SEG; i++) {
        const a = bones[i].position, b = bones[Math.min(SEG - 1, i + 1)].position;
        fwd.set(a.x - b.x, 0, a.z - b.z);
        if (i === SEG - 1) { const c = bones[i - 1].position; fwd.set(c.x - a.x, 0, c.z - a.z); }
        if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, 1);
        fwd.normalize();
        side.set(fwd.z, 0, -fwd.x);
        const wav = Math.sin(st.t * 5.5 * (0.4 + moving) - i * 0.55) * 0.16 * (0.2 + moving) * Math.min(1, i / 3);
        bones[i].position.addScaledVector(side, wav);
      }
      for (let i = 0; i < SEG; i++) {
        const a = bones[i].position, b = bones[Math.min(SEG - 1, i + 1)].position;
        fwd.set(a.x - b.x, a.y - b.y, a.z - b.z);
        if (i === SEG - 1) { const c = bones[i - 1].position; fwd.set(c.x - a.x, c.y - a.y, c.z - a.z); }
        if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, 1);
        fwd.normalize();
        q.setFromUnitVectors(Z, fwd);
        bones[i].quaternion.copy(q);
        const br = 1 + Math.sin(st.t * 1.6 - i * 0.3) * 0.03;
        bones[i].scale.set(br, br, 1);
      }
      head.rotation.x = -rear * 0.6;
      jaw.rotation.x = (st.attack || 0) * 1.1 + rear * 0.25;
      const flick = (Math.sin(st.t * 7) > 0.6 ? 1 : 0) * (0.5 + 0.5 * Math.sin(st.t * 40));
      tongue.scale.z = 0.2 + flick * 1.1;
    },
    sketchPose(st) {
      for (let i = 80; i >= 0; i--) { const a = i * 0.11; st.head = { x: Math.sin(a) * 1.2 + i * 0.05 - 1.5, y: 0, z: Math.cos(a * 0.7) * 0.5 }; st.speed = 1; this.animate(st, 0.03); }
      st.rear = 1; st.head = { x: -1.5, y: 0, z: 0.3 }; this.animate(st, 0.03);
    },
    anchors(key) { const b = bones[{ head: 0, chest: 8, foot: 22, hand: 4 }[key] ?? 8]; return b.getWorldPosition(V()); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.coil = buildCoil;

// 2 ---------------------------------------------------------------- THE COIL
D.coil = {
  name: 'The Coil', speed: 1.2, chase: 3.4, detect: 11, dmg: 34, reach: 1.6, cd: 2, memory: 7, voice: 'hiss', noAttack: true, silent: true,
  num: 'Φ-02 · Ophidiophobia', cls: 'Lethal', size: '~7.5 m long',
  desc: 'A snake as long as a bus, patterned like old linoleum, with a head the width of a shovel. It moves without a sound until it rears.',
  notes: 'It hunts by the vibration of footsteps through the floor and by sight at close range. Before every strike it rears up and rattles its scales — that half second is all the warning you get.',
  tips: ['When it rears, step sideways, not back: the strike goes in a straight line.', 'Crouch-walking barely shakes the floor.', 'It needs a few seconds to coil again after a strike.'],
  sketch: [['head', 'heat pits, slit pupils'], ['chest', 'saddle pattern'], ['foot', '~7.5 m long']],
  init(m, e) {
    e.st.head = { x: e.pos.x, y: 0, z: e.pos.z };
    for (let i = 0; i < 70; i++) { e.st.head = { x: e.pos.x - i * 0.15, y: 0, z: e.pos.z + Math.sin(i * 0.3) * 0.4 }; e.model.animate(e.st, 0.016); }
    e.st.head = e.pos; e.mode = 'hunt';
  },
  noiseMul(m) { const pl = PL(m); return (pl.walkSpeed || 0) < 0.3 ? 0.3 : (pl.stance === 'stand' ? 1.1 : 0.4); },
  frame(m, e, dt, d) {
    e.modeT = (e.modeT || 0) + dt;
    if (e.mode === 'rear') {
      e.st.rear = Math.min(1, (e.st.rear || 0) + dt * 2.2); e.yaw = faceYaw(m, e); e.speed = 0;
      if (e.modeT > 0.85) { e.mode = 'strike'; e.modeT = 0; startLunge(m, e, Math.min(4.2, d + 0.8), 0.32, 12); m.game.audio.entity(e.type, 'attack', e.pos, PL(m)); e.st.attack = 1; }
      e.threat = 1;
      return 'static';
    }
    if (e.mode === 'strike') { if (!lunge(m, e, dt)) { e.mode = 'recoil'; e.modeT = 0; m.routeAway(e, 6); } e.st.rear = Math.max(0, e.st.rear - dt * 2); return 'static'; }
    e.st.rear = Math.max(0, (e.st.rear || 0) - dt * 1.5); e.st.attack = 0;
    if (e.mode === 'recoil' && e.modeT > 2.4) { e.mode = 'hunt'; }
    return null;
  },
  think(m, e, d, sees) {
    if (e.mode === 'recoil') { if (!e.path) m.routeAway(e, 6); return; }
    if (e.mode !== 'hunt') return;
    if (e.state === 'chase' && d < 4.2 && e.modeT > 1 && m.nav.segmentClear(e.pos.x, e.pos.z, PL(m).pos.x, PL(m).pos.z, 0.2)) { e.mode = 'rear'; e.modeT = 0; e.path = null; m.game.audio.entity(e.type, 'alert', e.pos, PL(m)); return; }
    hunt(m, e, d, sees);
  },
};

})();
