// =============================================================================
//  Smiler   (entity id: 'smiler')
//
//  One self-contained entity file:
//    - the three.js model builder and its private textures/helpers
//    - its stats / field-guide entry
//  Preview it live with other/entity-viewer.html (rotate, wander, sprint).
//  Shared building blocks live in entities/core/.
// =============================================================================
(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
const THREE = __mod['vendor/three/build/three.module.js'];
const { buildBody, face, headLift, headOn, HUMAN, organic, result, tex } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, canvasTex, glowMat, paintTex, Rig } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/**
 * The Smiler's face, painted on a transparent plane that floats over the
 * otherwise unlit head: two close-set, faintly luminous eyes above an
 * enormous, crowded grin of individually-shaded teeth with a warm glow
 * at the gums. Everything else is transparent so only the grin and eyes
 * are visible in the dark.
 */
const smilerFace = () => tex('smiler2', () => canvasTex(1024, 512, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();

  // --- eyes: small, close-set, mismatched, with a hot luminous core.
  for (const [x, r] of [[0.415, 0.022], [0.585, 0.020]]) {
    const cx = w * x, cy = h * 0.30, rr = w * r;

    // outer bloom — soft light spill
    const bloom = g.createRadialGradient(cx, cy, 0, cx, cy, rr * 5);
    bloom.addColorStop(0.00, 'rgba(255,252,232,0.95)');
    bloom.addColorStop(0.30, 'rgba(255,244,200,0.45)');
    bloom.addColorStop(1.00, 'rgba(255,244,200,0.00)');
    g.fillStyle = bloom;
    g.beginPath(); g.arc(cx, cy, rr * 5, 0, Math.PI * 2); g.fill();

    // sclera / iris
    const iris = g.createRadialGradient(cx, cy - rr * 0.25, 0, cx, cy, rr);
    iris.addColorStop(0.00, '#ffffff');
    iris.addColorStop(0.55, '#fff7cf');
    iris.addColorStop(1.00, '#d9c47e');
    g.fillStyle = iris;
    g.beginPath(); g.ellipse(cx, cy, rr, rr * 0.95, 0, 0, Math.PI * 2); g.fill();

    // subtle pupil — enough to read as an eye, not enough to soften it
    g.fillStyle = 'rgba(30,18,4,0.7)';
    g.beginPath(); g.arc(cx, cy, rr * 0.28, 0, Math.PI * 2); g.fill();

    // wet specular highlight
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.beginPath(); g.arc(cx - rr * 0.32, cy - rr * 0.38, rr * 0.16, 0, Math.PI * 2); g.fill();
  }

  // --- mouth: a very wide crescent, corners riding higher than the middle.
  const L = 0.08, R = 0.92;
  const upper = (t) => h * (0.5 - 0.10 * Math.sin(t * Math.PI) + 0.06 * Math.pow(Math.abs(t - 0.5) * 2, 3));
  const lower = (t) => h * (0.5 + 0.34 * Math.sin(t * Math.PI) - 0.02);

  // faint warm gums behind the teeth
  g.shadowBlur = 26; g.shadowColor = '#ffd9a0';
  const gum = g.createLinearGradient(0, h * 0.35, 0, h * 0.75);
  gum.addColorStop(0, 'rgba(110,36,36,0.35)');
  gum.addColorStop(0.5, 'rgba(170,64,54,0.45)');
  gum.addColorStop(1, 'rgba(110,36,36,0.35)');
  g.fillStyle = gum;
  g.beginPath();
  for (let i = 0; i <= 40; i++) { const t = i / 40; g.lineTo(w * (L + (R - L) * t), upper(t) - 6); }
  for (let i = 40; i >= 0; i--) { const t = i / 40; g.lineTo(w * (L + (R - L) * t), lower(t) + 6); }
  g.fill();

  // --- teeth: individual, uneven, slightly crooked, with enamel shading.
  const tooth = (x, y, tw, th, dir, tilt) => {
    g.save(); g.translate(x, y); g.rotate(tilt);
    const grd = g.createLinearGradient(0, 0, 0, th * dir);
    grd.addColorStop(0.00, '#d9cbaa');   // root, near the gum
    grd.addColorStop(0.18, '#f3e8cd');
    grd.addColorStop(0.60, '#fffdf0');   // body
    grd.addColorStop(1.00, '#efe4c6');   // incisal edge, slightly translucent
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(-tw / 2, 0); g.lineTo(tw / 2, 0);
    g.lineTo(tw / 2 * 0.90, th * dir * 0.80);
    g.quadraticCurveTo(0, th * dir * 1.08, -tw / 2 * 0.90, th * dir * 0.80);
    g.closePath(); g.fill();
    // vertical enamel highlight
    g.strokeStyle = 'rgba(255,255,255,0.30)'; g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(-tw * 0.18, th * dir * 0.18);
    g.lineTo(-tw * 0.18, th * dir * 0.72);
    g.stroke();
    g.restore();
  };

  g.shadowBlur = 8; g.shadowColor = '#fff2c8';
  const nu = 22, nl = 20;
  for (let i = 0; i < nu; i++) {
    const t = (i + 0.5) / nu, x = w * (L + (R - L) * t), y = upper(t);
    const span = (R - L) * w / nu;
    const gapY = lower(t) - y;
    tooth(x + (rnd() - 0.5) * 3, y - 2, span * (0.78 + rnd() * 0.12),
          Math.min(gapY * 0.52, h * (0.07 + rnd() * 0.035) * (0.4 + Math.sin(t * Math.PI) * 0.8)),
          1, (rnd() - 0.5) * 0.12);
  }
  for (let i = 0; i < nl; i++) {
    const t = (i + 0.5) / nl, x = w * (L + 0.02 + (R - L - 0.04) * t), y = lower(t);
    const span = (R - L - 0.04) * w / nl;
    const gapY = y - upper(t);
    tooth(x + (rnd() - 0.5) * 3, y + 2, span * (0.76 + rnd() * 0.14),
          Math.min(gapY * 0.45, h * (0.06 + rnd() * 0.03) * (0.4 + Math.sin(t * Math.PI) * 0.8)),
          -1, (rnd() - 0.5) * 0.14);
  }
}));


