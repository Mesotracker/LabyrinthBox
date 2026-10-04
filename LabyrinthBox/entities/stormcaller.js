// =============================================================================
//  The Stormcaller   (entity id: 'stormcaller')
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
const { V } = __mod['src/phobia/models_b.js'];
const { animateBiped, canvasTex, clamp, ellipsoid, glowMat, lerp, poseHand, Rig, skinMat, xf } = __mod['src/entities/rig.js'];
const { buildBody, fleshMat, headLift, headOn, HUMAN, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { chaseTo, D, ph } = __mod['src/phobia/ai.js'];

// ------------------------------------------------------------------ 36  THE STORMCALLER (astraphobia)
const lichtenberg = () => tex('lichtenberg', () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#9fd8ff'; g.lineCap = 'round';
  const tree = (x, y, a, len, wd, d) => {
    if (d <= 0 || len < 3) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    g.lineWidth = wd; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    tree(x2, y2, a + (Math.random() - 0.5) * 0.9, len * 0.82, wd * 0.75, d - 1);
    if (Math.random() < 0.55) tree(x2, y2, a + (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6), len * 0.7, wd * 0.6, d - 1);
  };
  for (let i = 0; i < 6; i++) tree(Math.random() * w, Math.random() * h * 0.2, Math.PI / 2 + (Math.random() - 0.5), 40, 4, 9);
}));


function buildStormcaller() {
  const p = { ...HUMAN, hipH: 1.25, thigh: 0.6, shin: 0.6, chestW: 0.3, upperArm: 0.5, foreArm: 0.5, armR: 0.65, legR: 0.6, headR: 0.11, neck: 0.15 };
  const rig = new Rig(p);
  const t = organic('charred', { base: '#1a1614', dark: '#050404', light: '#3a3230', wrinkle: 0.8, wrinkleF: 60, veins: 0.2, pores: 0.6 });
  const L = lichtenberg();
  const skin = fleshMat(t, { rough: 0.8, bumpScale: 2.4, emissive: '#9fd8ff', emissiveIntensity: 0.6, emissiveMap: L });
  buildBody(rig, p, { skin, top: skin, bottom: skin, shoes: skin }, { fingerLen: 0.16, fingerVar: true, chestDepth: 0.5, ribs: true });
  headOn(rig, p, skin, 0.95, 1.2, 1.0);
  const hl = headLift(p);
  for (const s of [-1, 1]) rig.attach(rig.head, xf(ellipsoid(0.016, 0.01, 0.006), { x: s * 0.038, y: hl + 0.03, z: 0.1 }), glowMat('#e0f4ff'), { rigid: true, shadow: false });
  // arcs that crawl between its raised hands
  const arcMat = new THREE.LineBasicMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, toneMapped: false });
  const arcGeo = new THREE.BufferGeometry(); arcGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(24 * 3), 3));
  const arc = new THREE.Line(arcGeo, arcMat); arc.frustumCulled = false; rig.root.add(arc);
  const a = V(), b = V();
  return result(rig, {
    kind: 'biped', height: 2.4, radius: 0.32, eyeY: 2.2, skinMat: skin,
    animate(st, dt) {
      st.lean = 0.1; st.hunch = 0.15; st.stride = 1.9; st.armSwing = 0.2; st.grip = -0.1;
      animateBiped(rig, st, dt);
      for (const A of rig.arms) { A.sh.rotation.x = -2.5 + Math.sin(st.t * 1.3 + A.side) * 0.1; A.sh.rotation.z = A.side * 0.35; A.el.rotation.x = -0.3; poseHand(A, -0.1, 1, st.t); }
      rig.root.updateMatrixWorld(true);
      rig.arms[0].wr.getWorldPosition(a); rig.arms[1].wr.getWorldPosition(b); rig.root.worldToLocal(a); rig.root.worldToLocal(b);
      const pa = arcGeo.attributes.position;
      for (let i = 0; i < 24; i++) { const k = i / 23; const j = Math.sin(k * Math.PI) * 0.12; pa.setXYZ(i, lerp(a.x, b.x, k) + (Math.random() - 0.5) * j, lerp(a.y, b.y, k) + Math.sin(k * Math.PI) * 0.15 + (Math.random() - 0.5) * j, lerp(a.z, b.z, k) + (Math.random() - 0.5) * j); }
      pa.needsUpdate = true;
      arc.visible = Math.random() < 0.7;
      skin.emissiveIntensity = 0.4 + Math.random() * 0.5 + (st.charge || 0) * 2;
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.stormcaller = buildStormcaller;

// 36 --------------------------------------------------------------- THE STORMCALLER
D.stormcaller = {
  name: 'The Stormcaller', speed: 2.0, chase: 4.2, detect: 999, dmg: 40, reach: 1.6, cd: 1.6, memory: 999, xray: true, fade: true, voice: 'crackle', freezePose: true,
  num: 'Φ-36 · Astraphobia', cls: 'Lethal', size: '2.4 m',
  desc: 'A charred, gaunt figure with its arms raised, lightning crawling between its hands and through the cracks in its skin.',
  notes: 'You only ever see it in the lightning — and every flash it is closer. In the dark between strikes it moves. Where it walks, the bolts come down.',
  tips: ['Count the seconds between flashes: that is how long it gets to move.', 'Do not stand in the open when the hair on your arms stands up.', 'Lightning strikes leave a scorch — you can see where it has been.'],
  sketch: [['head', 'seen only in flashes'], ['hand', 'arcs between hands'], ['chest', 'lightning scars']],
  init(m, e) { e.alpha = 0; e.alphaWant = 0; },
  observe(m) { return ph(m) && ph(m).lightning > 0.3; },
  frame(m, e, dt, d) {
    const L = ph(m) ? ph(m).lightning : 0;
    e.alphaWant = L > 0.25 ? 1 : (d < 3 ? 0.4 : 0);
    e.alphaRate = L > 0.25 ? 30 : 4;
    e.st.charge = L;
    e.threat = clamp(1 - d / 20, 0, 1) * 0.8;
    return null;
  },
  think(m, e) { if (!e.observed) chaseTo(m, e); },
};

})();
