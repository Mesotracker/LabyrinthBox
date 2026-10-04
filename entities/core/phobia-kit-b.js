(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/phobia/models_b.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
const { Rig: Rig, skinMat: skinMat, glowMat: glowMat, canvasTex: canvasTex, paintTex: paintTex, limbGeo: limbGeo, latheGeo: latheGeo, ellipsoid: ellipsoid, xf: xf, merge: merge, poseHand: poseHand, animateBiped: animateBiped, animateSpider: animateSpider, clamp: clamp, lerp: lerp } = __mod['src/entities/rig.js'];
const { BUILDERS: BUILDERS, HELPERS: HELPERS } = __mod['src/entities/models.js'];
const { organic: organic, cloth: cloth, fleshMat: fleshMat, buildBody: buildBody, headOn: headOn, headLift: headLift, face: face, result: result, HUMAN: HUMAN, noiseFill: noiseFill, tex: tex, sm: sm, mix3: mix3 } = HELPERS;
const { eyeTex: eyeTex, eyeball: eyeball, haloMat: haloMat, chain: chain, hairCurtain: hairCurtain, sprite: sprite } = __mod['src/phobia/models_a.js'];
// The Phobia Wing, part two.

const V = () => new THREE.Vector3();

/** Black smoke licking upward off a body (the Smiler's trick, reused for shadows). */
const blackFire = () => tex('blackfire2', () => paintTex(64, 128, (u, v, N, out) => {
  const x = (u - 0.5) * 2, y = v;
  const w = (1 - y) * 0.8 * (0.7 + 0.5 * N.fbm(u, v * 0.5, 4, 3));
  out.a = Math.max(0, Math.min(1, (w - Math.abs(x)) * 2.5)) * (1 - y * 0.6) * 0.85;
  return [0.01, 0.01, 0.012];
}).map);

function smokeWisps(rig, n, col = 0x000000, size = 0.3) {
  const wisps = [];
  const map = blackFire();
  const bones = [rig.chest, rig.spine, rig.hips, rig.head, rig.arms[0].el, rig.arms[1].el, rig.legs[0].kn, rig.legs[1].kn, rig.arms[0].wr, rig.arms[1].wr];
  for (let i = 0; i < n; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color: col, transparent: true, opacity: 0.6, depthWrite: false }));
    s.center.set(0.5, 0.1);
    bones[i % bones.length].add(s);
    wisps.push({ s, ph: i * 1.7, sz: size + (i % 4) * size * 0.3 });
  }
  return (t) => {
    for (const w of wisps) {
      const k = (t * 1.4 + w.ph) % 1;
      w.s.scale.set(w.sz * (1 - k * 0.4), w.sz * (1.4 + k * 1.6), 1);
      w.s.material.opacity = 0.6 * Math.sin(k * Math.PI);
      w.s.position.set(Math.sin(w.ph * 3.1) * 0.06, k * 0.15, Math.cos(w.ph * 2.3) * 0.06);
    }
  };
}

const suitMat = (name, base) => { const t = cloth(name, { base, dark: '#0a0a0c', stain: '#1e1a16', weave: 140, stains: 0.2, wear: 0.2 }); return skinMat('#9a9a9a', { map: t.map, bump: t.bump, bumpScale: 0.6, rough: 0.75 }); };
const humanSkin = (name, base) => fleshMat(organic(name, { base, dark: '#6a4a3a', light: '#f0d8c8', veins: 0.1, pores: 0.35, mottle: 0.25 }), { rough: 0.55, bumpScale: 0.6 });

__e['V'] = V;
__e['blackFire'] = blackFire;
__e['smokeWisps'] = smokeWisps;
__e['suitMat'] = suitMat;
__e['humanSkin'] = humanSkin;
  return __e;
})();
})();