// ------------------------------------------------------------------ builders
function buildSmiler() {
  // Gaunt, slender humanoid proportions tuned via parameter configuration
  // to avoid spherical head/waist geometry safely without breaking animations.
  const p = {
    ...HUMAN,
    hipH: 1.05, 
    thigh: 0.54, 
    shin: 0.48,
    upperArm: 0.46, 
    foreArm: 0.44,
    chestW: 0.20, 
    armR: 0.48, 
    legR: 0.44, 
    headR: 0.15, // Slimmer, non-spherical head sizing
  };
  const rig = new Rig(p);

  // --- skin: near-black but a *lit* material, so muscle, tendon and the
  //     seams between limbs actually read when any light grazes the body.
  const skinTex = organic('smilerSkin', {
    base: '#0a0a0c', dark: '#000000', light: '#1e1e26',
    veins: 0.35, vein: '#0c0c18',
    pores: 0.45, wrinkle: 0.6, wrinkleF: 34,
  });
  const skinMap = (skinTex && skinTex.isTexture) ? skinTex
                : (skinTex && skinTex.map)  ? skinTex.map
                : null;
  const skin = new THREE.MeshStandardMaterial({
    map: skinMap,
    color: skinMap ? 0xffffff : 0x0b0b10,
    roughness: 0.52,          // damp, oily hide
    metalness: 0.03,
    envMapIntensity: 0.35,
  });

  // --- clothing: a dark, worn layer over the torso and legs.
  const top    = new THREE.MeshStandardMaterial({ color: 0x0a0a0e, roughness: 0.92, metalness: 0.00 });
  const bottom = new THREE.MeshStandardMaterial({ color: 0x09090c, roughness: 0.95, metalness: 0.00 });
  const shoes  = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.68, metalness: 0.05 });

  buildBody(rig, p, { skin, top, bottom, shoes },
            { fingerLen: 0.15, claws: 0.03, fingerVar: true });

  headOn(rig, p, skin, 1.12, 1.02, 0.95);

  // --- the grin: a luminous decal floating just off the face.
  const grin = glowMat('#ffffff', {
    map: smilerFace(),
    transparent: true,
    depthWrite: false,
  });
  face(rig, p, null, grin, { r: 1.04, w: 2.3, h: 1.65, sx: 1.05, sy: 1.0, sz: 0.95 });

  // --- soft halo so the grin bleeds a little into the dark around it.
  const halo = glowMat('#fff6dd', {
    map: tex('halo', () => canvasTex(128, 128, (g, w) => {
      const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      r.addColorStop(0, 'rgba(255,250,230,0.26)');
      r.addColorStop(1, 'rgba(255,250,230,0)');
      g.fillStyle = r; g.fillRect(0, 0, w, w);
    })),
    additive: true, depthWrite: false, transparent: true,
  });
  const sprite = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.8), halo);
  sprite.position.set(0, 0.04 + headLift(p), 0.16);
  rig.head.add(sprite);

  // --- Nigrum ignem: thin black smoke that licks up off the joints.
  const flame = tex('blackfire', () => paintTex(64, 128, (u, v, N, out) => {
    const x = (u - 0.5) * 2, y = v;
    const w = (1 - y) * 0.8 * (0.7 + 0.5 * N.fbm(u, v * 0.5, 4, 3));
    out.a = Math.max(0, Math.min(1, (w - Math.abs(x)) * 2.5)) * (1 - y * 0.6) * 0.85;
    return [0.02, 0.02, 0.025];
  }).map);
  const wisps = [];
  for (let i = 0; i < 16; i++) {
    const m = new THREE.SpriteMaterial({ map: flame, color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false });
    const s2 = new THREE.Sprite(m);
    const bone = [rig.chest, rig.spine, rig.hips, rig.head, rig.arms[0].el, rig.arms[1].el, rig.legs[0].kn, rig.legs[1].kn][i % 8];
    s2.center.set(0.5, 0.1);
    bone.add(s2);
    wisps.push({ s: s2, ph: i * 1.7, sz: 0.22 + (i % 4) * 0.07 });
  }

  return result(rig, {
    kind: 'biped', height: 2.0, radius: 0.30, eyeY: 1.88, sprite,
    animate(st, dt) {
      st.armsOut = 0.15; st.lean = 0.15; st.hunch = 0.12; st.sway = 0.05; st.grip = 0.1;
      animateBiped(rig, st, dt);
      for (const w of wisps) {
        const k = (st.t * 1.6 + w.ph) % 1;
        w.s.scale.set(w.sz * (1 - k * 0.4), w.sz * (1.4 + k * 1.6), 1);
        w.s.material.opacity = 0.35 * Math.sin(k * Math.PI);
        w.s.position.set(Math.sin(w.ph * 3.1) * 0.06, k * 0.15, Math.cos(w.ph * 2.3) * 0.06);
      }
    },
  });
}


__mod['src/entities/registry.js'].BUILDERS.smiler = buildSmiler;

ENTITY_DEFS.smiler = { name: 'Smiler', speed: 0.8, chase: 2.0, detect: 6.5, dmg: 34, reach: 1.35, cd: 1.5, memory: 7, darkOnly: true,
  num: 'Entity 3', cls: 'Hostile', size: '~2.0 m (body rarely seen clearly)',
  desc: 'A grin and two eyes floating in the dark. Slow, short-sighted and utterly hostile. Light makes it vanish.',
  notes: 'Only exists where the light fails. The body is a real humanoid form — gaunt, long-limbed, skin near-black and faintly clammy, built from all the usual pieces — but in the dark only the luminous grin and eyes are visible. A torch catches the seams between limbs, a glint across a shoulder, the curl of a clawed hand, for a heartbeat before it steps back into shadow.',
  tips: ['Stay under working lights.', 'A flickering fixture is not safe — it can step out between flashes.', 'A power surge sends every Smiler nearby back into hiding.'] };
})();