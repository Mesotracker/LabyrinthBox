(function () {
'use strict';
const __mod = (window.__mod = window.__mod || {});
__mod['src/gfx/shaderpatch.js'] = (function () {
  const __e = {};
const THREE = __mod['vendor/three/build/three.module.js'];
// Shader patching for the hybrid lighting model.
//
// World surfaces receive their diffuse light from a *baked* per-vertex term
// (computed from thousands of fixtures with occlusion on the CPU) plus up to
// four "live" fixture contributions per vertex, looked up in a light-state
// texture so individual fixtures can flicker or die at zero cost. Real-time
// point lights only add specular highlights (so they can be pooled/faded
// without visible diffuse popping), while the flashlight / sun remain fully
// dynamic with shadows.

let patched = false;

const GLOBAL_UNIFORMS = {
  uLightState: { value: null },
  uLightScale: { value: 4.0 },
  uGrimeTex: { value: null },
  uTime: { value: 0 },
  uBakeGain: { value: 1.0 },
  uFogNoise: { value: 0.0 },
  uEnvDarken: { value: 1.0 },
  uWorldWarp: { value: 0.0 },
  // recent water impacts: (x, z, startTime, amplitude); drips, footsteps, splashes
  uRipples: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, -100, 0)) },
  uWind: { value: 1.0 },
};

let rippleSlot = 0;
/** Register a ripple impact on every water surface (puddles, pools, wet floor). */
function addRipple(x, z, amp = 1) {
  const r = GLOBAL_UNIFORMS.uRipples.value[rippleSlot];
  rippleSlot = (rippleSlot + 1) % 16;
  r.set(x, z, GLOBAL_UNIFORMS.uTime.value, amp);
}

function installGlobalPatches() {
  if (patched) return;
  patched = true;
  const src = THREE.ShaderChunk.lights_fragment_begin;
  const start = src.indexOf('#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )');
  const end = src.indexOf('#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )');
  if (start < 0 || end < 0) {
    console.warn('[shaderpatch] could not locate point light block; specular-only point lights disabled');
    return;
  }
  THREE.ShaderChunk.lights_fragment_begin =
    src.slice(0, start) +
    '#ifdef SPEC_ONLY_POINTS\nvec3 _savedDirectDiffuse = reflectedLight.directDiffuse;\n#endif\n' +
    src.slice(start, end) +
    '#ifdef SPEC_ONLY_POINTS\nreflectedLight.directDiffuse = _savedDirectDiffuse;\n#endif\n' +
    src.slice(end);
}

const VERT_DECL = /* glsl */`
#ifdef BAKE_VERTEX
  attribute vec3 baked;
  attribute vec4 dynA;
  attribute vec4 dynB;
#endif
#ifdef FIXTURE
  attribute float lslot;
  varying vec3 vFix;
#endif
uniform sampler2D uLightState;
uniform float uLightScale;
uniform vec3 uBakedUniform;
uniform float uWorldWarp;
uniform float uTime;
uniform float uWind;
uniform float uSwayAmp;
varying vec3 vBaked;
varying vec3 vWPos;
varying vec3 vWNormal;
vec3 fetchSlot(float s) {
  int i = int(s + 0.5);
  return texelFetch(uLightState, ivec2(i & 127, i >> 7), 0).rgb;
}
`;

const VERT_SWAY = /* glsl */`
#ifdef USE_SWAY
  {
    // plants and wheat bend in the wind: more at the tips (uv.y), gusts roll across the field
    float hgt = clamp(uv.y, 0.0, 1.0);
    vec3 wpS = (modelMatrix * vec4(transformed, 1.0)).xyz;
    float gust = 0.5 + 0.5 * sin(wpS.x * 0.11 + wpS.z * 0.07 - uTime * 0.9);
    float sw = sin(uTime * 1.7 + wpS.x * 0.9 + wpS.z * 0.6) * (0.04 + gust * 0.1) + sin(uTime * 3.3 + wpS.z * 2.1) * 0.015;
    transformed.x += sw * hgt * hgt * uWind * uSwayAmp;
    transformed.z += sw * 0.6 * hgt * hgt * uWind * uSwayAmp;
  }
#endif
`;

const VERT_MAIN = /* glsl */`
#ifdef BAKE_VERTEX
  vBaked = baked + (fetchSlot(dynA.x) * dynA.y + fetchSlot(dynA.z) * dynA.w +
                    fetchSlot(dynB.x) * dynB.y + fetchSlot(dynB.z) * dynB.w) * uLightScale;
#else
  vBaked = uBakedUniform;
#endif
#ifdef FIXTURE
  vFix = fetchSlot(lslot) * uLightScale;
#endif
  {
    vec4 wp4 = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
      wp4 = instanceMatrix * wp4;
    #endif
    wp4 = modelMatrix * wp4;
    vWPos = wp4.xyz;
    vec3 on = objectNormal;
    #ifdef USE_INSTANCING
      on = mat3(instanceMatrix) * on;
    #endif
    vWNormal = normalize(mat3(modelMatrix) * on);
  }
`;

const FRAG_DECL = /* glsl */`
varying vec3 vBaked;
varying vec3 vWPos;
varying vec3 vWNormal;
#ifdef FIXTURE
  varying vec3 vFix;
#endif
uniform sampler2D uGrimeTex;
uniform float uGrime;
uniform float uWet;
uniform vec3 uGrimeTint;
uniform float uTime;
uniform float uBakeGain;
uniform float uFogNoise;
uniform float uEnvDarken;
uniform float uFloorY;
uniform vec4 uRipples[16];
uniform float uRippleAmb;
uniform float uWaveAmp;
float rippleHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
/** Slope (d/dx, d/dz) of the water surface made by impacts plus ambient drops. */
vec2 rippleGrad(vec2 p, float amb) {
  vec2 g = vec2(0.0);
  for (int i = 0; i < 16; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > 2.6 || r.w <= 0.0) continue;
    vec2 d = p - r.xy;
    float dist = length(d) + 1e-4;
    if (dist > 1.4) continue;
    float x = dist - age * 0.42;
    float env = exp(-x * x * 80.0) * exp(-age * 1.5) * r.w;
    g += d / dist * cos(x * 52.0) * env * 0.7;
  }
  if (amb > 0.0) {
    vec2 cell = floor(p / 0.85);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 c = cell + vec2(float(i), float(j));
      float h = rippleHash(c);
      float period = 1.8 + h * 3.5;
      float tt = uTime + h * 17.0;
      float age = mod(tt, period);
      float on = step(0.5, rippleHash(c + floor(tt / period) * 0.137));
      vec2 ctr = (c + vec2(rippleHash(c + 1.7), rippleHash(c + 3.1))) * 0.85;
      vec2 d = p - ctr;
      float dist = length(d) + 1e-4;
      float x = dist - age * 0.33;
      float env = exp(-x * x * 110.0) * exp(-age * 1.3) * on;
      g += d / dist * cos(x * 58.0) * env * 0.45 * amb;
    }
  }
  return g;
}
`;

const FRAG_AFTER_MAP = /* glsl */`
  float grimeDirt = 0.0;
  float grimeWet = 0.0;
#ifdef USE_GRIME
  {
    vec3 an = abs(vWNormal);
    vec2 gp = an.y > 0.6 ? vWPos.xz : (an.x > an.z ? vWPos.zy : vWPos.xy);
    vec4 g1 = texture2D(uGrimeTex, gp * 0.061);
    vec4 g2 = texture2D(uGrimeTex, gp * 0.217 + 0.37);
    grimeDirt = smoothstep(0.42, 0.9, g1.r * 0.65 + g2.r * 0.35);
    float nearFloor = an.y < 0.6 ? exp(-max(vWPos.y - uFloorY, 0.0) * 4.0) * (0.5 + g2.a) : 0.0;
    grimeDirt = clamp(grimeDirt * uGrime + nearFloor * uGrime * 0.55, 0.0, 1.0);
    diffuseColor.rgb *= mix(vec3(1.0), uGrimeTint, grimeDirt);
    #ifdef USE_WET
      if (vWNormal.y > 0.6) grimeWet = smoothstep(0.5, 0.72, g1.g * 0.75 + g2.g * 0.25) * uWet;
      diffuseColor.rgb *= 1.0 - grimeWet * 0.38;
    #endif
  }
#endif
`;

const FRAG_AFTER_ROUGH = /* glsl */`
#ifdef USE_GRIME
  roughnessFactor = clamp(roughnessFactor + grimeDirt * 0.1, 0.04, 1.0);
  #ifdef USE_WET
    roughnessFactor = mix(roughnessFactor, 0.16, grimeWet);
  #endif
#endif
`;

const FRAG_AFTER_LIGHTMAPS = /* glsl */`
#if defined( RE_IndirectDiffuse )
  irradiance += vBaked * PI * uBakeGain;
  iblIrradiance = vec3(0.0);
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
  {
    float bl = dot(vBaked, vec3(0.299, 0.587, 0.114));
    radiance *= mix(1.0, smoothstep(0.0, 0.45, bl), uEnvDarken);
  }
#endif
`;

const FRAG_AFTER_NORMAL = /* glsl */`
#ifdef USE_RIPPLE
  {
    vec2 rg = rippleGrad(vWPos.xz, uRippleAmb);
    rg += vec2(sin(vWPos.x * 1.9 + uTime * 0.7) + sin(vWPos.z * 3.1 - uTime * 1.1) * 0.5,
               cos(vWPos.z * 1.6 + uTime * 0.6) + cos(vWPos.x * 2.7 + uTime * 0.9) * 0.5) * 0.02 * uWaveAmp;
    normal = normalize(normal + (viewMatrix * vec4(-rg.x, 0.0, -rg.y, 0.0)).xyz);
  }
#elif defined( USE_WET )
  if (grimeWet > 0.02) {
    vec2 rg = rippleGrad(vWPos.xz, 0.15) * grimeWet;
    normal = normalize(normal + (viewMatrix * vec4(-rg.x, 0.0, -rg.y, 0.0)).xyz);
  }
#endif
`;

const FRAG_AFTER_EMISSIVE = /* glsl */`
#ifdef FIXTURE
  totalEmissiveRadiance *= vFix;
#endif
`;

const FRAG_FOG = /* glsl */`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogD = fogDensity;
    #ifdef FOG_LAYERED
      float fn = texture2D(uGrimeTex, vWPos.xz * 0.013 + vec2(uTime * 0.004, uTime * 0.0027)).b;
      fogD *= mix(1.0, 0.55 + fn * 0.9, uFogNoise);
    #endif
    float fogFactor = 1.0 - exp( - fogD * fogD * vFogDepth * vFogDepth );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif
`;

let materialCounter = 0;

/**
 * Patch a MeshStandardMaterial (or Physical) for the world lighting model.
 * opts: { bake: 'vertex'|'uniform', grime:number, wet:number, grimeTint:[r,g,b], fixture:bool, layeredFog:bool }
 */
function patchWorldMaterial(mat, opts = {}) {
  const bake = opts.bake || 'vertex';
  mat.defines = mat.defines || {};
  mat.defines.SPEC_ONLY_POINTS = '';
  if (bake === 'vertex') mat.defines.BAKE_VERTEX = '';
  if (opts.fixture) mat.defines.FIXTURE = '';
  if (opts.grime !== undefined && opts.grime !== null) mat.defines.USE_GRIME = '';
  if (opts.wet) mat.defines.USE_WET = '';
  if (opts.layeredFog) mat.defines.FOG_LAYERED = '';
  if (opts.ripple) mat.defines.USE_RIPPLE = '';
  if (opts.sway) mat.defines.USE_SWAY = '';

  const local = {
    uGrime: { value: opts.grime ?? 0 },
    uWet: { value: opts.wet ?? 0 },
    uGrimeTint: { value: new THREE.Color().fromArray(opts.grimeTint || [0.52, 0.45, 0.36]) },
    uBakedUniform: { value: new THREE.Vector3(0.3, 0.3, 0.3) },
    uFloorY: { value: opts.floorY ?? 0 },
    uRippleAmb: { value: opts.rippleAmb ?? 0.6 },
    uWaveAmp: { value: opts.waves ?? 0.4 },
    uSwayAmp: { value: opts.swayAmp ?? 1.0 },
  };
  mat.userData.local = local;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, GLOBAL_UNIFORMS, local);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\n' + VERT_DECL)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VERT_SWAY)
      .replace('#include <fog_vertex>', '#include <fog_vertex>\n' + VERT_MAIN);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FRAG_DECL)
      .replace('#include <map_fragment>', '#include <map_fragment>\n' + FRAG_AFTER_MAP)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + FRAG_AFTER_ROUGH)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_AFTER_NORMAL)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + FRAG_AFTER_EMISSIVE)
      .replace('#include <lights_fragment_maps>', '#include <lights_fragment_maps>\n' + FRAG_AFTER_LIGHTMAPS)
      .replace('#include <fog_fragment>', FRAG_FOG);
  };
  const key = 'world:' + bake + (opts.fixture ? ':fx' : '') + (mat.defines.USE_GRIME !== undefined ? ':g' : '') +
    (opts.wet ? ':w' : '') + (opts.layeredFog ? ':lf' : '') + (opts.ripple ? ':rp' : '') + (opts.sway ? ':sw' : '');
  mat.customProgramCacheKey = () => key;
  mat.userData.patchId = ++materialCounter;
  return mat;
}

function setBakedUniform(mat, r, g, b) {
  const u = mat.userData.local && mat.userData.local.uBakedUniform;
  if (u) u.value.set(r, g, b);
}

__e['installGlobalPatches'] = installGlobalPatches;
__e['patchWorldMaterial'] = patchWorldMaterial;
__e['setBakedUniform'] = setBakedUniform;
__e['GLOBAL_UNIFORMS'] = GLOBAL_UNIFORMS;
__e['addRipple'] = addRipple;
  return __e;
})();

})();
