// =============================================================================
//  The Haze   (entity id: 'haze')
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
const { HUMAN, result, smokeTex } = __mod['src/entities/models.js'].HELPERS;
const { ellipsoid, glowMat, limbGeo, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

// ------------------------------------------------------------------ rare entities
/**
 * The Haze: a column of bone-white fog the size of a person, drifting through
 * walls. Something skeletal hangs inside it, visible only up close.
 */
function buildHaze() {
  const rig = new Rig({ ...HUMAN });
  const puffs = [];
  const smoke = smokeTex();
  // a huge, slow cloud: roughly 7 m across and 4 m high, densest at the core
  for (let i = 0; i < 80; i++) {
    const m = new THREE.SpriteMaterial({ map: smoke, color: 0xd8d2bc, transparent: true, opacity: 0.3, depthWrite: false, fog: true });
    const s = new THREE.Sprite(m);
    const k = i / 80;
    const a = i * 2.4;
    const core = i < 26;
    const r = core ? 0.15 + Math.random() * 0.6 : 0.8 + Math.random() * 2.7;
    const p = { s, a, r, y: core ? 0.2 + k * 3 * 2.4 : 0.2 + Math.random() * 3.8, sp: 0.15 + Math.random() * 0.35, sz: core ? 1.0 + Math.random() * 0.8 : 1.8 + Math.random() * 1.8 };
    s.scale.setScalar(p.sz);
    rig.root.add(s);
    puffs.push(p);
  }
  // the thing inside: skull, spine and ribs, translucent and dark
  const boneMat = skinMat('#5c5446', { rough: 0.8, transparent: true, opacity: 0.55, depthWrite: false });
  const inner = new THREE.Group(); inner.position.y = 0.2; rig.root.add(inner);
  const add = (g) => { const m = new THREE.Mesh(g, boneMat); inner.add(m); return m; };
  const skull = new THREE.Group(); skull.position.y = 1.75; inner.add(skull);
  skull.add(new THREE.Mesh(xf(ellipsoid(0.1, 0.12, 0.11), { y: 0.05 }), boneMat));
  skull.add(new THREE.Mesh(xf(ellipsoid(0.07, 0.05, 0.08), { y: -0.06, z: 0.02 }), boneMat));
  const sockM = glowMat('#000000', { transparent: true, opacity: 0.8 });
  for (const x of [-0.04, 0.04]) skull.add(new THREE.Mesh(xf(ellipsoid(0.028, 0.024, 0.01), { x, y: 0.04, z: 0.1 }), sockM));
  for (let i = 0; i < 16; i++) add(xf(ellipsoid(0.025, 0.02, 0.025), { y: 0.75 + i * 0.055, z: -0.04 }));
  for (let i = 0; i < 7; i++) add(xf(new THREE.TorusGeometry(0.14 - Math.abs(i - 2) * 0.012, 0.008, 5, 18, Math.PI * 1.5), { y: 1.2 + i * 0.065, rx: Math.PI / 2 + 0.25, rz: Math.PI * 0.75, sy: 0.7 }));
  for (const s of [-1, 1]) {
    add(xf(limbGeo(0.55, 0.012, 0.009), { x: s * 0.17, y: 1.52, rz: s * 0.15 }));
    add(xf(limbGeo(0.5, 0.01, 0.007), { x: s * 0.24, y: 1.0, rz: s * 0.05, rx: -0.4 }));
  }
  rig.finalize();
  return result(rig, {
    kind: 'haze', height: 4.0, radius: 0.5, eyeY: 1.9, puffs, inner,
    animate(st, dt) {
      st.t += dt;
      const t = st.t;
      const prox = st.prox ?? 0;
      for (const p of puffs) {
        const a = p.a + t * p.sp * (0.5 + st.speed * 0.3);
        const r = p.r * (1 + Math.sin(t * 0.4 + p.a) * 0.18) * (1 + (st.attack || 0) * 0.3);
        p.s.position.set(Math.cos(a) * r, p.y + Math.sin(t * p.sp + p.a) * 0.25, Math.sin(a) * r);
        p.s.material.rotation = a * 0.3;
        // thin out the billboards right in front of the camera so you can see the shape inside
        p.s.material.opacity = (0.22 + 0.08 * Math.sin(t * 1.3 + p.a)) * (1 - prox * 0.35);
      }
      inner.rotation.y = (st.look || 0) * 0.8 + Math.sin(t * 0.4) * 0.3;
      skull.rotation.z = Math.sin(t * 0.9) * 0.25;
      skull.rotation.x = Math.sin(t * 0.6) * 0.15 - 0.15;
      boneMat.opacity = 0.18 + prox * 0.55;
      inner.position.y = 0.2 + Math.sin(t * 0.8) * 0.06;
    },
    tint(r, g, b) {
      const k = 0.6 + Math.min(1.4, (r + g + b) * 2.2);
      for (const p of puffs) p.s.material.color.setRGB(0.85 * k, 0.82 * k, 0.7 * k);
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.haze = buildHaze;

// ------------------------------------------------------------ rare
ENTITY_DEFS.haze = { name: 'The Haze', speed: 0.5, chase: 0.95, detect: 16, dmg: 6, reach: 2.6, cd: 0.6, memory: 20, noclip: true, haze: true, rare: true, xray: true,
  num: 'Rare · fog-form', cls: 'Hostile', size: '~7 m across, 4 m high',
  desc: 'A huge, slow bank of bone-white fog that drifts through walls and leaves fog behind it. Something skeletal hangs inside.',
  notes: 'Like the chalky bone-dust fog of the drowned levels, but it moves with purpose. Inside the cloud: a skull, a spine and a cage of ribs that turn to follow you. Standing in it burns the lungs and the room fog thickens around it.',
  tips: ['It is slow — walk, do not run, and keep moving.', 'Walls do not stop it; distance does.', 'If the air turns white and you start coughing, leave.'] };
})();
