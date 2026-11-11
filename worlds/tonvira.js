/* Tonvira: the peak. A marble floor high above a city at midnight, a colonnade, the glow of screens. */
import { THREE, mat, ground, points, standard } from "./kit.js";

export default function create({ lowTier }) {
  const group = new THREE.Group();

  const floor = ground(
    mat({
      fbody: /* glsl */ `
        vec2 q = vWorld.xz;
        float w = fbm(q * .16 + fbm(q * .4) * .7);
        float vein = pow(1. - abs(w * 2. - 1.), 60.) + pow(1. - abs(fbm(q * .5 + 7.) * 2. - 1.), 90.) * .5;
        vec3 a = mix(vec3(.03, .04, .07), vec3(.5, .55, .66), clamp(vein, 0., 1.) * .6);
        vec2 tq = abs(fract(q / 7. + .5) - .5);
        a *= 1. - smoothstep(.494, .5, max(tq.x, tq.y)) * .7;                         // slab joints
        // Columns ground themselves: a soft occlusion where each base meets the floor.
        vec2 cq = vec2(abs(q.x) - 6.5, mod(q.y + 3.5, 9.) - 4.5);
        a *= 1. - .75 * (1. - smoothstep(1.1, 2.6, length(cq))) * step(-30., q.y) * step(q.y, -4.);
        col = lit(a, vec3(0., 1., 0.), V, .05, .05) + vec3(.02, .05, .12) * exp(-length(q - vec2(-8., -14.)) * .22);
      `,
    }),
    72,
  );
  floor.position.z = -1;
  group.add(floor);

  // Fluted columns.
  const shaftGeo = new THREE.CylinderGeometry(0.85, 0.92, 15, 120, 1, true);
  {
    const pos = shaftGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), k = 1 - 0.07 * Math.pow(Math.abs(Math.sin(Math.atan2(z, x) * 10)), 0.7);
      pos.setXYZ(i, x * k, pos.getY(i), z * k);
    }
    shaftGeo.computeVertexNormals();
  }
  const marble = standard("#cfc8ba", 0.42);
  const block = new THREE.BoxGeometry(2.3, 0.5, 2.3);
  [[-6.5, -8], [6.5, -8], [-6.5, -17], [6.5, -17], [-6.5, -26], [6.5, -26]].forEach(([x, z]) => {
    const column = new THREE.Mesh(shaftGeo, marble);
    column.position.set(x, 7.9, z);
    const base = new THREE.Mesh(block, marble);
    base.position.set(x, 0.25, z);
    const cap = new THREE.Mesh(block, marble);
    cap.position.set(x, 15.6, z);
    group.add(column, base, cap);
  });

  // The window wall and the skyline beyond it.
  const frame = standard("#05070c", 0.5);
  for (let i = -6; i <= 6; i++) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.22, 34, 0.3), frame);
    mullion.position.set(i * 5.6, 17, -36);
    group.add(mullion);
  }
  group.add(points({ count: lowTier ? 500 : 1100, box: [300, 34, 70], centre: [0, 9, -120], size: 130, twinkle: 0.35, color: "#ffd9a0", alpha: 0.9 }));
  group.add(points({ count: lowTier ? 200 : 450, box: [300, 44, 70], centre: [0, 14, -120], size: 110, twinkle: 0.6, color: "#9fc4ff", alpha: 0.8 }));

  // Screens: rows of figures that never stop updating.
  const screen = mat({
    fog: false, side: THREE.DoubleSide,
    fbody: /* glsl */ `
      float row = floor(vUv.y * 30.);
      float len = .2 + .75 * h21(vec2(row, floor(uTime * .5 + row * .13)));
      float bar = step(vUv.x, len) * step(.3, fract(vUv.y * 30.)) * step(.04, vUv.x);
      col = vec3(.2, .55, 1.) * (bar * 1.1 + .05) * (1. - uVeil);
    `,
  });
  [[-11.5, 3.6, -12, 1.2], [-11.5, 3.6, -17, 1.2]].forEach(([x, y, z, ry]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 5.4), screen);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    group.add(m);
  });
  const glow = new THREE.PointLight("#3d7fe0", 40, 22, 2);
  glow.position.set(-9.5, 3.5, -14);
  group.add(glow);

  return {
    group,
    sky: { top: "#01030a", horizon: "#0e1a36", ground: "#010208" },
    sun: { dir: [-0.5, 0.6, 0.5], color: "#a9bfe8", intensity: 1.3 },
    key: { color: "#e8eefc", intensity: 1.5 },
    rim: { color: "#86a8d5", intensity: 2.6 },
    fog: { color: "#060b18", density: 0.009 },
    amb: 0.55, frost: 0.1, reflect: 0.42, shadow: 0.6,
    cam: { az: [-0.5, -0.14, 0.3], el: [0.13, 0.075, 0.06], dolly: [1.8, 1, 1.2] },
  };
}
