(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
// Variant factory for the bonus packs. mutated('smiler', { heads: 2, arms: 2, tint: [...] }) returns a model
// builder that builds the base creature and then bends it:
//
//   heads: n     extra heads (the head bone and everything on it is copied and swung out to the side)
//   arms:  n     extra arms (alternating sides, each pair a little lower on the chest)
//   legs:  n     extra legs
//   stretch      { arms, legs, head }  scale factors on the existing limbs
//   tint         ['#rrggbb', ...]      colours cycled over the body materials (multiplied, or flat with flat: true)
//   jitter       how hard the body glitches now and then
//   hs           overall height factor (collision height and eye line follow)
//
// The copies are real bones in the real skeleton, so they skin, light and cast shadows like the original;
// each frame they replay the original bone's pose with a swing of their own.
__mod['src/entities/mutate.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
const { Rig } = __mod['src/entities/rig.js'];
const { BUILDERS } = __mod['src/entities/registry.js'];

/** Copy a bone and every bone below it under a new parent. */
function cloneTree(rig, root, newParent, map) {
  const nb = rig.joint(newParent, root.position.x, root.position.y, root.position.z);
  nb.quaternion.copy(root.quaternion);
  map.set(root, nb);
  for (const c of root.children) if (c.isBone) cloneTree(rig, c, nb, map);
  return nb;
}

/** Queue copies of every skinned part (and attach copies of every rigid part) hanging on the copied bones. */
function dupParts(rig, map) {
  const add = [];
  for (const p of rig.parts) {
    if (!map.has(p.bone)) continue;
    const o = { ...p.o };
    if (o.parent && map.has(o.parent)) o.parent = map.get(o.parent);
    if (o.child && map.has(o.child)) o.child = map.get(o.child);
    add.push({ bone: map.get(p.bone), geo: p.geo.clone(), mat: p.mat, o });
  }
  rig.parts.push(...add);
  for (const [ob, nb] of map) {
    for (const c of ob.children) {
      if (c.isBone) continue;
      const cc = c.clone();
      nb.add(cc);
      rig.meshes.push(cc);
    }
  }
}

function mutated(baseId, o = {}) {
  return function (rng) {
    const orig = Rig.prototype.finalize;
    const copies = [];
    let rig = null;
    Rig.prototype.finalize = function () {
      if (!this.done && !rig) {
        rig = this;
        for (let k = 0; k < (o.heads || 0); k++) {
          const side = k % 2 ? -1 : 1, rank = 1 + (k >> 1), map = new Map();
          const root = cloneTree(this, this.head, this.neck, map);
          root.position.x += side * 0.12 * rank; root.position.y -= 0.025 * rank; root.position.z += 0.02;
          dupParts(this, map);
          copies.push({ map, root, from: this.head, side, rank, kind: 'head' });
        }
        for (let k = 0; k < (o.arms || 0); k++) {
          const A = this.arms[k % 2], rank = 1 + (k >> 1), map = new Map();
          const root = cloneTree(this, A.clav, this.chest, map);
          root.position.y -= 0.16 * rank; root.position.z -= 0.015 * rank;
          dupParts(this, map);
          copies.push({ map, root, from: A.clav, side: A.side, rank, kind: 'arm' });
        }
        for (let k = 0; k < (o.legs || 0); k++) {
          const L = this.legs[k % 2], rank = 1 + (k >> 1), map = new Map();
          const root = cloneTree(this, L.hip, this.hips, map);
          root.position.z += (k % 4 < 2 ? 1 : -1) * 0.17 * rank; root.position.x += L.side * 0.06;
          dupParts(this, map);
          copies.push({ map, root, from: L.hip, side: L.side, rank, kind: 'leg' });
        }
      }
      return orig.apply(this, arguments);
    };
    let m;
    try { m = BUILDERS[baseId](rng); } finally { Rig.prototype.finalize = orig; }
    const R = m.rig || rig;

    // disfigured proportions
    const st = o.stretch || {};
    if (R && st.arms) for (const A of R.arms) A.sh.scale.set(1, st.arms, 1);
    if (R && st.legs) for (const L of R.legs) L.hip.scale.set(1, st.legs, 1);
    if (R && st.head) R.head.scale.setScalar(st.head);

    // colour
    if (o.tint && o.tint.length) {
      const cols = o.tint.map((c) => new THREE.Color(c));
      const done = new Map();
      let n = 0;
      m.root.traverse((ob) => {
        if (!ob.material) return;
        const list = Array.isArray(ob.material) ? ob.material : [ob.material];
        for (const mat of list) {
          if (mat.isMeshBasicMaterial || mat.isSpriteMaterial || done.has(mat)) continue;
          done.set(mat, true);
          const c = cols[n++ % cols.length];
          if (o.flat) { mat.map = null; mat.bumpMap = null; mat.color.copy(c); mat.roughness = 0.55; }
          else mat.color.multiply(c);
          mat.needsUpdate = true;
        }
      });
    }
    const mats = [], glows = [];
    m.root.traverse((ob) => {
      if (!ob.isMesh && !ob.isSprite) return;
      for (const mat of Array.isArray(ob.material) ? ob.material : [ob.material]) {
        if (mat.isMeshBasicMaterial || mat.isSpriteMaterial) { if (!glows.includes(mat)) glows.push(mat); } else if (!mats.includes(mat)) mats.push(mat);
      }
    });
    m.mats = mats; m.glows = glows;

    if (o.hs) { m.height *= o.hs; m.eyeY *= o.hs; m.root.scale.multiplyScalar(o.hs); }

    const base = m.animate;
    const jit = o.jitter || 0;
    m.animate = (s, dt) => {
      base(s, dt);
      const t = s.t || 0;
      for (const c of copies) {
        for (const [ob, nb] of c.map) { nb.rotation.copy(ob.rotation); nb.scale.copy(ob.scale); }
        const r = c.root, k = c.rank, sd = c.side;
        if (c.kind === 'head') {
          r.rotation.y += sd * (0.45 + 0.12 * k) + Math.sin(t * 1.7 + k * 2.1 + sd) * 0.4;
          r.rotation.z += sd * 0.14; r.rotation.x += Math.sin(t * 1.3 + k) * 0.14;
        } else if (c.kind === 'arm') {
          r.rotation.z += sd * (0.5 + 0.2 * Math.sin(t * 2.2 + k * 1.7)); r.rotation.x += Math.sin(t * 1.9 + k * 2.3 + sd) * 0.35;
        } else {
          r.rotation.x += Math.sin((s.phase || 0) * 1 + k * 1.9) * 0.5; r.rotation.z += sd * 0.35;
        }
      }
      if (jit && R) {
        // now and then the body tears sideways for a frame
        const g = Math.sin(t * 7.3) * Math.sin(t * 2.9) > 0.88 ? 1 : 0;
        R.body.position.x = g * (Math.random() - 0.5) * jit * 3;
        R.chest.rotation.z += g * (Math.random() - 0.5) * jit * 8;
      }
    };
    return m;
  };
}

__e['mutated'] = mutated;
  return __e;
})();
})();
