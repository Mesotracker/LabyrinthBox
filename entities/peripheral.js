// =============================================================================
//  Peripheral   (entity id: 'peripheral')
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
const { buildBody, headOn, HUMAN, result } = __mod['src/entities/models.js'].HELPERS;
const { animateBiped, Rig, skinMat } = __mod['src/entities/rig.js'];
const { ENTITY_DEFS } = __mod['src/entities/registry.js'];

/** Peripheral (Level 188): a shape that only exists at the edge of your vision. */
function buildPeripheral() {
  const p = { ...HUMAN, headR: 0.12, chestW: 0.3, armR: 0.7, legR: 0.7, upperArm: 0.36, foreArm: 0.36 };
  const rig = new Rig(p);
  const black = skinMat('#000000', { rough: 1, tint: '#000000', transparent: true, opacity: 0.85 });
  buildBody(rig, p, { skin: black, top: black, bottom: black, shoes: black }, { fingerLen: 0.1 });
  headOn(rig, p, black, 0.95, 1.2, 1.05);
  return result(rig, {
    kind: 'biped', height: 1.85, radius: 0.3, eyeY: 1.7,
    animate(st, dt) { st.lean = 0.05; st.tilt = 0.4; st.grip = 0.2; animateBiped(rig, st, dt); },
  });
}


__mod['src/entities/registry.js'].BUILDERS.peripheral = buildPeripheral;

ENTITY_DEFS.peripheral = { name: 'Peripheral', speed: 0.6, chase: 0, detect: 0, dmg: 0, reach: 0, cd: 1, memory: 0, passive: true, peripheral: true,
  num: 'Level 188 phenomenon', cls: 'Passive', size: 'unknown',
  desc: 'A figure that only exists at the edge of your vision. Turn to look and nothing is there.',
  notes: 'Peripherals do not seem to have a direct physical form. They cause mild paranoia rather than harm.',
  tips: ['Ignore them.', 'Keep moving; they cannot follow you anywhere you are looking.'] };
})();
